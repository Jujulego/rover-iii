import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { getTileMap } from '../tables/tile-maps';

// Handlers
export const getById: APIGatewayProxyHandlerV2 = async (event) => {
  const id = event.pathParameters?.id;
  const map = id && await getTileMap(id);

  if (!map) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: `TileMap ${id} not found`
      })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(map)
  };
};
