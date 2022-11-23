import { IPoint, Point, point, rect, vector } from '@jujulego/2d-maths';

import { TileGenerator, TileGeneratorOpts } from './tile-generator';
import { ITile } from '../tile';
import { BST } from '../utils';

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

// Types
export interface CellularGeneratorOpts extends TileGeneratorOpts {
  readonly previous: number;
}

// Class
export class CellularGenerator extends TileGenerator<CellularGeneratorOpts> {
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

  private async _getNeighbors(world: string, pos: Point, version: number): Promise<ITile[]> {
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
    for (const tile of await this.client.bulkGetTile(world, toRequest, { version })) {
      result.push(tile);

      if (tile) {
        this._addToCache(tile);
      }
    }

    return result;
    // return await this.client.loadTilesIn(world, rect(pos.add({ dx: -1, dy: -1 }), { dx: 3, dy: 3 }), { version });
  }

  protected async *generate(world: string, opts: CellularGeneratorOpts): AsyncGenerator<ITile | null> {
    // Clear cache
    this._cache.clear();
    this._cacheSize = rect(opts.bbox).size.dy * 2 + 2;

    // Algorithm
    for (let y = opts.bbox.b; y < opts.bbox.t; ++y) {
      for (let x = opts.bbox.l; x < opts.bbox.r; ++x) {
        const pos = point(x, y);

        // Evaluate surroundings
        const neighbors = await this._getNeighbors(world, pos, opts.previous);
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
