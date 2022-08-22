import { IRect } from '@ants/maths';

import { WorkerMessage } from '../../workers/messages';
import { MapGenOptions } from '../MapGenerator';

// Types
// - requests
export interface MapGenWorkerSetup extends WorkerMessage<'setup'> {
  type: 'setup';
}

export interface MapGenWorkerGenerate extends WorkerMessage<'generate'> {
  type: 'generate';
  map: {
    name: string;
    bbox: IRect;
  }
  opts: MapGenOptions;
}

export type MapGenRequest = MapGenWorkerSetup | MapGenWorkerGenerate;

// - results
export interface MapGenWorkerGenerateResult extends WorkerMessage<'generate'> {
  type: 'generate';
}

export type MapGenResult = MapGenWorkerGenerateResult;
