import { BehaviorSubject } from 'rxjs';

import { Vector } from '../math2d';

// Class
export class Thing {
  // Attributes
  private readonly _position$ = new BehaviorSubject<Vector>(this._position);
  readonly position$ = this._position$.asObservable();

  // Constructor
  constructor(
    private _position: Vector,
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

  set position(pos: Vector) {
    this._position$.next(pos);
    this._position = pos;
  }
}
