import { Vector } from '../math2d';

import { DStarAnt } from './DStarAnt';

// Class
export class SmartAnt extends DStarAnt {
  // Methods
  protected heuristic(from: Vector, to: Vector): number {
    return from.distance(to);
  }
}
