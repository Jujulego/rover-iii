import Dexie, { Table } from 'dexie';

import { IVector } from './math2d';
import { BiomeName } from './biomes';

// Constants
const DB_VERSION = 2;

// Entities
export interface TileEntity {
  map: string;
  pos: IVector;
  biome: BiomeName;
}

// Database
export class AntsDatabase extends Dexie {
  // Attributes
  tiles: Table<TileEntity>;

  // Constructor
  constructor() {
    super('ants');

    this.version(DB_VERSION).stores({
      tiles: '&[map+pos.y+pos.x]'
    });
  }
}

export const db = new AntsDatabase();
