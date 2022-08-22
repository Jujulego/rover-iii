import { Vector } from '@ants/maths';

import { Map } from '../../maps';
import { Ant } from '../Ant';
import { AntColorName } from '../colors';
import { AntMemory } from '../memory/AntMemory';
import { AntMessageHandler } from './AntMessageHandler';

// Types
export interface AntWorkerType {
  new(name: string, map: Map, color: AntColorName, position: Vector, messages: AntMessageHandler): Ant & AntWorker;
}

// Class
export interface AntWorker {
  // Attributes
  readonly memory?: AntMemory<unknown>;

  // Methods
  compute(target: Vector): Promise<Vector>;
}
