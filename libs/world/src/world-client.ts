import { IPoint, IRect } from '@jujulego/2d-maths';

import { ITile } from './tile';

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
  abstract getTile(world: string, pos: IPoint): Promise<ITile | undefined>;

  /**
   * Load all tiles within the given bounding box
   *
   * @param world
   * @param bbox
   */
  abstract loadTilesIn(world: string, bbox: IRect): AsyncGenerator<ITile>;

  /**
   * Store the tile
   *
   * @param world
   * @param tile
   */
  abstract putTile(world: string, tile: ITile): Promise<void>;

  /**
   * Store all the tiles in one request
   *
   * @param world
   * @param tiles
   */
  abstract bulkPutTile(world: string, tiles: ITile[]): Promise<void>;
}
