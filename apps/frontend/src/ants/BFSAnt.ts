import { AntWithMemory } from './memory/AntMemory';
import { AntTree, AntWithTree } from './AntTree';
import { ParallelAnt } from './ParallelAnt';
import { AntWorkerMemory } from './worker/AntWorkerMemory';

import type { BFSData } from './BFSAnt.worker';

// Class
export class BFSAnt extends ParallelAnt implements AntWithMemory<BFSData>, AntWithTree<BFSData> {
  // Attributes
  readonly memory = new AntWorkerMemory<BFSData>(this.requests);
  readonly tree = new AntTree(this.memory);

  // Methods
  protected worker(): Worker {
    return new Worker(new URL(/* webpackChunkName: "bfs.worker" */ './BFSAnt.worker.ts', import.meta.url));
  }
}
