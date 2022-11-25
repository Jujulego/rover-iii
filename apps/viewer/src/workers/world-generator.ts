import { GeneratorStackConfig } from '@ants/world';

import { RequestSender } from './request-sender';
import type { EndMessage, GenerateRequest, ProgressMessage } from './world-generator.worker';

// Class
export class WorldGenerator {
  // Attributes
  private _sender?: RequestSender<GenerateRequest, ProgressMessage | EndMessage>;

  // Methods
  private _getSender(): RequestSender<GenerateRequest, ProgressMessage | EndMessage> {
    if (!this._sender) {
      this._sender = new RequestSender(
        new Worker(new URL(/* webpackChunkName: "world-generator" */'./world-generator.worker.ts', import.meta.url))
      );
    }

    return this._sender;
  }

  generate(world: string, stack: GeneratorStackConfig) {
    const sender = this._getSender();

    return sender.request({
      type: 'generate',
      world, stack
    });
  }
}
