import { Map } from '../../maps';
import { Vector } from '../../math2d';

import { Ant } from '../Ant';
import { AntColorName } from '../colors';
import { AntMemory } from '../memory/AntMemory';
import { AntMessageHandler } from './AntMessageHandler';

// Types
export interface AntWorkerType {
  new(name: string, map: Map, color: AntColorName, position: Vector, messages: AntMessageHandler): AntWorker;
}

// Class
export abstract class AntWorker extends Ant {
  // Attributes
  readonly memory?: AntMemory<unknown>;

  // Constructor
  constructor(
    name: string,
    map: Map,
    color: AntColorName,
    position: Vector,
    protected readonly messages: AntMessageHandler
  ) {
    super(name, map, color, position);
  }

  // Methods
  abstract compute(target: Vector): Promise<Vector>;
}
