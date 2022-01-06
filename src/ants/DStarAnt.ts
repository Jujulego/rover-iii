import { NULL_VECTOR, Size, Vector } from '../math2d';

import { Ant } from './Ant';
import { TreeMixin, TNode } from './TreeMixin';
import { MOVES, surroundings } from './utils';
import { Flagged, UpdateList } from '../maps/update-list';
import Queue from '../utils/queue';

// Types
interface Data {
  from: Vector | null;
  obstacle?: boolean;
  cost: number;
}

// Class
export abstract class DStarAnt extends Ant implements TreeMixin {
  // Inspired by https://fr.wikipedia.org/wiki/Algorithme_D*
  // Attributes
  private _target: Vector = NULL_VECTOR;
  private _data: Record<string, Data> = {};
  private _treeVersion = 0;

  // Abstract methods
  protected abstract heuristic(from: Vector, to: Vector): number

  // Methods
  getDStarData(p: Vector): Data {
    return this._data[`${p.x}:${p.y}`];
  }

  private setDStarData(p: Vector, d: Data) {
    this._data[`${p.x}:${p.y}`] = d;
  }

  // - tree
  get treeVersion(): number {
    return this._treeVersion;
  }

  getNode(pos: Vector): TNode | undefined {
    const d = this.getDStarData(pos);
    return { pos, ...d };
  }

  getChildren(node: TNode): TNode[] {
    return surroundings(node.pos).reduce((acc, p) => {
      const n = this.getNode(p);
      if (n && !n.obstacle && n.from && node.pos.equals(n.from)) {
        acc.push(n);
      }

      return acc;
    }, new Array<TNode>());
  }

  // - utils
  private surroundings(p: Vector): Array<Vector> {
    return MOVES.reduce(
      (acc, dir) => {
        const c = p.add(dir);
        if (c.within(this.map.bbox)) acc.push(c);

        return acc;
      },
      new Array<Vector>()
    );
  }

  private createList(): UpdateList {
    return new UpdateList((c) => c.within(this.map.bbox));
  }

  protected raise(pos: Vector) {
    this.expand([{ pos, flag: 'RAISE' }]);
  }

  // - algorithm
  //@measure({ limit: 10 })
  private expand(updates: UpdateList | Flagged[]) {
    // Setup queue
    const queue = new Queue<Flagged>();

    for (const u of updates) {
      if (u.pos.within(this.map.bbox)) {
        queue.enqueue(u);
      }
    }

    while (!queue.isEmpty) {
      // dequeue
      const flagged = queue.dequeue() as Flagged;
      while (queue.next) { // remove copies
        if (queue.next.pos.equals(flagged.pos) && queue.next.flag === flagged.flag) {
          queue.dequeue();
        } else {
          break;
        }
      }

      // expand to neighbors
      const { pos, flag } = flagged;
      const data = this.getDStarData(pos);
      //console.log(`from ${pos.x},${pos.y} (${flag})`);

      this.surroundings(pos).forEach(p => {
        const d = this.getDStarData(p);
        if (d && d.obstacle) return;

        let cost = data.cost + this.heuristic(pos, p);
        //console.log(`to ${p.x},${p.y} (${d ? d.cost : 'infinity'} => ${cost})`);

        switch (flag) {
          case 'NEW':
            if (!d) { // no data => new node
              //console.log(`new:   ${p.x},${p.y} (${cost})`);

              this.setDStarData(p, { cost, from: pos });
              queue.enqueue({ pos: p, flag: 'NEW' });
            } else if (d.cost > cost) { // can reduce cost ?
              //console.log(`lower: ${p.x},${p.y} (${d.cost} => ${cost} by ${pos.x},${pos.y})`);

              this.getDStarData(p).cost = cost;
              this.getDStarData(p).from = pos;
              queue.enqueue({ pos: p, flag: 'LOWER' });
            }

            break;

          case 'LOWER':
            if (!d) break; // should not happen

            if (!d.from || d.cost > cost) {
              //console.log(`lower: ${p.x},${p.y} (${d.from ? d.cost : 'infinite'} => ${cost} by ${pos.x},${pos.y})`);

              this.getDStarData(p).cost = cost;
              this.getDStarData(p).from = pos;
              queue.enqueue({ pos: p, flag: 'LOWER' });
            }

            break;

          case 'RAISE':
            if (!d) break; // should not happen
            if (!d.from) break;

            if (data.obstacle || !data.from) { // pos became unreachable
              if (d.from.equals(pos)) { // path goes threw pos
                //console.log(`raise: ${p.x},${p.y} (${d.cost} => infinite)`);

                // p should be unreachable too
                this.getDStarData(p).from = null;
                queue.enqueue({ pos: p, flag: 'RAISE' });
              } else if (!d.obstacle && !data.obstacle) { // will lower from there
                const nc = d.cost + this.heuristic(p, pos);
                //console.log(`lower: ${pos.x},${pos.y} (infinite => ${nc} by ${p.x},${p.y})`);

                cost += nc - data.cost;
                this.getDStarData(pos).cost = nc;
                this.getDStarData(pos).from = p;

                queue.enqueue({ pos, flag: 'LOWER' });
              }
            } else {
              if (d.from.equals(pos)) { // path goes threw pos
                if (d.cost !== cost) {
                  //console.log(`raise: ${p.x},${p.y} (${d.cost} => ${cost})`);

                  // p should be raised too
                  this.getDStarData(p).cost = cost;
                  queue.enqueue({ pos: p, flag: 'RAISE' });
                }
              } else if (!d.obstacle) { // maybe can lower from there
                const nc = d.cost + this.heuristic(p, pos);

                if (data.cost > nc) {
                  //console.log(`lower: ${pos.x},${pos.y} (${data.cost} => ${nc} by ${p.x},${p.y})`);

                  cost += nc - data.cost;
                  this.getDStarData(pos).cost = nc;
                  this.getDStarData(pos).from = p;

                  queue.enqueue({pos, flag: 'LOWER'});
                }
              }
            }

            break;
        }
      });
    }

    ++this._treeVersion;
  }

  // - callbacks
  private init() {
    this._data = {};
    this.setDStarData(this._target, { from: this._target, cost: 0 });

    this.expand([{ pos: this._target, flag: 'NEW' }]);
  }

  protected detect(updates: UpdateList, data: { from: Vector, cost: number }) {
    // Check if there is an obstacle
    const tile = this.map.tile(data.from);

    if (!tile || (tile?.biome === 'water')) {
      this.getDStarData(data.from).obstacle = true;
      updates.raise(data.from);
    }
  }

  protected compute(target: Vector): Vector {
    // Initialise data
    if (!this._target.equals(target)) {
      this._target = target;
      this.init();
    }

    // Compute next move
    let i = 8;

    while (i > 0) {
      const dp = this.getDStarData(this.position);

      if (dp.from == null) {
        return NULL_VECTOR;
      }

      const df = this.getDStarData(dp.from);

      // Check if known as an obstacle
      if (df.obstacle) {
        return NULL_VECTOR;
      }

      // Check if there is an obstacle
      const updates = this.createList();
      this.detect(updates, { from: dp.from, cost: dp.cost });

      if (updates.length <= 0) {
        return dp.from.sub(this.position);
      } else {
        this.expand(updates);

        --i;
      }
    }

    return NULL_VECTOR;
  }

  /*restart(keep = false) {
    super.restart(keep);

    if (!keep) {
      this.init();
    } else {
      this.expand([{ pos: this._target, flag: 'RAISE' }]);
    }
  }*/

  // Properties
  private get size(): Size {
    return this.map.bbox.size;
  }
}
