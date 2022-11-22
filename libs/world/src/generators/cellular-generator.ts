import { Point, point, rect } from '@jujulego/2d-maths';

import { TileGenerator, TileGeneratorOpts } from './tile-generator';
import { ITile } from '../tile';

// Types
export interface CellularGeneratorOpts extends TileGeneratorOpts {
  readonly previous: number;
}

// Class
export class CellularGenerator extends TileGenerator<CellularGeneratorOpts> {
  // Methods
  private async _getNeighbors(world: string, pos: Point, version: number): Promise<ITile[]> {
    return await this.client.loadTilesIn(world, rect(pos.add({ dx: -1, dy: -1 }), { dx: 3, dy: 3 }), { version });
  }

  protected async *generate(world: string, opts: CellularGeneratorOpts): AsyncGenerator<ITile> {
    for (let y = opts.bbox.b; y < opts.bbox.t; ++y) {
      for (let x = opts.bbox.l; x < opts.bbox.r; ++x) {
        const pos = point(x, y);

        // Evaluate surroundings
        const neighbors = await this._getNeighbors(world, pos, opts.previous);
        const biomes: Record<string, number> = {};
        let current: ITile | null = null;

        for (const n of neighbors) {
          if (pos.equals(n.pos)) {
            current = n;
          } else {
            biomes[n.biome] = (biomes[n.biome] ?? 0) + 1;
          }
        }

        // Update tile
        let sent = false;

        for (const [biome, cnt] of Object.entries(biomes)) {
          if (cnt > 4) {
            sent = true;
            yield { pos, biome };

            break;
          }
        }

        if (!sent && current) {
          yield current;
        }
      }
    }
  }
}
