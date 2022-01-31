import seedrandom from 'seedrandom';

import { BiomeName, BIOME_NAMES } from '../../biomes';
import { Rect, ISize, Vector } from '../../math2d';

import { Map } from '../map';
import { MapGenerator, MapOptions } from './MapGenerator';
import { BiomesFrequencies } from './RandomGenerator';

// Types
export type BiomeMatrix = BiomeName[][];

export interface CellularOptions extends MapOptions {
  biomes: Partial<BiomesFrequencies>;
  seed?: string;
  iterations?: number;
  outBiome?: BiomeName;
}

// Constants
const DIRECTIONS = [
  { x:  0, y:  1 },
  { x:  1, y:  1 },
  { x:  1, y:  0 },
  { x:  1, y: -1 },
  { x:  0, y: -1 },
  { x: -1, y: -1 },
  { x: -1, y:  0 },
  { x: -1, y:  1 },
];

// Class
export class CellularGenerator extends MapGenerator<CellularOptions> {
  // Methods
  private _biomesFrequencies(): BiomesFrequencies {
    const freqs = {} as BiomesFrequencies;

    for (const name of BIOME_NAMES) {
      freqs[name] = 0;
    }

    return freqs;
  }

  private _cumulate(biomes: Partial<BiomesFrequencies>): BiomesFrequencies {
    // Compute cumulated frequencies
    const cumulated = this._biomesFrequencies();
    let sum = 0;

    for (const name of BIOME_NAMES) {
      sum += biomes[name] ?? 0;
      cumulated[name] = sum;
    }

    // Regulate frequencies
    for (const name of BIOME_NAMES) {
      cumulated[name] /= sum;
    }

    return cumulated;
  }

  private _initiate(size: ISize, biomes: Partial<BiomesFrequencies>, seed: string | undefined): BiomeMatrix {
    // Initiate
    const frequencies = this._cumulate(biomes);
    const matrix: BiomeMatrix = [];
    const prng = seedrandom(seed);

    // Generate
    for (let y = 0; y < size.h; ++y) {
      matrix.push([]);

      for (let x = 0; x < size.w; ++x) {
        const random = prng();

        for (const name of BIOME_NAMES) {
          if (random < frequencies[name]) {
            matrix[y].push(name);
            break;
          }
        }
      }
    }

    return matrix;
  }

  private _evaluateSurroundings(matrix: BiomeMatrix, bbox: Rect, pos: Vector, outBiome: BiomeName): BiomesFrequencies {
    // Initiate
    const biomes = this._biomesFrequencies();

    for (const dir of DIRECTIONS) {
      const p = pos.add(dir);

      if (p.within(bbox)) {
        const b = matrix[p.y][p.x];
        biomes[b]++;
      } else {
        biomes[outBiome]++;
      }
    }

    return biomes;
  }

  async run(name: string, size: ISize, opts: CellularOptions): Promise<Map> {
    const {
      seed, biomes,
      iterations = 5,
      outBiome = 'water'
    } = opts;

    // Cellular algorithm
    const matrix = this._initiate(size, biomes, seed);
    const bbox = new Rect(0, 0, size.h - 1, size.w - 1);

    for (let i = 0; i < iterations; ++i) {
      for (let y = 0; y < size.h; ++y) {
        for (let x = 0; x < size.w; ++x) {
          // Count surrounding biomes
          const biomes = this._evaluateSurroundings(matrix, bbox, new Vector(x, y), outBiome);

          // Changes
          for (const name of BIOME_NAMES) {
            if (biomes[name] > 4) {
              matrix[y][x] = name;
              break;
            }
          }
        }
      }
    }

    return await Map.fromMatrix(name, matrix);
  }
}
