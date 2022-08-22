import { IVector } from '@ants/maths';

import { BiomeName } from '../biomes';

// Interface
export interface Tile {
  pos: IVector;
  biome: BiomeName;
}
