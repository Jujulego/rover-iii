import seedrandom from 'seedrandom';

import { BIOME_NAMES, BiomeName } from '../../biomes';
import { db, TileEntity } from '../../db';
import { ISize, Rect, Vector } from '../../math2d';

import { Map } from '../map';
import { MapOptions } from './MapGenerator';
import { MapIterator } from './MapIterator';

// Types
export type BiomesFrequencies = Record<BiomeName, number>;

export interface RandomGeneratorOptions extends MapOptions {
  biomes: Partial<BiomesFrequencies>;
  seed?: string;
}

// Class
export class RandomGenerator extends MapIterator<RandomGeneratorOptions> {
  // Attributes
  private _generator = seedrandom();
  private _cumulated?: BiomesFrequencies;

  // Methods
  protected biomesFrequencies(): BiomesFrequencies {
    const freqs = {} as BiomesFrequencies;

    for (const name of BIOME_NAMES) {
      freqs[name] = 0;
    }

    return freqs;
  }

  private _cumulate(biomes: Partial<BiomesFrequencies>): BiomesFrequencies {
    // Compute cumulated frequencies
    const cumulated = this.biomesFrequencies();
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

  protected bbox(size: ISize): Rect {
    return new Rect(0, 0, size.h - 1, size.w - 1);
  }

  protected *iterate(name: string, size: ISize, opts: RandomGeneratorOptions): Generator<TileEntity> {
    for (let y = 0; y < size.h; ++y) {
      for (let x = 0; x < size.w; ++x) {
        const random = this._generator.quick();

        for (const biome of BIOME_NAMES) {
          if (random < this._cumulated![biome]) {
            yield {
              map: name,
              pos: new Vector(x, y),
              biome: biome
            };

            break;
          }
        }
      }
    }
  }


  async generate(name: string, size: ISize, opts: RandomGeneratorOptions): Promise<Map> {
    this._generator = seedrandom(opts.seed);
    this._cumulated = this._cumulate(opts.biomes);

    return super.generate(name, size, opts);
  }
}
