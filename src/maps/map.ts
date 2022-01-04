import { Rect, Vector } from '../math2d';
import { BST } from '../utils';

import { Tile } from './tile';
import { BiomeName } from '../biomes';

// Class
export class Map {
  // Attributes
  readonly bbox: Rect;

  // Constructor
  private constructor(
    readonly tiles: BST<Tile, Vector>
  ) {
    this.bbox = this._computeBBox();
  }

  // Statics
  static fromArray(tiles: Tile[]) {
    return new Map(
      BST.fromArray(tiles, (t) => t.pos, (a, b) => a.compare(b))
    );
  }

  static fromMatrix(matrix: (BiomeName | null)[][]) {
    const tiles: Tile[] = [];

    for (let y = 0; y < matrix.length; ++y) {
      const line = matrix[y];

      for (let x = 0; x < line.length; ++x) {
        const biome = line[x];

        if (biome) {
          tiles.push({ pos: new Vector(x, y), biome });
        }
      }
    }

    return this.fromArray(tiles);
  }

  static copy(layer: Map): Map {
    return new Map(BST.copy(layer.tiles));
  }

  // Methods
  private _computeBBox(): Rect {
    // Compute bbox
    const bbox = {
      t: Infinity,
      r: -Infinity,
      b: -Infinity,
      l: Infinity
    };

    for (const tile of this.tiles) {
      bbox.t = Math.min(bbox.t, tile.pos.y);
      bbox.l = Math.min(bbox.l, tile.pos.x);
      bbox.b = Math.max(bbox.b, tile.pos.y);
      bbox.r = Math.max(bbox.r, tile.pos.x);
    }

    return new Rect(bbox);
  }

  // - accessing
  tile(pos: Vector): Tile | null {
    return this.tiles.find(pos);
  }

  // - utils
  sublayer(bbox: Rect): Map {
    // Simple cases
    if (this.bbox.within(bbox)) return this;

    // Compute sublayer
    const tiles: Tile[] = [];

    for (const tile of this.tiles) {
      if (tile.pos.within(bbox)) {
        tiles.push(tile);
      }
    }

    return Map.fromArray(tiles);
  }
}
