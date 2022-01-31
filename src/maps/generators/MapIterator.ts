import { db, TileEntity } from '../../db';
import { ISize, Rect } from '../../math2d';

import { Map } from '../map';
import { MapGenerator, MapOptions } from './MapGenerator';

// Class
export abstract class MapIterator<O extends MapOptions> extends MapGenerator<O> {
  // Constructor
  constructor(readonly chunkSize = 500) {
    super();
  }

  // Methods
  protected abstract bbox(size: ISize): Rect;
  protected abstract iterate(name: string, size: ISize, opts: O): Generator<TileEntity>;

  protected async run(name: string, size: ISize, opts: O): Promise<Map> {
    let chunk: TileEntity[] = [];

    for await (const tile of this.iterate(name, size, opts)) {
      chunk.push(tile);

      if (chunk.length > this.chunkSize) {
        db.tiles.bulkPut(chunk);
        chunk = [];
      }
    }

    db.tiles.bulkPut(chunk);

    return new Map(name, this.bbox(size));
  }
}
