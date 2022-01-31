import { BiomeName, BIOME_NAMES } from '../../biomes';
import { ISize, Vector } from '../../math2d';

import { Map } from '../map';
import { RandomGenerator, RandomGeneratorOptions } from './RandomGenerator';
import { db, TileEntity } from '../../db';

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

// Class
export class CellularGenerator extends RandomGenerator<CellularOptions> {
  // Methods
  private _biomeMap<D>(val: D): Record<BiomeName, D> {
    const frqs = {} as Record<BiomeName, D>;

    for (const name of BIOME_NAMES) {
      frqs[name] = val;
   }

    return frqs;
  }

  private async _evaluateTile(tile: TileEntity, outBiome: BiomeName) {
    // Read tiles and count biomes
    const counts = this._biomeMap(0);
    const keys: [string, number, number][] = [];

    for (const dir of DIRECTIONS) {
      const p = dir.add(tile.pos);
      keys.push([tile.map, p.x, p.y]);
    }

    for (const tile of await db.tiles.bulkGet(keys)) {
      if (tile) {
        counts[tile.biome]++;
      } else {
        counts[outBiome]++;
      }
    }

    // Set tile to new biome
    for (const biome of BIOME_NAMES) {
      if (counts[biome] > 4) {
        tile.biome = biome;
        return await db.tiles.put(tile);
      }
    }
  }

  run(name: string, size: ISize, opts: CellularOptions): Promise<Map> {
    return db.transaction('rw', db.tiles, async () => {
      // Initiate with random data
      const map = await super.run(name, size, opts);

      // Cellular algorithm
      const {
        iterations = 5,
        outBiome = 'water'
      } = opts;

      for (let i = 0; i < iterations; ++i) {
        for (const tile of await map.tiles().toArray()) {
          await this._evaluateTile(tile, outBiome);
        }
      }

      return map;
    });
  }
}
