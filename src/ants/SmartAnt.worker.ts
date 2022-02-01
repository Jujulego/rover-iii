import { Vector } from '../math2d';

import { DStarAntWorker } from './DStarAnt.worker';
import { RegisterAntWorker } from './worker/AntMessageHandler';

// Constants
export const LOOK_AT = [
  // 0 step
  new Vector(0, 0),

  // 1 step
  new Vector(1, 0),
  new Vector(1, 1),
  new Vector(0, 1),
  new Vector(-1, 1),
  new Vector(-1, 0),
  new Vector(-1, -1),
  new Vector(0, -1),
  new Vector(1, -1),

  // 2
  new Vector(2, 0),
  new Vector(2, 1),
  new Vector(2, 2),
  new Vector(1, 2),
  new Vector(0, 2),
  new Vector(-1, 2),
  new Vector(-2, 2),
  new Vector(-2, 1),
  new Vector(-2, 0),
  new Vector(-2, -1),
  new Vector(-2, -2),
  new Vector(-1, -2),
  new Vector(0, -2),
  new Vector(1, -2),
  new Vector(2, -2),
  new Vector(2, -1),
];

// Class
@RegisterAntWorker
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
      } else if (data.biome === 'grass') {
        return 1;
      }
    }

    return 2.7142857142857144; // mean of cellular biome proportions
  }

  protected look(next: Vector): Vector[] {
    return LOOK_AT.map(d => this.position.add(d))
      .filter(p => next.distance(p) <= 2);
  }
}
