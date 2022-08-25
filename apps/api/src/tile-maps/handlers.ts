import { NotFound } from 'http-errors';

import { apiGateway } from '../middlewares';
import { getTileMap, listTileMaps } from '../tables/tile-maps';

// Handlers
export const list = apiGateway(async () => {
  return await listTileMaps();
});

export const getById = apiGateway(async (event) => {
  const id = event.pathParameters?.id;
  const map = id && await getTileMap(id);

  if (!map) {
    throw new NotFound(`TileMap ${id} not found`);
  }

  return map;
});
