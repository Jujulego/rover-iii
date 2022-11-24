import { IPoint, Point, point, rect, vector } from '@jujulego/2d-maths';

import { TileGenerator, TileGeneratorOpts } from './tile-generator';
import { ITile } from '../tile';
import { BST } from '../utils';
import { IWorld } from '../world';

// Constants
const DIRECTIONS = [
  vector(0, 1),
  vector(1, 1),
  vector(1, 0),
  vector(1, -1),
  vector(0, -1),
  vector(-1, -1),
  vector(-1, 0),
  vector(-1, 1),
];

// Class
export class CellularGenerator extends TileGenerator<TileGeneratorOpts> {
  // Attributes
  private _cacheSize = 0;
  private readonly _cache = BST.empty<ITile, IPoint>((tile) => tile.pos, Point.comparator('yx'));

  // Methods
  private _addToCache(tile: ITile): void {
    if (this._cache.search(tile.pos).length === 0) {
      this._cache.insert(tile);

      if (this._cache.length > this._cacheSize) {
        this._cache.pop();
      }
    }
  }

  private async _getNeighbors(world: IWorld, pos: Point): Promise<ITile[]> {
    const toRequest: IPoint[] = [];
    const result: ITile[] = [];

    // Read cache
    for (const dir of DIRECTIONS) {
      const n = pos.add(dir);
      const cached = this._cache.search(n);

      if (cached.length > 0) {
        result.push(cached[0]);
      } else {
        toRequest.push(n);
      }
    }

    // Request missing
    for (const tile of await this.client.bulkGetTile(world, toRequest)) {
      result.push(tile);

      if (tile) {
        this._addToCache(tile);
      }
    }

    return result;
  }

  protected async *generate(world: IWorld, opts: TileGeneratorOpts): AsyncGenerator<ITile | null> {
    if (!opts.base) {
      throw new Error('CellularGenerator needs a base world');
    }

    console.log({ world, opts });

    // Clear cache
    this._cache.clear();
    this._cacheSize = rect(opts.bbox).size.dy * 2 + 2;

    // Algorithm
    for (let y = opts.bbox.b; y < opts.bbox.t; ++y) {
      for (let x = opts.bbox.l; x < opts.bbox.r; ++x) {
        const pos = point(x, y);

        // Evaluate surroundings
        const neighbors = await this._getNeighbors(opts.base, pos);
        const biomes: Record<string, number> = {};

        for (const n of neighbors) {
          if (!pos.equals(n.pos)) {
            biomes[n.biome] = (biomes[n.biome] ?? 0) + 1;
          }
        }

        // Update tile
        let sent = false;

        for (const [biome, cnt] of Object.entries(biomes)) {
          if (cnt > 4) {
            yield { pos, biome };

            sent = true;
            break;
          }
        }

        if (!sent) {
          yield null;
        }
      }
    }
  }
}
