import { Vector } from '../math2d';

import { Ant } from './Ant';

// Type
export interface TNode {
  pos: Vector;
  from: Vector | null;
}

// Interface
export interface TreeMixin extends Ant {
  // Properties
  get treeVersion(): number;

  // Methods
  getRoots(): TNode[];
  getNode(pos: Vector): TNode | undefined;
  getChildren(node: TNode): TNode[];
}
