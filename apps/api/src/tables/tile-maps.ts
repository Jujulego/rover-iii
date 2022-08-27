import { IRect } from '@ants/maths';
import { BatchGetCommand, DynamoDBDocumentClient, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

// Types
export interface TileMap {
  id: string;
  table: 'tile-map';
  name: string;
  bbox: IRect;
}

// Operations
export async function listTileMaps(): Promise<TileMap[]> {
  const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

  try {
    const keys = await client.send(new QueryCommand({
      TableName: process.env.DATA_TABLE_NAME,
      IndexName: 'table-index',
      KeyConditionExpression: '#table = :table',
      ExpressionAttributeNames: {
        '#table': 'table'
      },
      ExpressionAttributeValues: {
        ':table': 'tile-maps'
      }
    }));

    if (!keys.Items) {
      return [];
    }

    const res = await client.send(new BatchGetCommand({
      RequestItems: {
        [process.env.DATA_TABLE_NAME!]: {
          Keys: keys.Items
        }
      }
    }));

    return res.Responses?.[process.env.DATA_TABLE_NAME!] as TileMap[] ?? [];
  } finally {
    client.destroy();
  }
}

export async function getTileMap(id: string): Promise<TileMap | undefined> {
  const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

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
