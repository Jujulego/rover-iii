import { BiomeName } from '../biomes';
import { FogData } from '../layers/FogTile';
import { Vector } from '../math2d';

import { AntWithMemory } from './AntMemory';
import { TreeData } from './AntTree';
import { ParallelAnt } from './ParallelAnt';
import { AntWorkerMemory } from './worker/AntWorkerMemory';

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
export abstract class DStarAnt extends ParallelAnt implements AntWithMemory<DStarData> {
  // Attributes
  readonly memory = new AntWorkerMemory<DStarData>(this);
}
