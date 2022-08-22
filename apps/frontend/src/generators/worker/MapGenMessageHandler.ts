import { Rect } from '@ants/maths';

import { Map } from '../../maps';
import { MessageHandler } from '../../workers/MessageHandler';
import { MapGenRequest, MapGenResult } from './message';
import { MapGenerator } from '../MapGenerator';

// Types
export interface MapGeneratorType {
  new(): MapGenerator;
}

// Class
export class MapGenMessageHandler extends MessageHandler<MapGenRequest, MapGenResult> {
  // Attributes
  private _generator?: MapGenerator;

  // Constructor
  constructor(readonly cls: MapGeneratorType) {
    super(self);
  }

  // Methods
  protected async handle(req: MapGenRequest): Promise<MapGenResult | void> {
    if (!this._generator && req.type === 'setup') {
      // Create generator
      this._generator = new this.cls();
    }

    if (this._generator) {
      switch (req.type) {
        case 'generate': {
          await this._generator.generate(new Map(req.map.name, new Rect(req.map.bbox)), req.opts);

          return {
            type: 'generate',
          };
        }
      }
    }
  }
}

// Decorator
export function RegisterMapGenWorker(cls: MapGeneratorType) {
  new MapGenMessageHandler(cls);
}
