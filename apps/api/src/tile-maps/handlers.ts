import { NotFound } from 'http-errors';

import { apiGateway, auth } from '../middlewares';

import { getTileMap, listTileMaps } from './tile-maps.table';

// Handlers
export const list = apiGateway(auth({ anonymous: true })(async () => {
  return await listTileMaps();
}));

export const getById = apiGateway(auth({ anonymous: true })(async (event) => {
  const id = event.pathParameters?.id;
  const map = id && await getTileMap(id);

  if (!map) {
    throw new NotFound(`TileMap ${id} not found`);
  }

  return map;
}));
