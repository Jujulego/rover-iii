import { AntWithMemory } from './memory/AntMemory';
import { AntKnowledge, AntWithKnowledge } from './AntKnowledge';
import { AntTree, AntWithTree } from './AntTree';
import { ParallelAnt } from './ParallelAnt';
import { AntWorkerMemory } from './worker/AntWorkerMemory';

import type { DStarData } from './DStarAnt.worker';

// Class
export abstract class DStarAnt extends ParallelAnt implements AntWithMemory<DStarData>, AntWithTree<DStarData>, AntWithKnowledge<DStarData> {
  // Attributes
  readonly memory = new AntWorkerMemory<DStarData>(this.requests);
  readonly knowledge = new AntKnowledge(this.memory);
  readonly tree = new AntTree(this.memory);
}
