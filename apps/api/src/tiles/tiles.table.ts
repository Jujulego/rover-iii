import { IVector, Rect } from '@ants/maths';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';

import { dynamodbClient } from '../dynamodb';
import { getTileMap } from '../tile-maps/tile-maps.table';

// Constants
const TABLE_NAME = process.env.TILES_TABLE_NAME!;

// Types
export interface Tile {
  blockId: string;
  tileId: string;
  mapId: string;
  pos: IVector;
  biome: string;
}

// Utils
function blockCoord(c: number, s: number): number {
  return Math.floor(c / s) * s;
}

// Operations
export async function listTiles(mapId: string, bbox: Rect): Promise<Tile[]> {
  // Get map
  const map = await getTileMap(mapId);

  if (!map) {
    return [];
  }

  // Query tiles
  const client = dynamodbClient();

  try {
    const tiles: Tile[] = [];
    const within = bbox.intersect(map.bbox);

    for (let by = blockCoord(within.t, map.blockSize); by <= within.b; by += map.blockSize) {
      for (let bx = blockCoord(within.l, map.blockSize); bx <= within.r; bx += map.blockSize) {
        const res = await client.send(new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression: 'blockId = :blockId',
          FilterExpression: '(pos.x BETWEEN :left AND :right) AND (pos.y BETWEEN :top AND :bottom)',
          ExpressionAttributeValues: {
            ':blockId': `${mapId}:${bx}:${by}`,
            ':top': within.t,
            ':bottom': within.b,
            ':left': within.l,
            ':right': within.r,
          }
        }));

        tiles.push(...res.Items as Tile[]);
      }
    }

    return tiles;
  } finally {
    client.destroy();
  }
}
