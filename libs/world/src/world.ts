import { IPoint, IRect } from '@jujulego/2d-maths';
import { $entity, $item, $list, $mutation, $queryfy, $store, Entity } from '@jujulego/aegis';

import { ITile } from './tile';
import { IWorldClient } from './world-client';

// Class
export class World {
  // Attributes
  private readonly _tiles: Entity<ITile>;

  // Constructor
  constructor(
    readonly name: string,
    readonly client: IWorldClient,
  ) {
    const entity = $entity(`${name}-tiles`, $store.memory(), (tile: ITile) => `${tile.pos.x},${tile.pos.y}`);
    this._tiles = entity.$entity;
  }

  // Methods
  tile(pos: IPoint) {
    return $item(this._tiles, `${pos.x},${pos.y}`, () => $queryfy(this.client.getTile(this.name, pos)));
  }

  block(bbox: IRect) {
    return $list(this._tiles, `${bbox.t},${bbox.l},${bbox.r},${bbox.b}`, () => $queryfy(this.client.getBlock(this.name, bbox)));
  }

  putTile(tile: ITile) {
    return $mutation(this._tiles, $queryfy(this.client.putTile(this.name, tile)), `${tile.pos.x},${tile.pos.y}`);
  }
}
