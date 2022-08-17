import Dexie, { Table } from 'dexie';

import { IRect, IVector } from './math2d';
import { BiomeName } from './biomes';

// Constants
const DB_VERSION = 3;

// Entities
export interface MapEntity {
  name: string;
  bbox: IRect;
}

export interface TileEntity {
  map: string;
  pos: IVector;
  biome: BiomeName;
}

// Database
export class AntsDatabase extends Dexie {
  // Attributes
  maps: Table<MapEntity>;
  tiles: Table<TileEntity>;

  // Constructor
  constructor() {
    super('ants');

    this.version(DB_VERSION).stores({
      maps: '&name',
      tiles: '&[map+pos.y+pos.x]'
    });
  }
}

export const db = new AntsDatabase();
