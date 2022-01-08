import { Map } from '../maps';
import { Vector } from '../math2d';

import { ANT_COLORS, AntColor, AntColorName } from './colors';
import { Thing } from './Thing';
import { surroundings } from './utils';

// Class
export abstract class Ant extends Thing {
  // Constructor
  constructor(
    readonly map: Map,
    private readonly _color: AntColorName,
    position = map.bbox.tl
  ) {
    super(position, ANT_COLORS[_color].texture);
  }

  // Methods
  protected abstract compute(target: Vector): Vector;

  // - internals
  private move(move: Vector): boolean {
    const pos = this._position.add(move);

    // Out of range / stay
    if (Math.max(Math.abs(move.x), Math.abs(move.y)) !== 1) {
      return false;
    }

    // Is out of map
    if (!pos.within(this.map.bbox)) {
      return false;
    }

    this._position = pos;

    return true;
  }

  // - utils
  protected surroundings(pos: Vector): Vector[] {
    const result: Vector[] = [];

    for (const p of surroundings(pos)) {
      if (p.within(this.map.bbox)) {
        result.push(p);
      }
    }

    return result;
  }

  // - interact
  step(target: Vector): void {
    const move = this.compute(target);
    this.move(move);
  }

  teleport(pos: Vector): void {
    this._position = pos;
  }

  // Properties
  get color(): AntColor {
    return ANT_COLORS[this._color];
  }
}
