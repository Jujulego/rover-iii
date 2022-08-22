import { Vector } from '@ants/maths';

import { Map } from '../maps';
import { ANT_COLORS, AntColor, AntColorName } from './colors';
import { Thing } from './Thing';
import { surroundings } from './utils';

// Class
export abstract class Ant extends Thing {
  // Attributes
  private _computing = false;

  // Constructor
  constructor(
    readonly name: string,
    readonly map: Map,
    private readonly _color: AntColorName,
    position = map.bbox.tl
  ) {
    super(position, ANT_COLORS[_color].texture);
  }

  // Methods
  protected abstract compute(target: Vector): Promise<Vector>;

  // - internals
  private move(move: Vector): boolean {
    const pos = this.position.add(move);

    // Out of range / stay
    if (Math.max(Math.abs(move.x), Math.abs(move.y)) !== 1) {
      return false;
    }

    // Is out of map
    if (!pos.within(this.map.bbox)) {
      return false;
    }

    this.position = pos;

    return true;
  }

  // - utils
  protected* surroundings(pos: Vector): Generator<Vector> {
    for (const p of surroundings(pos)) {
      if (p.within(this.map.bbox)) {
        yield p;
      }
    }
  }

  // - interact
  async step(target: Vector): Promise<void> {
    if (!this._computing) {
      this._computing = true;
      this.move(await this.compute(target));
    }

    this._computing = false;
  }

  // Properties
  get color(): AntColor {
    return ANT_COLORS[this._color];
  }
}
