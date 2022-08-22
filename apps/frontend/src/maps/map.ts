import { IVector, Rect, Vector } from '@ants/maths';
import { Collection } from 'dexie';

import { BiomeName } from '../biomes';
import { db, TileEntity } from '../db';
import { Tile } from './tile';

// Class
export class Map {
  // Constructor
  constructor(readonly name: string, readonly bbox: Rect) {}

  // Statics
  static async fromArray(name: string, tiles: Tile[]): Promise<Map> {
    // Compute bbox
    const bbox = {
      t: Infinity,
      r: -Infinity,
      b: -Infinity,
      l: Infinity
    };

    for (const tile of tiles) {
      // Compute bbox
      bbox.t = Math.min(bbox.t, tile.pos.y);
      bbox.l = Math.min(bbox.l, tile.pos.x);
      bbox.b = Math.max(bbox.b, tile.pos.y);
      bbox.r = Math.max(bbox.r, tile.pos.x);
    }

    // Insert all tiles into database
    await db.tiles.bulkPut(tiles.map(tile => ({ map: name, ...tile })));

    return new Map(name, new Rect(bbox));
  }

  static async fromMatrix(name: string, matrix: (BiomeName | null)[][]): Promise<Map> {
    // Compute bbox
    const bbox = {
      t: 0,
      r: Math.max(...matrix.map(l => l.length)) - 1,
      b: matrix.length - 1,
      l: 0
    };

    // Insert all tiles into database
    await db.transaction('rw', db.tiles, () => {
      for (let y = 0; y < matrix.length; ++y) {
        const line = matrix[y];

        db.tiles.bulkPut(line
          .map((biome, x) => ({ map: name, pos: { x, y }, biome }))
          .filter((tile): tile is TileEntity => tile.biome !== null)
        );
      }
    });

    return new Map(name, new Rect(bbox));
  }

  // Methods
  tiles(): Collection<TileEntity> {
    return db.tiles
      .where(['map', 'pos.y', 'pos.x']).between(
      [this.name, this.bbox.t, this.bbox.l],
      [this.name, this.bbox.b + 1, this.bbox.r + 1],
      )
      .and(({ pos }) => this.bbox.contains(pos));
  }

  async tile(pos: Vector): Promise<Tile | null> {
    const res = await db.tiles.get([this.name, pos.y, pos.x]);

    if (!res) {
      return null;
    }

    return res;
  }

  async bulk(...positions: IVector[]): Promise<(Tile | null)[]> {
    const res = await db.tiles.bulkGet(positions.map(pos => [this.name, pos.y, pos.x]));
    return res.map(tile => tile ?? null);
  }

  // - utils
  sublayer(bbox: Rect): Map {
    return new Map(this.name, bbox);
  }
}
