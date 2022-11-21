import { ITile, WorldClient } from '@ants/world';
import { IPoint, IRect } from '@jujulego/2d-maths';
import Dexie from 'dexie';

// Constants
const DB_VERSION = 1;
const TILES_XY_INDEX = '&[world+pos.x+pos.y]';
const TILES_YX_INDEX = '&[world+pos.y+pos.x]';

// Types
export interface ITileEntity extends ITile {
  readonly world: string;
}

type ITileIndexed = Pick<ITileEntity, 'world' | 'pos'>;

// Class
export class WorldIdbClient extends WorldClient {
  // Attributes
  private readonly _database: Dexie;

  // Constructor
  constructor(database: string) {
    super();

    this._database = new Dexie(database);
    this._initDatabase();
  }

  // Methods
  private _initDatabase() {
    this._database.version(DB_VERSION)
      .stores({
        tiles: [TILES_XY_INDEX, TILES_YX_INDEX].join(', ')
      });
  }

  getTile(world: string, pos: IPoint): Promise<ITile | undefined> {
    return this._tiles.get({ world, pos });
  }

  async *loadTilesIn(world: string, bbox: IRect): AsyncGenerator<ITile> {
    const coll = this._tiles.where(TILES_XY_INDEX)
      .between(
        [world, bbox.l, bbox.b],
        [world, bbox.r + 1, bbox.t + 1],
      );

    for (const tile of await coll.toArray()) {
      yield tile;
    }
  }

  async putTile(world: string, tile: ITile): Promise<void> {
    await this._tiles.put({ ...tile, world });
  }

  async bulkPutTile(world: string, tiles: ITile[]): Promise<void> {
    await this._tiles.bulkPut(tiles.map((tile) => ({ ...tile, world })));
  }

  // Properties
  get _tiles() {
    return this._database.table<ITileEntity, ITileIndexed>('tiles');
  }
}
