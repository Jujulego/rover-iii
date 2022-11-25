import { GeneratorStack, type GeneratorStackConfig, type StackProgressEvent } from '@ants/world';

import { worldClient } from '../world-client';

import { Message } from './message';
import { WorkerHandler } from './worker-handler';

// Types
export interface GenerateRequest extends Message<'generate'> {
  readonly world: string;
  readonly stack: GeneratorStackConfig;
}

export interface ProgressMessage extends Message<'progress'> {
  readonly event: StackProgressEvent;
}

export type EndMessage = Message<'end'>;

// Handler
class WorldGeneratorWorker extends WorkerHandler<GenerateRequest, ProgressMessage | EndMessage> {
  // Methods
  protected async handle(request: GenerateRequest): Promise<EndMessage> {
    const stack = new GeneratorStack(worldClient, request.stack);

    stack.subscribe('progress', (event) => {
      this.send({
        sessionId: request.sessionId,
        type: 'progress',
        event
      });
    });

    await stack.run(request.world);

    return {
      sessionId: request.sessionId,
      type: 'end',
    };
  }
}

new WorldGeneratorWorker(self);
