import { ITile, IWorld, WorldClient } from '@ants/world';
import { IPoint, Rect } from '@jujulego/2d-maths';
import Dexie from 'dexie';

// Constants
const DB_VERSION = 1;
const TILES_XY_INDEX = '[world.name+world.version+pos.x+pos.y]';

// Types
export interface ITileEntity extends ITile {
  readonly world: IWorld;
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
        tiles: `&${TILES_XY_INDEX}`
      });
  }

  getTile(world: IWorld, pos: IPoint): Promise<ITile | undefined> {
    return this._tiles.get({ world, version: world.version, pos });
  }

  loadTilesIn(world: IWorld, bbox: Rect): Promise<ITile[]> {
    const coll = this._tiles.where(TILES_XY_INDEX)
      .between(
        [world.name, world.version, bbox.l, bbox.b],
        [world.name, world.version, bbox.r, bbox.t],
      )
      .filter((tile) => bbox.contains(tile.pos));

    return coll.toArray();
  }

  async putTile(world: IWorld, tile: ITile): Promise<void> {
    await this._tiles.put({ ...tile, world });
  }

  async bulkPutTile(world: IWorld, tiles: ITile[]): Promise<void> {
    await this._tiles.bulkPut(tiles.map((tile) => ({ ...tile, world })));
  }

  async clear(world: IWorld): Promise<void> {
    await this._tiles.where({ world }).delete();
  }

  // Properties
  private get _tiles() {
    return this._database.table<ITileEntity, ITileIndexed>('tiles');
  }
}

// Instance
export const worldClient = new WorldIdbClient('ants-viewer');
