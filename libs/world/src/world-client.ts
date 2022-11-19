import { IPoint, IRect } from '@jujulego/2d-maths';

import { ITile } from './tile';

// Types
export interface IWorldClient {
  // Methods
  getTile(world: string, pos: IPoint): Promise<ITile>;
  getBlock(world: string, bbox: IRect): Promise<ITile[]>;

  putTile(world: string, tile: ITile): Promise<void>;
}
