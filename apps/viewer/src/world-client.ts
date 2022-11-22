import { ITile, tileKey, TileOpts, WorldClient } from '@ants/world';
import { IPoint, Rect } from '@jujulego/2d-maths';
import Dexie from 'dexie';

// Constants
const DB_VERSION = 1;
const TILES_XY_INDEX = '[world+pos.x+pos.y]';

// Types
export interface ITileEntity extends ITile {
  readonly world: string;
  readonly history: string[];
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

  private _loadTileVersion(tile: ITileEntity, version?: number): ITile {
    if (version !== undefined) {
      return { pos: tile.pos, biome: tile.history[version] ?? tile.biome };
    }

    return { pos: tile.pos, biome: tile.biome };
  }

  async getTile(world: string, pos: IPoint, opts?: TileOpts): Promise<ITile | undefined> {
    const tile = await this._tiles.get({ world, pos });

    return tile && this._loadTileVersion(tile, opts?.version);
  }

  async loadTilesIn(world: string, bbox: Rect, opts?: TileOpts): Promise<ITile[]> {
    const tiles = await this._tiles
      .where(TILES_XY_INDEX).between([world, bbox.l, bbox.b], [world, bbox.r, bbox.t])
      .filter((tile) => bbox.contains(tile.pos))
      .toArray();

    return tiles.map((tile) => this._loadTileVersion(tile, opts?.version));
  }

  async putTile(world: string, tile: ITile, opts?: TileOpts): Promise<void> {
    let old = await this._tiles.get({ world, pos: tile.pos });

    // Create item
    old ??= {
      world,
      pos: tile.pos,
      biome: tile.biome,
      history: []
    };

    // Update
    if (opts?.version) {
      while (old.history.length <= opts.version) {
        old.history.push(old.biome);
      }

      old.history[opts.version] = tile.biome;
    } else {
      old.history.push(tile.biome);
    }

    // Insert
    await this._tiles.put({
      world,
      pos: tile.pos,
      biome: tile.biome,
      history: old.history,
    });
  }

  async bulkPutTile(world: string, tiles: ITile[], opts?: TileOpts): Promise<void> {
    const toAdd = new Map(tiles.map(tile => [tileKey(tile), tile]));

    // Updates
    await this._tiles
      .where(TILES_XY_INDEX).anyOf(tiles.map((tile) => [world, tile.pos.x, tile.pos.y]))
      .modify((old, ref) => {
        const tile = toAdd.get(tileKey(old));

        if (!tile) {
          return;
        }

        // Update
        if (opts?.version !== undefined) {
          while (old.history.length <= opts.version) {
            old.history.push(old.biome);
          }

          old.history[opts.version] = tile.biome;
        } else {
          old.history.push(tile.biome);
        }

        ref.value = {
          world,
          pos: tile.pos,
          biome: tile.biome,
          history: old.history,
        };

        toAdd.delete(tileKey(old));
      });

    // Adds
    await this._tiles.bulkAdd(tiles
      .filter((tile) => toAdd.has(tileKey(tile)))
      .map((tile) => {
        const ent: ITileEntity = {
          world,
          pos: tile.pos,
          biome: tile.biome,
          history: [tile.biome],
        };

        if (opts?.version) {
          while (ent.history.length <= opts.version) {
            ent.history.push(ent.biome);
          }
        }

        return ent;
      })
    );
  }

  async clear(world: string): Promise<void>{
    await this._tiles
      .where(TILES_XY_INDEX).between([world, Dexie.minKey, Dexie.minKey], [world, Dexie.maxKey, Dexie.maxKey])
      .delete();
  }

  // Properties
  private get _tiles() {
    return this._database.table<ITileEntity, ITileIndexed>('tiles');
  }
}

// Instance
export const worldClient = new WorldIdbClient('ants-viewer');
