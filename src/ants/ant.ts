import { Map } from '../maps';
import { Vector } from '../math2d';

// Class
export class Ant {
  // Attributes
  readonly image = new URL('./blue.png', import.meta.url);

  // Constructor
  constructor(
    readonly map: Map,
    private _position = map.bbox.tl
  ) {}

  // Properties
  get position(): Vector {
    return this._position;
  }
}
