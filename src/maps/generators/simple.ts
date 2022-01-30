import { BiomeName } from '../../biomes';
import { db, TileEntity } from '../../db';
import { ISize, Rect, Vector } from '../../math2d';

import { Map } from '../map';

// Generator
export async function simpleMap(name: string, size: ISize, biome: BiomeName): Promise<Map> {
  const tiles: TileEntity[] = [];

  for (let y = 0; y < size.h; ++y) {
    for (let x = 0; x < size.w; ++x) {
      tiles.push({
        map: name,
        pos: new Vector(x, y),
        biome
      });
    }
  }

  await db.tiles.bulkPut(tiles);

  return new Map(name, new Rect(0, 0, size.h - 1, size.w - 1));
}
