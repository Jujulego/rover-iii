import { scan, Subject } from 'rxjs';

import { IVector } from '../math2d';

import { Ant } from './Ant';
import { AntMemory } from './memory/AntMemory';

// Interfaces
export interface KnownData {
  detected?: boolean;
}

export interface AntWithKnowledge<T extends KnownData = KnownData> extends Ant {
  // Attributes
  readonly knowledge: AntKnowledge<T>;
}

// Utils
export function hasKnowledge(ant: Ant): ant is AntWithKnowledge {
  return 'knowledge' in ant;
}

function hash(pos: IVector): string {
  return pos.x + ':' + pos.y;
}

// Class
export class AntKnowledge<T extends KnownData> {
  // Attributes
  private readonly _knowledge = new Set<string>();

  private readonly _version$$ = new Subject<void>();
  readonly version$ = this._version$$.asObservable().pipe(
    scan((n) => n + 1, 0)
  );

  // Constructor
  constructor(readonly memory: AntMemory<T>) {
    // Follow memory updates
    memory.updates$.subscribe(([pos, data]) => {
      let updated = false;

      if (data.detected) {
        const len = this._knowledge.size;
        updated = this._knowledge.add(hash(pos)).size !== len;
      } else {
        updated = this._knowledge.delete(hash(pos));
      }

      if (updated) this._version$$.next();
    });
  }

  // Methods
  contains(pos: IVector): boolean {
    return this._knowledge.has(hash(pos));
  }
}
