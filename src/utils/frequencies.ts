import { BST } from './bst';

// Interface

// Class
export class Frequencies<K extends string> {
  // Attributes
  private readonly _freqs = BST.empty<[K, number], number>(([, f]) => f, (a, b) => b - a);

  //
}
