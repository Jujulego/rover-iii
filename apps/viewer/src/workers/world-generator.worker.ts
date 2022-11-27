import { GeneratorStack } from '@ants/world';

import { worldClient } from '../world-client';

import { WorkerHandler } from './worker-handler';
import type { EndMessage, GenerateRequest, ProgressMessage } from './world-generator';

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

new WorldGeneratorWorker('world-generator', self);
