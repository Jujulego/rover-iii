import { IRect } from '@jujulego/2d-maths';

import { ITile } from '../tile';
import { WorldClient } from '../world-client';

// Types
export interface TileGeneratorOpts {
  readonly bbox: IRect;
  readonly chunkSize?: number;
}

// Class
export abstract class TileGenerator<O extends TileGeneratorOpts> {
  // Constructor
  constructor(
    protected readonly client: WorldClient,
  ) {}

  // Methods
  protected abstract generate(world: string, opts: O): AsyncGenerator<ITile> | Generator<ITile>;

  async run(world: string, opts: O): Promise<void> {
    const { chunkSize = 500 } = opts;

    let chunk: ITile[] = [];

    for await (const tile of this.generate(world, opts)) {
      chunk.push(tile);

      if (chunk.length > chunkSize) {
        await this.client.bulkPutTile(world, chunk);
        chunk = [];
      }
    }

    if (chunk.length > 0) {
      await this.client.bulkPutTile(world, chunk);
    }
  }
}
