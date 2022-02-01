import { IRect, ISize } from '../../math2d';
import { WorkerMessage } from '../../workers/messages';

import { MapGenOptions } from '../MapGenerator';

// Types
// - requests
export interface MapGenWorkerSetup extends WorkerMessage<'setup'> {
  type: 'setup';
}

export interface MapGenWorkerGenerate extends WorkerMessage<'generate'> {
  type: 'generate';
  name: string;
  size: ISize;
  opts: MapGenOptions;
}

export type MapGenRequest = MapGenWorkerSetup | MapGenWorkerGenerate;

// - results
export interface MapGenWorkerGenerateResult extends WorkerMessage<'generate'> {
  type: 'generate';
  bbox: IRect;
}

export type MapGenResult = MapGenWorkerGenerateResult;
