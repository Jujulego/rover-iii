import { IRect } from '@ants/maths';
import { $entity, $store } from '@jujulego/aegis';

import { $api } from '../api';

// Types
export interface ITileMap {
  id: string;
  table: 'tile-map';
  name: string;
  bbox: IRect;
}

export type TileMapDTO = Pick<ITileMap, 'name' | 'bbox'>;

// Entity
export const TileMap = $entity('TileMap', $store.memory(), (itm: ITileMap) => itm.id)
  .$protocol(({ $list, $item }) => ({
    findAll: $list.query($api.get`/api/tile-maps`),
    create: $item.mutate($api.post<ITileMap>`/api/tile-maps`.body<TileMapDTO>()),
    update: $item.mutate(
      $api.put<ITileMap, ['id']>`/api/tile-maps/${'id'}`
        .body<Partial<TileMapDTO>>(),
      ({ id }) => id as string
    ),
    delete: $item.delete($api.delete`/api/tile-maps/${'id'}`, ({ id }) => id as string)
  }));
