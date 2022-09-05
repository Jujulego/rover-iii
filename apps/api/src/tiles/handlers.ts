import { bboxSchema } from '../bbox.schema';
import { apiGateway, auth } from '../middlewares';
import { listTiles } from './tiles.table';
import { Rect } from '@ants/maths';

// Handlers
export const list = apiGateway(auth({ anonymous: true })(async (event) => {
  const id = event.pathParameters?.id;
  const bbox = await bboxSchema.validate(event.queryStringParameters);

  if (!id) {
    return [];
  }

  return await listTiles(id, new Rect(bbox));
}));
