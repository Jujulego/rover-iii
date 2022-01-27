import { IRect, IVector } from '../../math2d';

import { AntColorName } from '../colors';

// Types
export interface AntMessage<T extends string = string> {
  id?: number;
  type: T;
}

export type AntResultOf<R extends AntRequest> = Extract<AntResult, { type: R['type'] }>;

// - requests
export interface AntWorkerSetup extends AntMessage<'setup'> {
  type: 'setup';
  name: string;
  map: {
    name: string;
    bbox: IRect;
  };
  color: AntColorName;
  position: IVector;
}

export interface AntWorkerCompute extends AntMessage<'compute'> {
  type: 'compute';
  target: IVector;
}

export interface AntWorkerMove extends AntMessage<'move'> {
  type: 'move';
  position: IVector;
}

export interface AntWorkerGetMemory extends AntMessage<'getMemory'> {
  type: 'getMemory';
  position: IVector;
}

export type AntRequest = AntWorkerSetup | AntWorkerCompute | AntWorkerMove | AntWorkerGetMemory;

// - results
export interface AntWorkerComputeResult extends AntMessage<'compute'> {
  type: 'compute';
  move: IVector;
}

export interface AntWorkerGetMemoryResult extends AntMessage<'getMemory'> {
  type: 'getMemory';
  data: unknown;
}

export interface AntWorkerMemoryUpdate extends AntMessage<'memoryUpdate'> {
  type: 'memoryUpdate';
  position: IVector;
  data: unknown;
}

export type AntResult = AntWorkerComputeResult | AntWorkerGetMemoryResult | AntWorkerMemoryUpdate;
