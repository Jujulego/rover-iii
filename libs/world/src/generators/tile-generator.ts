import { IRect, rect } from '@jujulego/2d-maths';
import { EventSource } from '@jujulego/event-tree';

import { ITile } from '../tile';
import { WorldClient } from '../world-client';

// Types
export interface TileGeneratorOpts {
  readonly bbox: IRect;
  readonly chunkSize?: number;
  readonly version?: number;
}

export interface ProgressEvent {
  readonly count: number;
  readonly progress: number;
}

export type TileGeneratorEventMap = {
  progress: ProgressEvent;
};

export type AwaitableGenerator<T> = AsyncGenerator<T> | Generator<T>;

// Class
export abstract class TileGenerator<O extends TileGeneratorOpts> extends EventSource<TileGeneratorEventMap> {
  // Constructor
  constructor(
    protected readonly client: WorldClient,
  ) {
    super();
  }

  // Methods
  protected abstract generate(world: string, opts: O): AwaitableGenerator<ITile>;

  async run(world: string, opts: O): Promise<void> {
    const { chunkSize = 1000, version } = opts;
    const size = rect(opts.bbox).size;

    const step = Math.ceil(Math.min(chunkSize, size.dx * size.dy) / 10);

    let chunk: ITile[] = [];
    let count = 0;

    for await (const tile of this.generate(world, opts)) {
      chunk.push(tile);
      count++;

      if (count % step === 0) {
        this.emit('progress', {
          count,
          progress: count / (size.dx * size.dy),
        });
      }

      if (chunk.length >= chunkSize) {
        await this.client.bulkPutTile(world, chunk, { version });
        chunk = [];
      }
    }

    if (chunk.length > 0) {
      await this.client.bulkPutTile(world, chunk, { version });
    }

    if (count % step !== 0) {
      this.emit('progress', {
        count,
        progress: count / (size.dx * size.dy),
      });
    }
  }
}
