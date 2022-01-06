import { NULL_VECTOR, Vector } from '../math2d';

import { Ant } from './Ant';

// Constants
const DIRECTIONS = [
  new Vector(1, 0),
  new Vector(1, 1),
  new Vector(0, 1),
  new Vector(-1, 1),
  new Vector(-1, 0),
  new Vector(-1, -1),
  new Vector(0, -1),
  new Vector(1, -1),
];

// Class
export class StupidAnt extends Ant {
  // Attributes
  private _dir = 0;

  // Methods
  protected compute(target: Vector): Vector {
    // Arrived !
    if (this.position.equals(target)) {
      return NULL_VECTOR;
    }

    // Inspect next tile
    for (let i = 0; i < DIRECTIONS.length; ++i) {
      const next = this.position.add(DIRECTIONS[this._dir]);
      const tile = this.map.tile(next);

      if (!tile || tile.biome === 'water') {
        this._dir = (this._dir + Math.ceil(Math.random() * DIRECTIONS.length)) % DIRECTIONS.length;
      } else {
        return DIRECTIONS[this._dir];
      }
    }

    return NULL_VECTOR;
  }
}
