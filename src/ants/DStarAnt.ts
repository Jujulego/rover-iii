import { BiomeName } from '../biomes';
import { FogData } from '../layers/FogTile';
import { IVector, NULL_VECTOR, Vector } from '../math2d';
import { BST } from '../utils';

import { Ant } from './Ant';
import { AntMemory } from './AntMemory';
import { AntTree, AntWithTree, TreeData } from './AntTree';

// Types
interface DStarData extends FogData, TreeData {
  // Attributes
  // - algorithm data
  next?: Vector;
  cost: number;
  minCost: number;

  // - map data
  obstacle?: boolean;
  biome?: BiomeName;
}

// Class
export abstract class DStarAnt extends Ant implements AntWithTree<DStarData> {
  // Inspired by https://fr.wikipedia.org/wiki/Algorithme_D*
  // Attributes
  private _target?: Vector;
  private _updates = BST.empty<Vector>((a) => a, (a, b) => this._tileMinCost(b) - this._tileMinCost(a));

  readonly memory = new AntMemory<DStarData>();
  readonly tree = new AntTree<DStarData>(this.memory);

  // Abstract methods
  protected abstract heuristic(from: Vector, to: Vector): number;
  protected abstract look(next: Vector): Vector[];

  // Methods
  // - map data
  getMapData(p: IVector): DStarData {
    return this.memory.get(p) ?? { cost: Infinity, minCost: Infinity };
  }

  private _updateMapData(p: Vector, update: Partial<DStarData>) {
    const old = this.getMapData(p);

    this.memory.put(p, {
      ...old,
      minCost: Math.min(update.cost ?? old.cost, old.minCost),
      ...update
    });
  }

  // - algorithm
  protected async compute(target: Vector): Promise<Vector> {
    try {
      // Update target, detect and expand
      this.updateTarget(target);

      do {
        this._expand();

        const { next } = this.getMapData(this.position);
        await this.detect(next ?? this.position);
      } while (this._updates.length > 0);

      // Compute next move
      const { next } = this.getMapData(this.position);
      return next ? next.sub(this.position) : NULL_VECTOR;
    } finally {
      this.tree.emit();
    }
  }

  protected updateTarget(target: Vector): void {
    if (this._target?.equals(target)) return;

    // Set new target cost to 0
    this._updateMapData(target, { next: undefined, cost: 0 });
    this.updateTile(target);

    // Recompute old target cost
    if (this._target) {
      this._updateMapData(this._target, { next: undefined, cost: Infinity });
      this.updateTile(this._target);
    }

    // Update target
    this._target = target;
  }

  protected async detect(next: Vector): Promise<void> {
    for (const pos of this.look(next)) {
      const d = this.getMapData(pos);

      if (d.detected) {
        continue;
      }

      const tile = await this.map.tile(pos);

      if (tile) {
        this._updateMapData(pos, {
          detected: true,
          obstacle: tile.biome === 'water',
          biome: tile.biome,
        });

        if (tile.biome === 'water') {
          this._updateMapData(pos, { next: undefined, cost: Infinity });

          for (const p of this.surroundings(pos)) {
            if (this.getMapData(p).next?.equals(pos)) {
              this._updateMapData(p, { next: undefined, cost: Infinity });
              this.updateTile(p);
            }
          }
        }

        const data = this.getMapData(pos);

        if (data.next) {
          const cost = this.heuristic(pos, data.next) + this._tileCost(data.next);

          if (Math.abs(data.cost - cost) > 0.01) {
            this._updateMapData(pos, { cost });
            this.updateTile(pos);
          }
        }
      }
    }
  }

  private _expand(): void {
    while (this._updates.length > 0) {
      const pos = this._popNextUpdate();
      if (this.getMapData(pos).obstacle) continue;

      const isRaising = this._isRaising(pos);

      for (const p of this.surroundings(pos)) {
        const d = this.getMapData(p);
        const cost = this._tileCost(pos) + this.heuristic(p, pos);

        if (isRaising) {
          if (d.next?.equals(pos)) {
            this._updateMapData(p, { cost });
            this.updateTile(p);
          } else {
            if (cost < d.cost) {
              this._updateMapData(pos, { minCost: this._tileCost(pos) });
              this.updateTile(p);
            }
          }
        } else {
          if (cost < d.cost) {
            if (this._cycleCheck(p, pos)) continue;

            this._updateMapData(p, { next: pos, cost });
            this.updateTile(p);
          }
        }
      }
    }
  }

  private _isRaising(pos: Vector): boolean {
    const min = this._tileMinCost(pos);

    if (this._tileCost(pos) > min) {
      for (const p of this.surroundings(pos)) {
        if (this._cycleCheck(pos, p)) continue;

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

  private _cycleCheck(pos: Vector, next?: Vector): boolean {
    while (next) {
      const d = this.getMapData(next);

      if (d.next?.equals(pos)) {
        return true;
      }

      next = d.next;
    }

    return false;
  }

  private _tileCost(pos: Vector): number {
    return this.getMapData(pos).cost;
  }

  private _tileMinCost(pos: Vector): number {
    return this.getMapData(pos).minCost;
  }

  protected updateTile(...upd: Vector[]) {
    for (const u of upd) {
      const idx = this._updates.shouldBeAt(u);

      if (!this._updates.item(idx - 1)?.equals(u)) {
        this._updates.insert(u);
      }
    }
  }

  private _popNextUpdate(): Vector {
    return this._updates.pop()!;
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
