import { Vector } from '@ants/maths';

// Constants
export const MOVES = [
  new Vector(1, 0),
  new Vector(1, 1),
  new Vector(0, 1),
  new Vector(-1, 1),
  new Vector(-1, 0),
  new Vector(-1, -1),
  new Vector(0, -1),
  new Vector(1, -1),
];

// Utils
export function* surroundings(pos: Vector): Generator<Vector> {
  for (const mvt of MOVES) {
    yield pos.add(mvt);
  }
}
