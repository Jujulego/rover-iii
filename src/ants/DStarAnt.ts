import { NULL_VECTOR, Vector } from '../math2d';

import { Ant } from './Ant';
import { TreeMixin, TNode } from './TreeMixin';

// Types
interface TileData {
  next: Vector | null;
  detected?: boolean;
  obstacle?: boolean;
  cost: number;
  minCost: number;
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
  private _updates: Vector[] = [];

  // Abstract methods
  protected abstract heuristic(from: Vector, to: Vector): number;
  protected abstract look(next: Vector): Vector[];

  // Methods
  // - map data
  getMapData(p: Vector): TileData {
    return this._map.get(hash(p)) ?? { next: null, cost: Infinity, minCost: Infinity };
  }

  private _updateMapData(p: Vector, update: Partial<TileData>) {
    const old = this.getMapData(p);

    this._map.set(hash(p), {
      ...old,
      minCost: Math.min(update.cost ?? old.cost, old.minCost),
      ...update
    });
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
    // Update target, detect and expand
    this.updateTarget(target);

    do {
      this._expand();

      const { next } = this.getMapData(this.position);
      this.detect(next ?? this.position);
    } while (this._updates.length > 0);

    // Compute next move
    const { next } = this.getMapData(this.position);
    return next ? next.sub(this.position) : NULL_VECTOR;
  }

  protected updateTarget(target: Vector): void {
    if (this._target?.equals(target)) return;

    // Set new target cost to 0
    this._updateMapData(target, { next: null, cost: 0 });
    this.updateTile(target);

    // Recompute old target cost
    if (this._target) {
      this._updateMapData(target, { next: null, cost: Infinity });
      this.updateTile(this._target);
    }

    // Update target
    this._target = target;
  }

  protected detect(next: Vector): void {
    for (const pos of this.look(next)) {
      const d = this.getMapData(pos);

      if (d.detected) {
        continue;
      }

      const tile = this.map.tile(pos);

      if (tile) {
        this._updateMapData(pos, {
          detected: true,
          obstacle: tile.biome === 'water',
        });

        if (tile.biome === 'water') {
          this._updateMapData(pos, { next: null, cost: Infinity });

          for (const p of this.surroundings(pos)) {
            if (this.getMapData(p).next?.equals(pos)) {
              this._updateMapData(p, { next: null, cost: Infinity });
              this.updateTile(p);
            }
          }
        }
      }
    }
  }

  private _expand(): void {
    while (this._updates.length > 0) {
      const pos = this._popNextUpdate();
      const isRaising = this._isRaising(pos);
      // console.log(`${isRaising ? 'RAISE' : 'LOWER'} (${pos.x}, ${pos.y})`);

      for (const p of this.surroundings(pos)) {
        const d = this.getMapData(p);
        const cost = this._tileCost(pos) + this.heuristic(p, pos);

        if (isRaising) {
          if (d.next?.equals(pos)) {
            this._updateMapData(p, { next: pos, cost });
            this.updateTile(p);
          } else {
            if (cost < d.cost) {
              this._updateMapData(pos, { minCost: this._tileCost(pos) });
              this.updateTile(p);
            }
          }
        } else {
          if (cost < d.cost) {
            this._updateMapData(p, { next: pos, cost });
            this.updateTile(p);
          }
        }
      }
    }

    this._treeVersion++;
  }

  private _isRaising(pos: Vector): boolean {
    const min = this._tileMinCost(pos);

    if (this._tileCost(pos) > min) {
      for (const p of this.surroundings(pos)) {
        const cost = this._tileCost(p) + this.heuristic(pos, p);

        if (cost < this._tileCost(pos)) {
          this._updateMapData(pos, {
            next: p,
            cost: cost,
          });
        }
      }
    }

    return this._tileCost(pos) > min;
  }

  private _tileCost(pos: Vector): number {
    return this.getMapData(pos)?.cost ?? Infinity;
  }

  private _tileMinCost(pos: Vector): number {
    return this.getMapData(pos)?.minCost ?? Infinity;
  }

  protected updateTile(...upd: Vector[]) {
    this._updates.push(...upd);
    this._updates.sort((a, b) => this._tileMinCost(b) - this._tileMinCost(a));
  }

  private _popNextUpdate(): Vector {
    const upd = this._updates.pop()!;

    while (this._updates.length > 0) {
      const next = this._updates.pop()!;

      if (!next.equals(upd)) {
        this._updates.push(next);
        break;
      }
    }

    return upd;
  }

  protected surroundings(pos: Vector): Vector[] {
    const result: Vector[] = [];

    for (const p of super.surroundings(pos)) {
      if (this.getMapData(p).obstacle) continue;
      result.push(p);
    }

    return result;
  }
}
