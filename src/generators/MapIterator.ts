import { db, TileEntity } from '../db';
import { Map } from '../maps';

import { MapGenerator, MapGenOptions } from './MapGenerator';

// Class
export abstract class MapIterator<O extends MapGenOptions> extends MapGenerator<O> {
  // Constructor
  constructor(readonly chunkSize = 500) {
    super();
  }

  // Methods
  protected abstract iterate(map: Map, opts: O): Generator<TileEntity>;

  protected async run(map: Map, opts: O): Promise<void> {
    let chunk: TileEntity[] = [];

    await db.transaction('rw', db.tiles, async () => {
      for (const tile of this.iterate(map, opts)) {
        chunk.push(tile);

        if (chunk.length > this.chunkSize) {
          await db.tiles.bulkPut(chunk);
          chunk = [];
        }
      }

      await db.tiles.bulkPut(chunk);
    });
  }
}
