import { Vector } from '../math2d';

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
export function surroundings(pos: Vector): Vector[] {
  return MOVES.map(dir => pos.add(dir));
}
