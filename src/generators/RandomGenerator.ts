import seedrandom from 'seedrandom';

import { BIOME_NAMES, BiomeName } from '../biomes';
import { TileEntity } from '../db';
import { Map } from '../maps';
import { ISize, Rect, Vector } from '../math2d';
import { BST } from '../utils';

import { MapGenOptions } from './MapGenerator';
import { MapIterator } from './MapIterator';

// Types
export type BiomesFrequencies = Record<BiomeName, number>;

export interface RandomGeneratorOptions extends MapGenOptions {
  biomes: Partial<BiomesFrequencies>;
  seed?: string;
}

// Class
export class RandomGenerator<O extends RandomGeneratorOptions> extends MapIterator<O> {
  // Attributes
  private _generator = seedrandom();
  private _cumulated = BST.empty<[BiomeName, number], number>(([,k]) => k, (a, b) => a - b);

  // Methods
  private _cumulate(frequencies: Partial<BiomesFrequencies>) {
    // Compute cumulated frequencies
    const cumulated: [BiomeName, number][] = [];
    let sum = 0;

    for (const biome of BIOME_NAMES) {
      const frq = frequencies[biome];

      if (frq) {
        sum += frq;
        cumulated.push([biome, sum]);
      }
    }

    // Regulate frequencies
    for (let i = 0; i < cumulated.length; ++i) {
      cumulated[i][1] /= sum;
    }

    this._cumulated = BST.fromArray<[BiomeName, number], number>(cumulated, ([,k]) => k, (a, b) => b - a);
  }

  protected bbox(size: ISize): Rect {
    return new Rect(0, 0, size.h - 1, size.w - 1);
  }

  protected *iterate(name: string, size: ISize,): Generator<TileEntity> {
    for (let y = 0; y < size.h; ++y) {
      for (let x = 0; x < size.w; ++x) {
        const res = this._cumulated.nearest(this._generator(), 'lte');

        if (res) {
          yield {
            map: name,
            pos: new Vector(x, y),
            biome: res[0]
          };
        }
      }
    }
  }

  protected async run(name: string, size: ISize, opts: O): Promise<Map> {
    this._cumulate(opts.biomes);
    this._generator = seedrandom(opts.seed);

    return super.run(name, size, opts);
  }
}
