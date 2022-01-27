import { BiomeName } from '../biomes';
import { Vector } from '../math2d';

import { AntWithMemory } from './memory/AntMemory';
import { AntKnowledge, AntWithKnowledge, KnownData } from './AntKnowledge';
import { AntTree, AntWithTree, TreeData } from './AntTree';
import { ParallelAnt } from './ParallelAnt';
import { AntWorkerMemory } from './worker/AntWorkerMemory';

// Types
interface DStarData extends KnownData, TreeData {
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
export abstract class DStarAnt extends ParallelAnt implements AntWithMemory<DStarData>, AntWithTree<DStarData>, AntWithKnowledge<DStarData> {
  // Attributes
  readonly memory = new AntWorkerMemory<DStarData>(this);
  readonly tree = new AntTree(this.memory);
  readonly knowledge = new AntKnowledge(this.memory);
}
