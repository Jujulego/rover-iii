import { db } from '../db';
import { MapGenerator, MapGenOptions } from '../generators';
import { Rect } from '../math2d';

import { Map } from './map';

// Class
class MapRepository {
  // Methods
  async add(map: Map): Promise<void> {
    await db.maps.add({ name: map.name, bbox: map.bbox });
  }

  async get(name: string): Promise<Map | null> {
    const entity = await db.maps.get(name);

    if (!entity) {
      return null;
    }

    return new Map(entity.name, new Rect(entity.bbox));
  }

  async getOrGenerate<O extends MapGenOptions>(name: string, bbox: Rect, generator: MapGenerator<O>, opts: O): Promise<Map> {
    let map = await this.get(name);

    if (!map) {
      // Ensure no tiles exists
      await db.tiles
        .where('map').equals(name)
        .delete();

      // generate and save map
      map = new Map(name, bbox);
      await generator.generate(map, opts);

      await this.add(map);
    }

    return map;
  }
}

// Instance
export const mapRepository = new MapRepository();
