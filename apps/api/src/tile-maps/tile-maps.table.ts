import { IRect } from '@ants/maths';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import {
  BatchGetCommand, DeleteCommand,
  GetCommand,
  paginateQuery,
  PutCommand,
  QueryCommandInput,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuid } from 'uuid';

import { dynamodbClient } from '../dynamodb';

import { CreateTileMapData, UpdateTileMapData } from './tile-map.schema';

// Constants
const TABLE_NAME = process.env.DATA_TABLE_NAME!;

// Types
export interface TileMap {
  id: string;
  table: 'tile-maps';
  name: string;
  bbox: IRect;
  blockSize: number;
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

export async function createTileMap(data: CreateTileMapData): Promise<TileMap> {
  const client = dynamodbClient();

  try {
    const tileMap: TileMap = {
      id: uuid(),
      table: 'tile-maps',
      ...data
    };

    await client.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: tileMap
    }));

    return tileMap;
  } finally {
    client.destroy();
  }
}

export async function getTileMap(id: string): Promise<TileMap | undefined> {
  const client = dynamodbClient();

  try {
    const res = await client.send(new GetCommand({
      TableName: TABLE_NAME,
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

export async function updateTileMap(id: string, data: UpdateTileMapData): Promise<TileMap | undefined> {
  const client = dynamodbClient();

  try {
    // Prepare expression
    const expr: string[] = [];
    const names: Record<string, string> = {};
    const values: Record<string, unknown> = { ':id': id };

    for (const [key, val] of Object.entries(data)) {
      if (val === null) continue;

      expr.push(`#${key}=:${key}`);
      names[`#${key}`] = key;
      values[`:${key}`] = val;
    }

    // Update !
    const res = await client.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        id,
        table: 'tile-maps'
      },
      ConditionExpression: 'id = :id', // Asserts item exists !
      UpdateExpression: `SET ${expr.join(', ')}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ReturnValues: 'ALL_NEW',
    }));

    return res.Attributes as TileMap;
  } catch (err) {
    if (err instanceof ConditionalCheckFailedException) {
      // Object does not exists !
      return undefined;
    }

    throw err;
  } finally {
    client.destroy();
  }
}

export async function deleteTileMap(id: string): Promise<void> {
  const client = dynamodbClient();

  try {
    await client.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        id,
        table: 'tile-maps'
      }
    }));
  } finally {
    client.destroy();
  }
}
