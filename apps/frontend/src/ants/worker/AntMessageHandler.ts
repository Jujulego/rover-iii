import { Rect, Vector } from '@ants/maths';

import { Map } from '../../maps';
import { MessageHandler } from '../../workers/MessageHandler';
import { Ant } from '../Ant';
import { AntWorker, AntWorkerType } from './AntWorker';
import { AntRequest, AntResult } from './message';

// Class
export class AntMessageHandler extends MessageHandler<AntRequest, AntResult> {
  // Attributes
  private _worker?: AntWorker & Ant;

  // Constructor
  constructor(readonly cls: AntWorkerType) {
    super(self);
  }

  // Methods
  protected async handle(req: AntRequest): Promise<AntResult | void> {
    if (!this._worker && req.type === 'setup') {
      // Create worker
      const map = new Map(req.map.name, new Rect(req.map.bbox));
      const pos = new Vector(req.position);

      this._worker = new this.cls(req.name, map, req.color, pos, this);

      // Connect memory events
      if (this._worker.memory) {
        this._worker.memory.updates$.subscribe(([position, data]) => {
          this.send({ type: 'memoryUpdate', position, data });
        });
      }
    }

    if (this._worker) {
      switch (req.type) {
        case 'compute':
          return {
            type: 'compute',
            move: await this._worker.compute(new Vector(req.target)),
          };

        case 'move':
          this._worker.position = new Vector(req.position);
          break;

        case 'getMemory':
          if (this._worker.memory) {
            return {
              type: 'getMemory',
              data: await this._worker.memory.get(req.position),
            };
          }

          break;
      }
    }
  }
}

// Decorator
export function RegisterAntWorker(cls: AntWorkerType) {
  new AntMessageHandler(cls);
}
