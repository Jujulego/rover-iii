import { nanoid } from 'nanoid';
import { BehaviorSubject, Observable } from 'rxjs';

import { Vector } from '../math2d';

// Class
export class Thing {
  // Attributes
  readonly id = nanoid();

  private readonly _position$$: BehaviorSubject<Vector>;
  readonly position$: Observable<Vector>;

  // Constructor
  constructor(
    private _position: Vector,
    readonly image: URL,
  ) {
    this._position$$ = new BehaviorSubject<Vector>(this._position);
    this.position$ = this._position$$.asObservable();
  }

  // Statics
  static createTarget(position: Vector): Thing {
    return new Thing(position, new URL('./target.png', import.meta.url));
  }

  // Properties
  get position(): Vector {
    return this._position;
  }

  set position(pos: Vector) {
    this._position$$.next(pos);
    this._position = pos;
  }
}
