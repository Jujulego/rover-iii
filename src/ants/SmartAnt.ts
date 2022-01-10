import { Vector } from '../math2d';

import { DStarAnt } from './DStarAnt';
import { MOVES } from './utils';

// Class
export class SmartAnt extends DStarAnt {
  // Methods
  protected heuristic(from: Vector, to: Vector): number {
    return from.distance(to) * (this._tile(from) + this._tile(to)) / 2;
  }

  private _tile(pos: Vector): number {
    if (this.getMapData(pos).detected) {
      const tile = this.map.tile(pos)!;

      if (tile.biome === 'sand') {
        return 5;
      } else if (tile.biome === 'rock') {
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
