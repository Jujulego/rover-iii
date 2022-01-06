import { Map } from '../maps';
import { Vector } from '../math2d';

import { Thing } from './Thing';
import { ANT_COLORS, AntColor, AntColorName } from './colors';

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
  protected abstract compute(): Vector;

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

  step(): void {
    const move = this.compute();
    this.move(move);
  }

  // Properties
  get color(): AntColor {
    return ANT_COLORS[this._color];
  }
}
