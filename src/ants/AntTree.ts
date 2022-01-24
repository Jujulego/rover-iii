import { scan, Subject } from 'rxjs';

import { IVector, Vector } from '../math2d';
import { BST } from '../utils';

import { Ant } from './Ant';
import { AntMemory } from './AntMemory';
import { surroundings } from './utils';

// Types
export interface TreeData {
  // Attributes
  next?: IVector;
}

// Interface
export interface AntWithTree<T extends TreeData> extends Ant {
  // Attributes
  readonly tree: AntTree<T>;
}

// Class
export class AntTree<T extends TreeData> {
  // Attributes
  private _roots = BST.empty<Vector>((v) => v, (a, b) => a.compare(b));

  private readonly _version$$ = new Subject<void>();
  readonly version$ = this._version$$.asObservable().pipe(
    scan((n) => n + 1, 0)
  );

  // Constructor
  constructor(readonly memory: AntMemory<T>) {
    // Follow memory updates
    memory.updates$.subscribe(([pos, data]) => {
      if (data?.next) {
        // Not a root anymore
        this._roots.remove(new Vector(pos));
      } else if (this._roots.indexOf(new Vector(pos)) === -1) {
        // New root
        this._roots.insert(new Vector(pos));
      }
    });
  }

  // Methods
  roots(): IVector[] {
    const res: IVector[] = [];

    for (const p of this._roots) {
      if (this.memory.get(p)) {
        res.push(p);
      }
    }

    return res;
  }

  async children(pos: Vector): Promise<IVector[]> {
    const res: IVector[] = [];

    for (const p of surroundings(pos)) {
      const node = await this.memory.get(p);

      if (node?.next && pos.equals(node.next)) {
        res.push(p);
      }
    }

    return res;
  }

  emit() {
    this._version$$.next();
  }
}
