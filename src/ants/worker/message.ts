import { IRect, IVector } from '../../math2d';

import { AntColorName } from '../colors';

// Types
export interface AntMessage<T extends string = string> {
  type: T;
}

// - requests
export interface AntWorkerSetup extends AntMessage<'setup'> {
  type: 'setup';
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

export type AntRequest = AntWorkerSetup | AntWorkerCompute | AntWorkerMove;

// - results
export interface AntWorkerComputeResult extends AntMessage<'compute'> {
  type: 'compute';
  move: IVector;
}

export type AntResult = AntWorkerComputeResult;
