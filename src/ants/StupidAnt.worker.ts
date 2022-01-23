import { NULL_VECTOR, Vector } from '../math2d';

import { AntWorker } from './worker/AntWorker';
import { MOVES } from './utils';

// Class
export class StupidAntWorker extends AntWorker {
  // Attributes
  private _dir = 0;

  // Methods
  protected async compute(target: Vector): Promise<Vector> {
    // Arrived !
    if (this.position.equals(target)) {
      return NULL_VECTOR;
    }

    // Inspect next tile
    for (let i = 0; i < MOVES.length; ++i) {
      const next = this.position.add(MOVES[this._dir]);
      const tile = await this.map.tile(next);

      if (!tile || tile.biome === 'water') {
        this._dir = (this._dir + Math.ceil(Math.random() * MOVES.length)) % MOVES.length;
      } else {
        return MOVES[this._dir];
      }
    }

    return NULL_VECTOR;
  }
}

AntWorker.setupWorker(StupidAntWorker);
