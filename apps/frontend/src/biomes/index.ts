import { ItemOf } from '../types';

import grass from './grass';
import rock from './rock';
import sand from './sand';
import water from './water';

// Types
export type Biome = ItemOf<typeof BIOMES>;
export type BiomeName = Biome['name'];

// Constants
export const BIOMES = [grass, rock, sand, water];
export const BIOME_NAMES = BIOMES.map(b => b.name);
