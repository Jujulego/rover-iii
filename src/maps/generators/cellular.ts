import seedrandom from 'seedrandom';

import { BiomeName, BIOME_NAMES } from '../../biomes';
import { Rect, ISize, Vector } from '../../math2d';

import { Map } from '../map';

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

// Type
export type BiomeMatrix = BiomeName[][];
export type BiomesFrequencies = Record<BiomeName, number>;

export interface CellularOptions {
  seed?: string;
  iterations?: number;
  outBiome?: BiomeName;
}

// Utils
function biomesFrequencies(): BiomesFrequencies {
  const freqs = {} as BiomesFrequencies;

  for (const name of BIOME_NAMES) {
    freqs[name] = 0;
  }

  return freqs;
}

// Generator
function prepareFrequencies(biomes: Partial<BiomesFrequencies>): BiomesFrequencies {
  // Compute cumulated frequencies
  const cumulated = biomesFrequencies();
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

function randomMatrix(size: ISize, biomes: Partial<BiomesFrequencies>, seed: string | undefined): BiomeMatrix {
  // Initiate
  const frequencies = prepareFrequencies(biomes);
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

function evaluateSurroundings(matrix: BiomeMatrix, bbox: Rect, pos: Vector, outBiome: BiomeName): BiomesFrequencies {
  // Initiate
  const biomes = biomesFrequencies();

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

export function cellularMap(size: ISize, biomes: Partial<BiomesFrequencies>, options: CellularOptions = {}): Map {
  const {
    seed,
    iterations = 5,
    outBiome = 'water'
  } = options;

  // Cellular algorithm
  const matrix = randomMatrix(size, biomes, seed);
  const bbox = new Rect(0, 0, size.h - 1, size.w - 1);

  for (let i = 0; i < iterations; ++i) {
    for (let y = 0; y < size.h; ++y) {
      for (let x = 0; x < size.w; ++x) {
        // Count surrounding biomes
        const biomes = evaluateSurroundings(matrix, bbox, new Vector(x, y), outBiome);

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

  return Map.fromMatrix(matrix);
}
