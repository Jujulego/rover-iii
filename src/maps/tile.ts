import { BiomeName } from '../biomes';
import { Vector } from '../math2d';

// Interface
export interface Tile {
  pos: Vector;
  biome: BiomeName;
}
