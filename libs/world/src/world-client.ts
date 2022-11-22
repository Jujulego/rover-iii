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
  abstract getTile(world: IWorld, pos: IPoint): Promise<ITile | undefined>;

  /**
   * Load all tiles within the given bounding box
   *
   * @param world
   * @param bbox
   */
  abstract loadTilesIn(world: IWorld, bbox: IRect): Promise<ITile[]>;

  /**
   * Store the tile
   *
   * @param world
   * @param tile
   */
  abstract putTile(world: IWorld, tile: ITile): Promise<void>;

  /**
   * Store all the tiles in one request
   *
   * @param world
   * @param tiles
   */
  abstract bulkPutTile(world: IWorld, tiles: ITile[]): Promise<void>;


  /**
   * Deletes all data for given world
   */
  abstract clear(world: IWorld): Promise<void>;
}
