import { Vector } from '../math2d';

// Class
export class Thing {
  // Constructor
  constructor(
    protected _position: Vector,
    readonly image: URL,
  ) {}

  // Statics
  static createTarget(position: Vector): Thing {
    return new Thing(position, new URL('./target.png', import.meta.url));
  }

  // Properties
  get position(): Vector {
    return this._position;
  }
}
