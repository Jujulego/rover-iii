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

  private _updateTile(old: ITileEntity, tile: ITile, version?: number): ITileEntity {
    if (version !== undefined) {
      while (old.history.length <= version) {
        old.history.push(old.biome);
      }

      old.history[version] = tile.biome;
    } else {
      old.history.push(tile.biome);
    }

    return {
      world: old.world,
      pos: old.pos,
      biome: tile.biome,
      history: old.history,
    };
  }

  async getTile(world: string, pos: IPoint, opts?: TileOpts): Promise<ITile> {
    const tile = await this.tiles.get({ world, 'pos.x': pos.x, 'pos.y': pos.y });

    if (!tile) {
      throw new Error(`Tile ${world}:${pos.x},${pos.y} not found`);
    }

    return this._loadTileVersion(tile, opts?.version);
  }

  async bulkGetTile(world: string, pos: IPoint[], opts?: TileOpts): Promise<ITile[]> {
    const keys = pos.map((pt) => [world, pt.x, pt.y]);
    const tiles: ITile[] = [];

    for (const tile of await this.tiles.bulkGet(keys)) {
      if (tile) {
        tiles.push(this._loadTileVersion(tile, opts?.version));
      }
    }

    return tiles;
  }

  async loadTilesIn(world: string, bbox: Rect, opts?: TileOpts): Promise<ITile[]> {
    const tiles = await this.tiles
      .where(TILES_XY_INDEX).between([world, bbox.l, bbox.b], [world, bbox.r, bbox.t])
      .filter((tile) => bbox.contains(tile.pos))
      .toArray();

    return tiles.map((tile) => this._loadTileVersion(tile, opts?.version));
  }

  async putTile(world: string, tile: ITile, opts?: TileOpts): Promise<void> {
    await this._database.transaction('rw', this.tiles, async () => {
      let old = await this.tiles.get({ world, 'pos.x': tile.pos.x, 'pos.y': tile.pos.y });

      // Create item
      old ??= {
        world,
        pos: tile.pos,
        biome: tile.biome,
        history: []
      };

      // Insert
      await this.tiles.put(this._updateTile(old, tile, opts?.version));
    });
  }

  async bulkPutTile(world: string, tiles: ITile[], opts?: TileOpts): Promise<void> {
    const toAdd = new Map(tiles.map(tile => [tileKey(tile), tile]));

    // Updates
    await this.tiles
      .where(TILES_XY_INDEX).anyOf(tiles.map((tile) => [world, tile.pos.x, tile.pos.y]))
      .modify((old, ref) => {
        const tile = toAdd.get(tileKey(old));

        if (tile) {
          ref.value = this._updateTile(old, tile, opts?.version);
          toAdd.delete(tileKey(old));
        }
      });

    // Adds
    await this.tiles.bulkAdd(tiles
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
    await this.tiles
      .where(TILES_XY_INDEX).between([world, Dexie.minKey, Dexie.minKey], [world, Dexie.maxKey, Dexie.maxKey])
      .delete();
  }

  // Properties
  get database() {
    return this._database;
  }

  get tiles() {
    return this._database.table<ITileEntity>('tiles');
  }
}

// Instance
export const worldClient = new WorldIdbClient('ants-viewer');
