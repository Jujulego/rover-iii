import { IRect } from '@jujulego/2d-maths';

import { ITile } from '../tile';
import { WorldClient } from '../world-client';

// Types
export interface TileGeneratorOpts {
  readonly chunkSize?: number;
}

export interface IBlock {
  readonly world: string;
  readonly bbox: IRect;
}

// Class
export abstract class TileGenerator<O extends TileGeneratorOpts> {
  // Constructor
  constructor(
    protected readonly client: WorldClient,
  ) {}

  // Methods
  protected abstract generate(block: IBlock, opts: O): AsyncGenerator<ITile> | Generator<ITile>;

  async run(block: IBlock, opts: O): Promise<void> {
    const { chunkSize = 500 } = opts;

    let chunk: ITile[] = [];

    for await (const tile of this.generate(block, opts)) {
      chunk.push(tile);

      if (chunk.length > chunkSize) {
        await this.client.bulkPutTile(block.world, chunk);
        chunk = [];
      }
    }

    if (chunk.length > 0) {
      await this.client.bulkPutTile(block.world, chunk);
    }
  }
}
