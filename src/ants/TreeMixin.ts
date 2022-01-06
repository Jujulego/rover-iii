import { Vector } from '../math2d';

import { Ant } from './Ant';

// Type
export interface TNode {
  pos: Vector,
  from: Vector | null,
  obstacle?: boolean
}

// Interface
export interface TreeMixin extends Ant {
  // Properties
  get treeVersion(): number;

  // Methods
  getNode(pos: Vector): TNode | undefined;
  getChildren(node: TNode): TNode[];
}

// Utils
export function hasTree(rover: Ant): rover is TreeMixin {
  return ('treeVersion' in rover) && ('getNode' in rover) && ('getChildren' in rover);
}
