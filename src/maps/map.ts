import { BiomeName } from '../biomes';
import { db } from '../db';
import { Rect, Vector } from '../math2d';

import { Tile } from './tile';

// Class
export class Map {
  // Constructor
  constructor(readonly name: string, readonly bbox: Rect) {}

  // Statics
  static async fromArray(name: string, tiles: Tile[]): Promise<Map> {
    const bbox = {
      t: Infinity,
      r: -Infinity,
      b: -Infinity,
      l: Infinity
    };

    // Insert all tiles into database
    for (const tile of tiles) {
      await db.tiles.add({ map: name, ...tile });

      // Compute bbox
      bbox.t = Math.min(bbox.t, tile.pos.y);
      bbox.l = Math.min(bbox.l, tile.pos.x);
      bbox.b = Math.max(bbox.b, tile.pos.y);
      bbox.r = Math.max(bbox.r, tile.pos.x);
    }

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
    for (let y = 0; y < matrix.length; ++y) {
      const line = matrix[y];

      for (let x = 0; x < line.length; ++x) {
        const biome = line[x];

        if (biome) {
          await db.tiles.add({ map: name, pos: { x, y }, biome });
        }
      }
    }

    return new Map(name, new Rect(bbox));
  }

  // Methods
  async tiles(): Promise<Tile[]> {
    const res = await db.tiles
      .where('[map+pos.x+pos.y]').between(
        [this.name, this.bbox.l, this.bbox.t],
        [this.name, this.bbox.r, this.bbox.b],
        )
      .toArray();

    return res.map(t => ({ ...t, pos: new Vector(t.pos) }));
  }

  async tile(pos: Vector): Promise<Tile | null> {
    const res = await db.tiles.get([this.name, pos.x, pos.y]);

    if (!res) {
      return null;
    }

    return {
      ...res,
      pos: new Vector(res.pos)
    };
  }

  // - utils
  sublayer(bbox: Rect): Map {
    return new Map(this.name, bbox);
  }
}
