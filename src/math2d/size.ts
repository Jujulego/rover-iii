// Types
export interface ISize {
  w: number;
  h: number;
}

export type SizeArgs<O extends unknown[] = []> = [ISize, ...O] | [number, number, ...O];

export type SizeHolderAttr<N extends string> = `${N}${'Width' | 'Height'}`;
export type SizeHolder<N extends string> = Record<SizeHolderAttr<N>, number>;

// Utils
export function isSize(obj: ISize | number): obj is ISize {
  return typeof obj === 'object';
}

export function parseSizeArgs<O extends unknown[]>(args: SizeArgs<O>): [ISize, ...O] {
  const [a1, a2, ...others] = args;

  if (isSize(a1)) {
    return args as [ISize, ...O];
  }

  if (typeof a2 === 'number') {
    return [{ w: a1, h: a2 }, ...others] as [ISize, ...O];
  }

  throw new Error('Invalid arguments !');
}

// Class
export class Size implements ISize {
  // Attributes
  public w: number;
  public h: number;

  // Methods
  constructor(s: ISize);
  constructor(w: number, h: number);
  constructor(...args: SizeArgs) {
    const [s] = parseSizeArgs(args);
    this.w = s.w;
    this.h = s.h;
  }

  // Static methods
  static fromHolder<N extends string>(attr: N, holder: SizeHolder<N>): Size {
    return new Size(holder[`${attr}Width`], holder[`${attr}Height`]);
  }
}

// Constants
export const NULL_SIZE = new Size(0, 0);
