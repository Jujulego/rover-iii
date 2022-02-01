import { BiomeName, BIOME_NAMES } from '../biomes';
import { db, TileEntity } from '../db';
import { IVector, Vector } from '../math2d';
import { Map, Tile } from '../maps';
import { BST } from '../utils';

import { RandomGenerator, RandomGeneratorOptions } from './RandomGenerator';
import { RegisterMapGenWorker } from './worker/MapGenMessageHandler';

// Types
export interface CellularOptions extends RandomGeneratorOptions {
  iterations?: number;
  outBiome?: BiomeName;
}

// Constants
const DIRECTIONS = [
  new Vector({ x:  0, y:  1 }),
  new Vector({ x:  1, y:  1 }),
  new Vector({ x:  1, y:  0 }),
  new Vector({ x:  1, y: -1 }),
  new Vector({ x:  0, y: -1 }),
  new Vector({ x: -1, y: -1 }),
  new Vector({ x: -1, y:  0 }),
  new Vector({ x: -1, y:  1 }),
];

// Utils
function biomeMap<D>(val: D): Record<BiomeName, D> {
    const frqs = {} as Record<BiomeName, D>;

    for (const name of BIOME_NAMES) {
    frqs[name] = val;
  }

  return frqs;
}

// Class
@RegisterMapGenWorker
export class CellularGeneratorWorker extends RandomGenerator<CellularOptions> {
  // Attributes
  private _cacheSize = 0;
  private readonly _cache = BST.empty<Tile, IVector>((tile) => tile.pos, (a, b) => new Vector(a).compare(b, 'yx'));

  // Methods
  private _addToCache(tile: Tile): void {
    if (this._cache.search(tile.pos).length === 0) {
      this._cache.insert(tile);

      if (this._cache.length > this._cacheSize) {
        this._cache.pop();
      }
    }
  }

  private async _getTiles(map: Map, neighbors: IVector[]): Promise<(Tile | null)[]> {
    const toRequest: IVector[] = [];
    const result: (Tile | null)[] = [];

    for (const n of neighbors) {
      if (!map.bbox.contains(n)) {
        result.push(null);
        continue;
      }

      const cached = this._cache.search(n);

      if (cached.length > 0) {
        result.push(cached[0]);
      } else {
        toRequest.push(n);
      }
    }

    for (const tile of await map.bulk(...toRequest)) {
      result.push(tile);

      if (tile) {
        this._addToCache(tile);
      }
    }

    return result;
  }

  private async _evaluateTile(tile: TileEntity, map: Map, outBiome: BiomeName): Promise<TileEntity | void> {
    // Read tiles and count biomes
    const counts = biomeMap(0);
    const neighbors: IVector[] = [];

    for (const dir of DIRECTIONS) {
      const p = dir.add(tile.pos);
      neighbors.push(p);
    }

    for (const tile of await this._getTiles(map, neighbors)) {
      if (tile) {
        counts[tile.biome]++;
      } else {
        counts[outBiome]++;
      }
    }

    // Set tile to new biome
    for (const biome of BIOME_NAMES) {
      if (counts[biome] > 4) {
        return { ...tile, biome };
      }
    }
  }

  async run(map: Map, opts: CellularOptions): Promise<void> {
    this._cacheSize = map.bbox.w * 2 + 2;

    // Initiate with random data
    await super.run(map, opts);

    // Cellular algorithm
    const {
      iterations = 5,
      outBiome = 'water'
    } = opts;

    for (let i = 0; i < iterations; ++i) {
      const updates: TileEntity[] = [];
      this._cache.clear();

      await db.transaction('r', db.tiles, async () => {
        for (const tile of await map.tiles().toArray()) {
          this._addToCache(tile);
          const res = await this._evaluateTile(tile, map, outBiome);

          if (res) {
            updates.push(res);
          }
        }
      });

      await db.tiles.bulkPut(updates);
    }
  }
}
