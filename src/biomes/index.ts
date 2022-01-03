import grass from './grass';
import rock from './rock';
import sand from './sand';
import water from './water';

// Types
export type Biome = typeof BIOMES extends Array<infer T> ? T : never;

// Constants
export const BIOMES = [grass, rock, sand, water];
