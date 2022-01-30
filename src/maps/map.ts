import { Collection } from 'dexie';

import { BiomeName } from '../biomes';
import { db, TileEntity } from '../db';
import { Rect, Vector } from '../math2d';

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
  tiles(): Collection<Tile> {
    return db.tiles
      .where('[map+pos.x+pos.y]').between(
      [this.name, this.bbox.l, this.bbox.t],
      [this.name, this.bbox.r + 1, this.bbox.b + 1],
      );
  }

  async tile(pos: Vector): Promise<Tile | null> {
    const res = await db.tiles.get([this.name, pos.x, pos.y]);

    if (!res) {
      return null;
    }

    return res;
  }

  async bulk(...positions: Vector[]): Promise<(Tile | null)[]> {
    const res = await db.tiles.bulkGet(positions.map(pos => [this.name, pos.x, pos.y]));
    return res.map(tile => tile ?? null);
  }

  // - utils
  sublayer(bbox: Rect): Map {
    return new Map(this.name, bbox);
  }
}
