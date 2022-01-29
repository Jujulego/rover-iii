import { AntWithMemory } from './memory/AntMemory';
import { AntTree, AntWithTree } from './AntTree';
import { ParallelAnt } from './ParallelAnt';
import { AntWorkerMemory } from './worker/AntWorkerMemory';

import type { DFSData } from './DFSAnt.worker';

// Class
export class DFSAnt extends ParallelAnt implements AntWithMemory<DFSData>, AntWithTree<DFSData> {
  // Attributes
  readonly worker = new Worker(new URL('./DFSAnt.worker.ts', import.meta.url));
  readonly memory = new AntWorkerMemory<DFSData>(this);
  readonly tree = new AntTree(this.memory);
}
