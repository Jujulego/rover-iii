import { NotFound } from 'http-errors';

import { apiGateway } from '../middlewares/api-gateway';
import { getTileMap } from '../tables/tile-maps';

// Handlers
export const getById = apiGateway(async (event) => {
  const id = event.pathParameters?.id;
  const map = id && await getTileMap(id);

  if (!map) {
    throw new NotFound(`TileMap ${id} not found`);
  }

  return map;
});
