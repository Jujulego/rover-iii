import { IPoint, IRect } from '@jujulego/2d-maths';

import { ITile } from './tile';
import { IWorld } from './world';

// Class
/**
 * Base for accessing world's data
 */
export abstract class WorldClient {
  // Methods
  /**
   * Direct access to one tile
   *
   * @param world
   * @param pos
   */
  abstract getTile(world: string | IWorld, pos: IPoint): Promise<ITile>;

  /**
   * Direct access to many tiles
   *
   * @param world
   * @param pos
   */
  abstract bulkGetTile(world: string | IWorld, pos: IPoint[]): Promise<ITile[]>;

  /**
   * Load all tiles within the given bounding box
   *
   * @param world
   * @param bbox
   */
  abstract loadTilesIn(world: string | IWorld, bbox: IRect): Promise<ITile[]>;

  /**
   * Store the tile
   *
   * @param world
   * @param tile
   */
  abstract putTile(world: string | IWorld, tile: ITile): Promise<void>;

  /**
   * Store all the tiles in one request
   *
   * @param world
   * @param tiles
   */
  abstract bulkPutTile(world: string | IWorld, tiles: ITile[]): Promise<void>;


  /**
   * Deletes all data for given world
   */
  abstract clear(world: string): Promise<void>;
}
