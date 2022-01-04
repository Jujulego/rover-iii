import { BiomeName } from '../../biomes';
import { ISize, Vector } from '../../math2d';

import { Layer } from '../layer';
import { Tile } from '../tile';

// Generator
export function simpleLayer(size: ISize, biome: BiomeName): Layer {
  const tiles: Tile[] = [];

  for (let y = 0; y < size.h; ++y) {
    for (let x = 0; x < size.w; ++x) {
      if (biome) {
        tiles.push({
          pos: new Vector(x, y),
          biome
        });
      }
    }
  }

  return Layer.fromArray(tiles);
}
