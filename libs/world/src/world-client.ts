import { IPoint, IRect } from '@jujulego/2d-maths';

import { ITile } from './tile';

// Type
export interface TileOpts {
  readonly version?: number;
}

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
   * @param opts
   */
  abstract getTile(world: string, pos: IPoint, opts?: TileOpts): Promise<ITile>;

  /**
   * Direct access to many tiles
   *
   * @param world
   * @param pos
   * @param opts
   */
  abstract bulkGetTile(world: string, pos: IPoint[], opts?: TileOpts): Promise<ITile[]>;

  /**
   * Load all tiles within the given bounding box
   *
   * @param world
   * @param bbox
   * @param opts
   */
  abstract loadTilesIn(world: string, bbox: IRect, opts?: TileOpts): Promise<ITile[]>;

  /**
   * Store the tile
   *
   * @param world
   * @param tile
   * @param opts
   */
  abstract putTile(world: string, tile: ITile, opts?: TileOpts): Promise<void>;

  /**
   * Store all the tiles in one request
   *
   * @param world
   * @param tiles
   * @param opts
   */
  abstract bulkPutTile(world: string, tiles: ITile[], opts?: TileOpts): Promise<void>;


  /**
   * Deletes all data for given world
   */
  abstract clear(world: string): Promise<void>;
}
