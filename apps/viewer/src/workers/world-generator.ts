import type { GeneratorStackConfig, StackProgressEvent } from '@ants/world';

import { RequestWorker } from './request-worker';
import { Message } from './message';

// Types
export interface GenerateRequest extends Message<'generate'> {
  readonly world: string;
  readonly stack: GeneratorStackConfig;
}

export interface ProgressMessage extends Message<'progress'> {
  readonly event: StackProgressEvent;
}

export type EndMessage = Message<'end'>;


// Class
export class WorldGenerator extends RequestWorker<GenerateRequest, ProgressMessage | EndMessage> {
  // Constructor
  constructor() {
    super('world-generator');
  }

  // Methods
  protected _loadWorker(): Worker {
    return new Worker(new URL(/* webpackChunkName: "world-generator" */'./world-generator.worker.ts', import.meta.url));
  }

  generate(world: string, stack: GeneratorStackConfig) {
    return this.request({
      type: 'generate',
      world, stack
    });
  }
}
