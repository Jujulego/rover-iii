import { ItemOf } from '../types';

import grass from './grass';
import rock from './rock';
import sand from './sand';
import water from './water';

// Types
export type Biome = ItemOf<typeof BIOMES>;

// Constants
export const BIOMES = [grass, rock, sand, water];
