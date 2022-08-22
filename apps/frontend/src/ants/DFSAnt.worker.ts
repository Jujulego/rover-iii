import { db } from '../db';
import { IVector, NULL_VECTOR, Vector } from '../math2d';
import { Stack } from '../utils';

import { Ant } from './Ant';
import { TreeData } from './AntTree';
import { AntWithMemory } from './memory/AntMemory';
import { AntMapMemory } from './memory/AntMapMemory';
import { AntWorker } from './worker/AntWorker';
import { RegisterAntWorker } from './worker/AntMessageHandler';

// Interface
export interface DFSData extends TreeData {
  // Attributes
  next?: Vector;
}

// Utils
function hash(pos: IVector): string {
  return pos.x + ':' + pos.y;
}

// Class
@RegisterAntWorker
export class DFSAntWorker extends Ant implements AntWorker, AntWithMemory<DFSData> {
  // Attributes
  private _target?: Vector;

  readonly memory = new AntMapMemory<DFSData>();

  // Methods
  async compute(target: Vector): Promise<Vector> {
    await this._updateTarget(target);

    const data = this.memory.get(this.position);
    return data?.next ? data.next.sub(this.position) : NULL_VECTOR;
  }

  private async _updateTarget(target: Vector): Promise<void> {
    // Still same target
    if (this._target?.equals(target)) return;

    // Reset old data
    for (const [pos,] of this.memory) {
      this.memory.put(pos, {});
    }

    // Recompute tree
    await db.transaction('r', db.tiles, async () => {
      const stack = new Stack<Vector>();
      const marks = new Set<string>();

      const tile = await this.map.tile(target);
      if (!tile || tile.biome === 'water') return;

      stack.add(target);
      marks.add(hash(target));

      while (!stack.isEmpty) {
        const pos = stack.pop();

        if (!pos) break;
        if (pos.equals(this.position)) break;

        const next = Array.from(this.surroundings(pos))
          .filter(p => !marks.has(hash(p)) && p.within(this.map.bbox));

        for (const tile of await this.map.bulk(...next)) {
          if (tile && tile.biome !== 'water') {
            this.memory.put(tile?.pos, { next: pos });
            stack.add(new Vector(tile.pos));
          }
        }

        for (const p of next) {
          marks.add(hash(p));
        }
      }

      this._target = target;
    });
  }
}
