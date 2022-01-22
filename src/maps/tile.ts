import { BiomeName } from '../biomes';
import { IVector } from '../math2d';

// Interface
export interface Tile {
  pos: IVector;
  biome: BiomeName;
}
