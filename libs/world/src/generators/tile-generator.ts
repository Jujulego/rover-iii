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
    const { chunkSize = 500, version } = opts;
    const size = rect(opts.bbox).size;

    let chunk: ITile[] = [];
    let count = 0;

    for await (const tile of this.generate(world, opts)) {
      chunk.push(tile);

      if (chunk.length >= chunkSize) {
        await this.client.bulkPutTile(world, chunk, { version });

        count += chunk.length;
        this.emit('progress', { count, progress: count / (size.dx * size.dy) });

        chunk = [];
      }
    }

    if (chunk.length > 0) {
      await this.client.bulkPutTile(world, chunk, { version });

      count += chunk.length;
      this.emit('progress', { count, progress: count / (size.dx * size.dy) });
    }
  }
}
