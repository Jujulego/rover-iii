import { IRect, parseRectArgs, RectArgs } from './rect';
import { ISize, parseSizeArgs, SizeArgs } from './size';

// Types
export interface IVector {
  x: number;
  y: number;
}

export type VectorArgs<O extends unknown[] = []> = [IVector, ...O] | [number, number, ...O];

export type VectorOrderMode = 'xy' | 'yx';
export type VectorDistanceMode = 'euclidean' | 'manhattan';

// Utils
export function isVector(obj: IVector | number): obj is IVector {
  return typeof obj === 'object';
}

export function parseVectorArgs<O extends unknown[]>(args: VectorArgs<O>): [IVector, ...O] {
  const [a1, a2, ...others] = args;

  if (isVector(a1)) {
    return args as [IVector, ...O];
  }

  if (typeof a2 === 'number') {
    return [{ x: a1, y: a2 }, ...others] as [IVector, ...O];
  }

  throw new Error('Invalid arguments !');
}

// Class
export class Vector implements IVector {
  // Attributes
  public x: number;
  public y: number;

  // Constructor
  constructor(u: IVector);
  constructor(x: number, y: number);
  constructor(...args: VectorArgs) {
    const [{ x, y }] = parseVectorArgs(args);
    this.x = x;
    this.y = y;
  }

  // Static methods
  static fromSize(s: ISize): Vector;
  static fromSize(w: number, h: number): Vector;
  static fromSize(...args: SizeArgs): Vector {
    const [s] = parseSizeArgs(args);
    return new Vector(s.w, s.h);
  }

  // Methods
  // - unary operations
  norm(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  unit(): Vector {
    if (this.isNull) return NULL_VECTOR;
    return this.div(this.norm());
  }

  normal(): Vector {
    return new Vector(this.y, -this.x);
  }

  // - binary operations
  equals(v: IVector): boolean;
  equals(x: number, y: number): boolean;
  equals(...args: VectorArgs): boolean {
    const [v] = parseVectorArgs(args);
    return this.x === v.x && this.y === v.y;
  }

  compare(v: IVector): number;
  compare(v: IVector, order: VectorOrderMode): number;
  compare(x: number, y: number): number;
  compare(x: number, y: number, order: VectorOrderMode): number;
  compare(...args: VectorArgs<[VectorOrderMode?]>): number {
    const [v, order = 'xy'] = parseVectorArgs(args);
    const d = this.sub(v);

    if (order === 'xy') {
      return d.x === 0 ? -d.y : -d.x;
    } else {
      return d.y === 0 ? -d.x : -d.y;
    }
  }

  distance(v: IVector): number;
  distance(v: IVector, mode: VectorDistanceMode): number;
  distance(x: number, y: number): number;
  distance(x: number, y: number, mode: VectorDistanceMode): number;
  distance(...args: VectorArgs<[VectorDistanceMode?]>): number {
    const [v, mode = 'euclidean'] = parseVectorArgs(args);

    switch (mode) {
      case 'euclidean':
        return this.sub(v).norm();

      case 'manhattan':
        return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
    }
  }

  within(r: IRect): boolean;
  within(t: number, l: number, b: number, r: number): boolean;
  within(...args: RectArgs): boolean {
    const [r] = parseRectArgs(args);
    return this.x >= r.l && this.x <= r.r && this.y >= r.t && this.y <= r.b;
  }

  add(v: IVector): Vector;
  add(x: number, y: number): Vector;
  add(...args: VectorArgs): Vector {
    const [v] = parseVectorArgs(args);
    return new Vector(this.x + v.x, this.y + v.y);
  }

  sub(v: IVector): Vector;
  sub(x: number, y: number): Vector;
  sub(...args: VectorArgs): Vector {
    const [v] = parseVectorArgs(args);
    return new Vector(this.x - v.x, this.y - v.y);
  }

  mul(k: number): Vector {
    return new Vector(this.x * k, this.y * k);
  }

  div(k: number): Vector {
    return new Vector(this.x / k, this.y / k);
  }

  dot(v: IVector): number;
  dot(x: number, y: number): number;
  dot(...args: VectorArgs): number {
    const [v] = parseVectorArgs(args);
    return this.x * v.x + this.y * v.y;
  }

  // Properties
  get isNull(): boolean {
    return this.x === 0 && this.y === 0;
  }
}

// Constants
export const NULL_VECTOR = new Vector(0, 0);
