import { Vector } from '../math2d';

import { DStarAnt } from './DStarAnt';
import { MOVES } from './utils';

// Class
export class SmartAnt extends DStarAnt {
  // Methods
  protected heuristic(from: Vector, to: Vector): number {
    return from.distance(to);
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
