import { Map } from '../../maps';
import { Rect, Vector } from '../../math2d';

import { Ant } from '../Ant';
import { AntColorName } from '../colors';
import { AntRequest, AntResult } from './message';

// Class
export abstract class AntWorker extends Ant {
  // Statics
  static setupWorker(cls: { new(map: Map, color: AntColorName, position: Vector): AntWorker }) {
    let worker: AntWorker;

    // Listen to messages
    self.addEventListener('message', async (msg: MessageEvent<AntRequest>) => {
      // Initialise worker
      if (!worker && msg.data.type === 'setup') {
        const map = new Map(msg.data.map.name, new Rect(msg.data.map.bbox));
        const pos = new Vector(msg.data.position);

        worker = new cls(map, msg.data.color, pos);
      }

      if (worker) {
        await worker._handleRequest(msg.data);
      }
    });
  }

  // Methods
  protected sendResult(msg: AntResult) {
    self.postMessage(msg);
  }

  private async _handleRequest(req: AntRequest): Promise<void> {
    switch (req.type) {
      case 'compute':
        this.sendResult({
          type: 'compute',
          move: await this.compute(new Vector(req.target)),
        });

        break;

      case 'move':
        this.position = new Vector(req.position);

        break;
    }
  }
}
