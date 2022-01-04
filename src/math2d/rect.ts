import { ISize, parseSizeArgs, Size, SizeArgs } from './size';
import { VectorArgs, parseVectorArgs, IVector, Vector } from './vector';

// Types
export interface IRect {
  t: number;
  l: number;
  b: number;
  r: number;
}

export type RectArgs<O extends unknown[] = []> = [IRect, ...O] | [number, number, number, number, ...O];

// Utils
export function isRect(obj: IRect | number): obj is IRect {
  return typeof obj === 'object';
}

export function parseRectArgs<O extends unknown[]>(args: RectArgs<O>): [IRect, ...O] {
  const [a1, a2, a3, a4, ...others] = args;

  if (isRect(a1)) {
    return args as [IRect, ...O];
  }

  if (typeof a2 === 'number' && typeof a3 === 'number' && typeof a4 === 'number') {
    return [{ t: a1, l: a2, b: a3, r: a4 }, ...others] as [IRect, ...O];
  }

  throw new Error('Invalid arguments !');
}

// Class
export class Rect implements IRect {
  // Attributes
  public t: number;
  public l: number;
  public b: number;
  public r: number;

  // Constructor
  constructor(r: IRect);
  constructor(t: number, l: number, b: number, r: number);
  constructor(...args: RectArgs) {
    const [{ t, l, b, r }] = parseRectArgs(args);
    this.t = t;
    this.l = l;
    this.b = b;
    this.r = r;
  }

  // Static methods
  static fromVectors(u: IVector, v: IVector): Rect;
  static fromVectors(xu: number, yu: number, v: IVector): Rect;
  static fromVectors(u: IVector, xv: number, yv: number): Rect;
  static fromVectors(xu: number, yu: number, xv: number, yv: number): Rect;
  static fromVectors(...args: VectorArgs<VectorArgs>): Rect {
    const [u, ...others] = parseVectorArgs(args);
    const [v] = parseVectorArgs<[]>(others);

    return new Rect(
      Math.min(u.y, v.y),
      Math.min(u.x, u.x),
      Math.max(u.y, v.y),
      Math.max(u.x, v.x),
    );
  }

  static fromVectorSize(u: IVector, s: ISize): Rect;
  static fromVectorSize(x: number, y: number, s: ISize): Rect;
  static fromVectorSize(u: IVector, w: number, h: number): Rect;
  static fromVectorSize(x: number, y: number, w: number, h: number): Rect;
  static fromVectorSize(...args: VectorArgs<SizeArgs>): Rect {
    const [u, ...others] = parseVectorArgs(args);
    const [s] = parseSizeArgs<[]>(others);

    return new Rect(u.y, u.x, u.y + s.h, u.x + s.w);
  }

  // Methods
  within(r: IRect): boolean;
  within(t: number, l: number, b: number, r: number): boolean;
  within(...args: RectArgs): boolean {
    const [r] = parseRectArgs(args);

    return this.l >= r.l && this.r <= r.r && this.t >= r.t && this.b <= r.b;
  }

  // Properties
  get tl(): Vector {
    return new Vector(this.l, this.t);
  }

  get bl(): Vector {
    return new Vector(this.l, this.b);
  }

  get br(): Vector {
    return new Vector(this.r, this.b);
  }

  get tr(): Vector {
    return new Vector(this.r, this.t);
  }

  get w(): number {
    return this.r - this.l;
  }

  get h(): number {
    return this.b - this.t;
  }

  get size(): Size {
    return new Size(this.w, this.h);
  }
}

// Constants
export const NULL_RECT = new Rect(0, 0, 0, 0);
