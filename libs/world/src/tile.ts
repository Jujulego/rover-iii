import { IPoint } from '@jujulego/2d-maths';

// Interface
/**
 * Square unit of ground
 */
export interface ITile {
  /**
   * Position of this time in the world
   */
  readonly pos: IPoint;

  /**
   * Environment kind in the tile
   */
  readonly biome: string;
}
