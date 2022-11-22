import seedrandom from 'seedrandom';

import { TileGenerator, TileGeneratorOpts } from './tile-generator';
import { ITile } from '../tile';

// Types
export interface RandomGeneratorOpts extends TileGeneratorOpts {
  readonly biomes: Record<string, number>;
  readonly seed?: string;
}

type Cumulated = [biome: string, f: number][];

// Class
export class RandomGenerator extends TileGenerator<RandomGeneratorOpts> {
  // Methods
  private _cumulate(biomes: Record<string, number>): Cumulated {
    const cumulated: Cumulated = [];

    // Cumulate
    let sum = 0;

    for (const biome of Object.keys(biomes)) {
      const frq = biomes[biome];

      if (frq > 0) {
        sum += frq;
        cumulated.push([biome, sum]);
      }
    }

    // Regulate
    for (let i = 0; i < cumulated.length; ++i) {
      cumulated[i][1] /= sum;
    }

    return cumulated;
  }

  private _select(biomes: Cumulated, val: number): string {
    for (const [biome, frq] of biomes) {
      if (val < frq) {
        return biome;
      }
    }

    return biomes[biomes.length - 1][0];
  }

  protected *generate(world: string, opts: RandomGeneratorOpts): Generator<ITile> {
    const biomes = this._cumulate(opts.biomes);
    const generator = seedrandom(opts.seed);

    const cnt: Record<string, number> = {};

    for (let y = opts.bbox.b; y < opts.bbox.t; ++y) {
      for (let x = opts.bbox.l; x < opts.bbox.r; ++x) {
        const biome = this._select(biomes, generator());
        cnt[biome] = (cnt[biome] ?? 0) + 1;

        yield { pos: { x, y }, biome };
      }
    }
  }
}
