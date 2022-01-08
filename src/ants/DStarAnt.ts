import { NULL_VECTOR, Vector } from '../math2d';

import { Ant } from './Ant';
import { TreeMixin, TNode } from './TreeMixin';

// Types
interface TileData {
  next: Vector | null;
  detected?: boolean;
  obstacle?: boolean;
  cost: number;
}

interface TileUpdate {
  pos: Vector;
  next: Vector | null;
  cost: number;
}

// Utils
function hash(v: Vector): string {
  return [v.x, v.y].join(':');
}

// Class
export abstract class DStarAnt extends Ant implements TreeMixin {
  // Inspired by https://fr.wikipedia.org/wiki/Algorithme_D*
  // Attributes
  private _target?: Vector;
  private _treeVersion = 0;

  private _map = new Map<string, TileData>();
  private _updates: TileUpdate[] = [];

  // Abstract methods
  protected abstract heuristic(from: Vector, to: Vector): number;
  protected abstract look(next: Vector): Vector[];

  // Methods
  // - map data
  getMapData(p: Vector): TileData | undefined {
    return this._map.get(hash(p));
  }

  private setMapData(p: Vector, d: TileData) {
    this._map.set(hash(p), d);
  }

  // - tree
  get treeVersion(): number {
    return this._treeVersion;
  }

  getNode(pos: Vector): TNode | undefined {
    const d = this.getMapData(pos);
    return d && { pos, from: d.next };
  }

  getChildren(node: TNode): TNode[] {
    const children: TNode[] = [];

    for (const pos of this.surroundings(node.pos)) {
      const n = this.getNode(pos);

      if (n && n.from?.equals(node.pos)) {
        children.push(n);
      }
    }

    return children;
  }

  // - algorithm
  protected compute(target: Vector): Vector {
    // Update target
    this.updateTarget(target);

    // Detect and recompute costs
    do {
      this._expand();

      const data = this.getMapData(this.position);

      for (const p of this.look(data?.next ?? this.position)) {
        const d = this.getMapData(p);
        if (d?.detected) continue;

        const tile = this.map.tile(p);

        if (tile) {
          this.setMapData(p, {
            next: null,
            cost: Infinity,
            ...d,
            detected: true,
            obstacle: tile.biome === 'water',
          });

          if (tile.biome === 'water') {
            this.updateTile({ pos: p, next: null, cost: Infinity });
          }
        }
      }
    } while (this._updates.length > 0);

    // Compute next move
    const d = this.getMapData(this.position)?.next;
    return d ? d.sub(this.position) : NULL_VECTOR;
  }

  protected updateTarget(target: Vector): void {
    if (this._target?.equals(target)) return;

    // Set new target cost to 0
    this.updateTile({ pos: target, next: null, cost: 0 });

    // Recompute old target cost
    if (this._target) {
      this.updateTile({ pos: this._target, next: null, cost: Infinity });
    }

    // Update target
    this._target = target;
  }

  private _expand(): void {
    while (this._updates.length > 0) {
      const upd = this._popNextUpdate();
      const isRaising = this._isRaising(upd);
      console.log(`(${upd.pos.x}, ${upd.pos.y}) => (${upd.next?.x ?? 'n'}, ${upd.next?.y ?? 'n'}) for ${upd.cost}`);

      this.setMapData(upd.pos, { ...this.getMapData(upd.pos), next: upd.next, cost: upd.cost });

      for (const p of this.surroundings(upd.pos)) {
        const d = this.getMapData(p);
        if (d?.obstacle) continue;

        if (isRaising) {
          if (d?.next?.equals(upd.pos)) {
            this.updateTile({ pos: p, next: upd.pos, cost: Infinity });
          } else {
            const cost = upd.cost + this.heuristic(p, upd.pos);

            if (cost < this._tileCost(p)) {
              this.setMapData(p, { ...this.getMapData(p), next: upd.pos, cost });
              this.updateTile({ pos: p, next: upd.pos, cost });
            }
          }
        } else {
          const cost = upd.cost + this.heuristic(p, upd.pos);

          if (cost < this._tileCost(p)) {
            this.updateTile({ pos: p, next: upd.pos, cost });
          }
        }
      }
    }

    this._treeVersion++;
  }

  private _isRaising(upd: TileUpdate): boolean {
    if (this.getMapData(upd.pos)?.obstacle) {
      return true;
    }

    const min = this._tileCost(upd.pos);

    if (upd.cost > min) {
      for (const p of this.surroundings(upd.pos)) {
        if (this.getMapData(p)?.obstacle) continue;

        const cost = this._tileCost(p) + this.heuristic(upd.pos, p);

        if (cost < upd.cost) {
          upd.next = p;
          upd.cost = cost;
        }
      }
    }

    return upd.cost > min;
  }

  private _tileCost(pos: Vector): number {
    return this.getMapData(pos)?.cost ?? Infinity;
  }

  protected updateTile(upd: TileUpdate) {
    if (Math.abs(upd.cost - this._tileCost(upd.pos)) < 0.001) {
      return;
    }

    if (this._updates[0]?.pos?.equals(upd.pos)) {
      return;
    }

    this._updates.unshift(upd);
    this._updates.sort((a, b) => this._tileCost(a.pos) - this._tileCost(b.pos));
  }

  private _popNextUpdate(): TileUpdate {
    const upd = this._updates.pop()!;

    while (this._updates.length > 0) {
      const next = this._updates.pop()!;

      if (!next.pos.equals(upd.pos)) {
        this._updates.push(next);
        break;
      }
    }

    return upd;
  }
}
