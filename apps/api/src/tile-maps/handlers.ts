import { BadRequest, NotFound } from 'http-errors';

import { apiGateway, auth } from '../middlewares';

import { createTileMapSchema, updateTileMapSchema } from './tile-map.schema';
import { createTileMap, getTileMap, listTileMaps, updateTileMap } from './tile-maps.table';

// Handlers
export const list = apiGateway(auth({ anonymous: true })(async () => {
  return await listTileMaps();
}));

export const create = apiGateway(auth()(async (event) => {
  const data = await createTileMapSchema.validate(JSON.parse(event.body ?? '{}'))
    .catch((err) => {
      throw new BadRequest(err.errors);
    });

  return await createTileMap(data);
}));

export const getById = apiGateway(auth({ anonymous: true })(async (event) => {
  const id = event.pathParameters?.id;
  const map = id && await getTileMap(id);

  if (!map) {
    throw new NotFound(`TileMap ${id} not found`);
  }

  return map;
}));

export const update = apiGateway(auth()(async (event) => {
  const id = event.pathParameters?.id;

  const data = await updateTileMapSchema.validate(JSON.parse(event.body ?? '{}'))
    .catch((err) => {
      throw new BadRequest(err.errors);
    });

  const map = id && await updateTileMap(id, data);

  if (!map) {
    throw new NotFound(`TileMap ${id} not found`);
  }

  return map;
}));
