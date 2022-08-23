import { IRect } from '@ants/maths';

import { dynamodbClient } from './client';

// Types
export interface TileMap {
  id: string;
  table: 'tile-map';
  name: string;
  bbox: IRect;
}

// Operations
export async function getTileMap(id: string): Promise<TileMap | undefined> {
  const client = dynamodbClient();

  const res = await client.get({
    TableName: process.env.DATA_TABLE_NAME,
    Key: {
      id,
      table: 'tile-maps'
    }
  });

  return res.Item as TileMap;
}
