import { Map } from '../../maps';
import { Rect, Vector } from '../../math2d';

import { Ant } from '../Ant';
import { AntColorName } from '../colors';
import { AntRequest, AntResult } from './message';
import { AntMemory } from '../memory/AntMemory';

// Class
export abstract class AntWorker extends Ant {
  // Attributes
  readonly memory?: AntMemory<unknown>;

  // Statics
  static setupWorker(cls: { new(name: string, map: Map, color: AntColorName, position: Vector): AntWorker }) {
    let worker: AntWorker;

    // Listen to messages
    self.addEventListener('message', async (msg: MessageEvent<AntRequest>) => {
      // Initialise worker
      if (!worker && msg.data.type === 'setup') {
        const map = new Map(msg.data.map.name, new Rect(msg.data.map.bbox));
        const pos = new Vector(msg.data.position);

        worker = new cls(msg.data.name, map, msg.data.color, pos);
      }

      if (worker) {
        await worker._handleRequest(msg.data);
      }
    });
  }

  // Methods
  protected setupWorker(): void {
    if (this.memory) {
      this.memory.updates$.subscribe(([position, data]) => {
        this.sendResult({ type: 'memoryUpdate', position, data });
      });
    }
  }

  protected sendResult(msg: AntResult) {
    self.postMessage(msg);
  }

  private async _handleRequest(req: AntRequest): Promise<void> {
    switch (req.type) {
      case 'setup':
        this.setupWorker();

        break;

      case 'compute':
        this.sendResult({
          id: req.id,
          type: 'compute',
          move: await this.compute(new Vector(req.target)),
        });

        break;

      case 'move':
        this.position = new Vector(req.position);

        break;

      case 'getMemory':
        if (this.memory) {
          this.sendResult({
            id: req.id,
            type: 'getMemory',
            data: await this.memory.get(req.position),
          });
        }

        break;
    }
  }
}
