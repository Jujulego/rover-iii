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
export async function listTileMaps(): Promise<TileMap[]> {
  const client = dynamodbClient();

  const keys = await client.query({
    TableName: process.env.DATA_TABLE_NAME,
    IndexName: 'table-index',
    KeyConditionExpression: '#table = :table',
    ExpressionAttributeNames: {
      '#table': 'table'
    },
    ExpressionAttributeValues: {
      ':table': 'tile-maps'
    }
  });

  if (!keys.Items) {
    return [];
  }

  const res = await client.batchGet({
    RequestItems: {
      [process.env.DATA_TABLE_NAME!]: {
        Keys: keys.Items
      }
    }
  });

  return res.Responses?.[process.env.DATA_TABLE_NAME!] as TileMap[] ?? [];
}

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
