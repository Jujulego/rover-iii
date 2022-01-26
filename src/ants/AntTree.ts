import { map, sample, scan, Subject } from 'rxjs';

import { IVector, Vector } from '../math2d';
import { BST } from '../utils';

import { Ant } from './Ant';
import { AntMemory } from './memory/AntMemory';

// Interface
export interface TreeNode {
  pos: Vector;
  parent?: TreeNode;
  children: Set<TreeNode>;
}

export interface TreeData {
  // Attributes
  next?: IVector;
}

export interface AntWithTree<T extends TreeData = TreeData> extends Ant {
  // Attributes
  readonly tree: AntTree<T>;
}

// Utils
function hash(pos: IVector): string {
  return pos.x + ':' + pos.y;
}

// Class
export class AntTree<T extends TreeData> {
  // Attributes
  private readonly _roots = BST.empty<TreeNode, Vector>((n) => n.pos, (a, b) => a.compare(b));
  private readonly _nodes = new Map<string, TreeNode>();

  private readonly _complete$$ = new Subject<void>();
  private readonly _version$$ = new Subject<void>();
  readonly version$ = this._version$$.asObservable().pipe(
    sample(this._complete$$.asObservable()),
    scan((n) => n + 1, 0)
  );

  // Constructor
  constructor(readonly memory: AntMemory<T>) {
    // Follow memory updates
    memory.updates$
      .pipe(
        map(([pos, data]) => [this.node(new Vector(pos)), data] as [TreeNode, T])
      )
      .subscribe(([node, data]) => {
        if (data.next) { // not a root
          // became a children
          if (!node.parent) {
            const parent = this.node(new Vector(data.next));

            node.parent = parent;
            parent.children.add(node);
            this._roots.remove(node.pos);
            this._version$$.next();
          }

          // changed of parent
          if (!node.parent.pos.equals(data.next)) {
            const parent = this.node(new Vector(data.next));

            node.parent.children.delete(node);

            node.parent = parent;
            parent.children.add(node);
            this._version$$.next();
          }
        } else if (node.parent) { // became a root
          node.parent.children.delete(node);
          node.parent = undefined;

          this._roots.insert(node);
          this._version$$.next();
        }

        this._complete$$.next();
      });
  }

  // Methods
  node(pos: Vector): TreeNode {
    let node = this._nodes.get(hash(pos));

    if (!node) {
      node = { pos, children: new Set() };

      this._roots.insert(node);
      this._nodes.set(hash(pos), node);
      this._version$$.next();
    }

    return node;
  }

  roots(): BST<TreeNode, Vector> {
    return this._roots;
  }
}
