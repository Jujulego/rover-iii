import { Vector } from '../math2d';

// Types
export type Flag = 'NEW' | 'RAISE' | 'LOWER';

export interface Flagged {
  pos: Vector;
  flag: Flag;
}

// Utils
export class UpdateList {
  // Attributes
  private readonly list: Flagged[] = [];

  private readonly inMap: (c: Vector) => boolean;

  // Constructor
  constructor(inMap: (c: Vector) => boolean) {
    this.inMap = inMap;
  }

  // Property
  get length() {
    return this.list.length;
  }

  // Methods
  *[Symbol.iterator]() {
    yield* this.list;
  }

  private add(flag: Flag, coords: Vector[]) {
    coords.forEach(pos => this.list.push({ pos, flag }));
  }

  raise(...coords: Vector[]) {
    this.add('RAISE', coords.filter(this.inMap));
  }

  lower(...coords: Vector[]) {
    this.add('LOWER', coords.filter(this.inMap));
  }
}
