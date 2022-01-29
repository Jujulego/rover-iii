import { AntWithMemory } from './memory/AntMemory';
import { AntTree, AntWithTree } from './AntTree';
import { ParallelAnt } from './ParallelAnt';
import { AntWorkerMemory } from './worker/AntWorkerMemory';

import type { BFSData } from './BFSAnt.worker';

// Class
export class BFSAnt extends ParallelAnt implements AntWithMemory<BFSData>, AntWithTree<BFSData> {
  // Attributes
  readonly worker = new Worker(new URL('./BFSAnt.worker.ts', import.meta.url));
  readonly memory = new AntWorkerMemory<BFSData>(this);
  readonly tree = new AntTree(this.memory);
}
