import { GeneratorStack } from '@ants/world';
import { disk, IDisk, IRect, rect } from '@jujulego/2d-maths';

import { worldClient } from '../world-client';

import { WorkerHandler } from './worker-handler';
import type { EndMessage, GenerateRequest, ProgressMessage } from './world-generator';

// Handler
class WorldGeneratorWorker extends WorkerHandler<GenerateRequest, ProgressMessage | EndMessage> {
  // Methods
  protected async handle(request: GenerateRequest): Promise<EndMessage> {
    for (const step of request.stack.steps) {
      if ('t' in step.opts.shape) {
        Object.assign(step.opts, { shape: rect(step.opts.shape as unknown as IRect) });
      } else {
        Object.assign(step.opts, { shape: disk(step.opts.shape as unknown as IDisk) });
      }
    }

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
