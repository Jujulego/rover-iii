import { IRect, IVector } from '../../math2d';
import { WorkerMessage } from '../../workers/messages';

import type { AntColorName } from '../colors';

// Types
// - requests
export interface AntWorkerSetup extends WorkerMessage<'setup'> {
  type: 'setup';
  name: string;
  map: {
    name: string;
    bbox: IRect;
  };
  color: AntColorName;
  position: IVector;
}

export interface AntWorkerCompute extends WorkerMessage<'compute'> {
  type: 'compute';
  target: IVector;
}

export interface AntWorkerMove extends WorkerMessage<'move'> {
  type: 'move';
  position: IVector;
}

export interface AntWorkerGetMemory extends WorkerMessage<'getMemory'> {
  type: 'getMemory';
  position: IVector;
}

export type AntRequest = AntWorkerSetup | AntWorkerCompute | AntWorkerMove | AntWorkerGetMemory;

// - results
export interface AntWorkerComputeResult extends WorkerMessage<'compute'> {
  type: 'compute';
  move: IVector;
}

export interface AntWorkerGetMemoryResult extends WorkerMessage<'getMemory'> {
  type: 'getMemory';
  data: unknown;
}

export interface AntWorkerMemoryUpdate extends WorkerMessage<'memoryUpdate'> {
  type: 'memoryUpdate';
  position: IVector;
  data: unknown;
}

export type AntResult = AntWorkerComputeResult | AntWorkerGetMemoryResult | AntWorkerMemoryUpdate;
