import { Map } from '../maps';
import { Vector } from '../math2d';

import { Thing } from './Thing';

// Constants
export const ANT_COLORS = {
  blue:   new URL('./blue-ant.png',   import.meta.url),
  green:  new URL('./green-ant.png',  import.meta.url),
  pink:   new URL('./pink-ant.png',   import.meta.url),
  white:  new URL('./white-ant.png',  import.meta.url),
  yellow: new URL('./yellow-ant.png', import.meta.url),
};

// Class
export abstract class Ant extends Thing {
  // Constructor
  constructor(
    readonly map: Map,
    readonly color: keyof typeof ANT_COLORS,
    position = map.bbox.tl
  ) {
    super(position, ANT_COLORS[color]);
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
}
