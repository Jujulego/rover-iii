import { Vector } from '../math2d';

import { DStarAntWorker } from './DStarAnt.worker';
import { MOVES } from './utils';
import { AntWorker } from './worker/AntWorker';

// Class
export class SmartAntWorker extends DStarAntWorker {
  // Methods
  protected heuristic(from: Vector, to: Vector): number {
    return from.distance(to) * (this._tile(from) + this._tile(to)) / 2;
  }

  private _tile(pos: Vector): number {
    const data = this.getMapData(pos);

    if (data.detected) {
      if (data.biome === 'sand') {
        return 5;
      } else if (data.biome === 'rock') {
        return 0.5;
      } else {
        return 1;
      }
    }

    return 0.75;
  }

  protected look(next: Vector): Vector[] {
    return [
      this.position,
      next,
      ...MOVES.map(d => this.position.add(d))
        .filter(p => next.distance(p, 'manhattan') === 1)
    ];
  }
}

AntWorker.setupWorker(SmartAntWorker);
