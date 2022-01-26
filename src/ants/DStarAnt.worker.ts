import { BiomeName } from '../biomes';
import { FogData } from '../layers/FogTile';
import { IVector, NULL_VECTOR, Vector } from '../math2d';
import { BST } from '../utils';

import { AntWithMemory } from './memory/AntMemory';
import { AntMapMemory } from './memory/AntMapMemory';
import { TreeData } from './AntTree';
import { AntWorker } from './worker/AntWorker';

// Constant
const MIN_DIFF = 0.001;

// Utils
function neq(a: number, b: number): boolean {
  return Math.abs(a - b) > MIN_DIFF;
}

function inf(a: number, b: number): boolean {
  return (a - b) < MIN_DIFF;
}

function sup(a: number, b: number): boolean {
  return (a - b) > MIN_DIFF;
}

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
export abstract class DStarAntWorker extends AntWorker implements AntWithMemory<DStarData> {
  // Inspired by https://fr.wikipedia.org/wiki/Algorithme_D*
  // Attributes
  private _target?: Vector;
  private _updates = BST.empty<Vector>((a) => a, (a, b) => this._tileMinCost(b) - this._tileMinCost(a));

  readonly memory = new AntMapMemory<DStarData>();

  // Abstract methods
  protected abstract heuristic(from: Vector, to: Vector): number;
  protected abstract look(next: Vector): Vector[];

  // Methods
  // - map data
  getMapData(p: IVector): DStarData {
    return this.memory.get(p) ?? { cost: Infinity, minCost: Infinity };
  }

  private _updateMapData(p: Vector, update: Partial<DStarData>) {
    // Compute new value
    const old = this.getMapData(p);
    const res = { ...old, ...update };

    // Corrections
    res.minCost = Math.min(res.cost, res.minCost);
    if (res.cost === Infinity) res.next = undefined;

    // Save
    this.memory.put(p, res);

    if (neq(old.minCost, res.minCost)) {
      this._updates.resort();
    }
  }

  // - algorithm
  protected async compute(target: Vector): Promise<Vector> {
    // Arrived !
    if (this.position.equals(target)) {
      return NULL_VECTOR;
    }

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

          if (neq(data.cost, cost)) {
            this._updateMapData(pos, { cost });
            this.updateTile(pos);
          }
        }
      }
    }
  }

  private _expand(): void {
    while (this._updates.length > 0) {
      const pos = this._updates.pop();

      if (!pos) break;
      if (this.getMapData(pos).obstacle) continue;

      const isRaising = this._isRaising(pos);
      const cost = this._tileCost(pos);

      for (const p of this.surroundings(pos)) {
        const d = this.getMapData(p);
        const c = cost + this.heuristic(p, pos);

        if (isRaising) {
          if (d.next?.equals(pos)) {
            this._updateMapData(p, { cost: c });
            this.updateTile(p);
          } else {
            if (inf(c, d.cost)) {
              this._updateMapData(pos, { minCost: cost });
              this.updateTile(p);
            }
          }
        } else {
          if (inf(c, d.cost)) {
            if (this._cycleCheck(p, pos)) continue;

            this._updateMapData(p, { next: pos, cost: c });
            this.updateTile(p);
          }
        }
      }
    }
  }

  private _isRaising(pos: Vector): boolean {
    const min = this._tileMinCost(pos);
    let cost = this._tileCost(pos);

    if (cost > min) {
      for (const p of this.surroundings(pos)) {
        if (this._cycleCheck(pos, p)) continue;

        const c = this._tileCost(p) + this.heuristic(pos, p);

        if (inf(c, cost)) {
          cost = c;

          this._updateMapData(pos, {
            next: p,
            cost: c,
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

  protected surroundings(pos: Vector): Vector[] {
    const result: Vector[] = [];

    for (const p of super.surroundings(pos)) {
      if (this.getMapData(p).obstacle) continue;
      result.push(p);
    }

    return result;
  }
}
