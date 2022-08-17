import { AntWithMemory } from './memory/AntMemory';
import { AntTree, AntWithTree } from './AntTree';
import { ParallelAnt } from './ParallelAnt';
import { AntWorkerMemory } from './worker/AntWorkerMemory';

import type { DFSData } from './DFSAnt.worker';

// Class
export class DFSAnt extends ParallelAnt implements AntWithMemory<DFSData>, AntWithTree<DFSData> {
  // Attributes
  readonly memory = new AntWorkerMemory<DFSData>(this.requests);
  readonly tree = new AntTree(this.memory);

  // Methods
  protected worker() {
    return new Worker(new URL(/* webpackChunkName: "dfs.worker" */ './DFSAnt.worker.ts', import.meta.url));
  }
}
