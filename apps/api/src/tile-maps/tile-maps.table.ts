import { IRect } from '@ants/maths';
import { BatchGetCommand, GetCommand, paginateQuery, QueryCommandInput } from '@aws-sdk/lib-dynamodb';

import { dynamodbClient } from '../dynamodb';

// Constants
const TABLE_NAME = process.env.DATA_TABLE_NAME!;

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

  try {
    const maps: TileMap[] = [];

    const indexQuery: QueryCommandInput = {
      TableName: TABLE_NAME,
      IndexName: 'table-index',
      KeyConditionExpression: '#table = :table',
      ExpressionAttributeNames: {
        '#table': 'table'
      },
      ExpressionAttributeValues: {
        ':table': 'tile-maps'
      }
    };

    // Paginate on keys (from index)
    for await (const keys of paginateQuery({ client }, indexQuery)) {
      if (!keys.Items) {
        continue;
      }

      // Request items
      const res = await client.send(new BatchGetCommand({
        RequestItems: {
          [TABLE_NAME]: {
            Keys: keys.Items
          }
        }
      }));

      if (res.Responses?.[TABLE_NAME]) {
        maps.push(...res.Responses[TABLE_NAME] as TileMap[]);
      }
    }

    return maps;
  } finally {
    client.destroy();
  }
}

export async function getTileMap(id: string): Promise<TileMap | undefined> {
  const client = dynamodbClient();

  try {
    const res = await client.send(new GetCommand({
      TableName: process.env.DATA_TABLE_NAME,
      Key: {
        id,
        table: 'tile-maps'
      }
    }));

    return res.Item as TileMap;
  } finally {
    client.destroy();
  }
}
