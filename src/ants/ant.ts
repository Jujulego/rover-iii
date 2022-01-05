import { Map } from '../maps';

import { Thing } from './thing';

// Constants
export const ANT_COLORS = {
  blue:   new URL('./blue-ant.png',   import.meta.url),
  green:  new URL('./green-ant.png',  import.meta.url),
  pink:   new URL('./pink-ant.png',   import.meta.url),
  white:  new URL('./white-ant.png',  import.meta.url),
  yellow: new URL('./yellow-ant.png', import.meta.url),
};

// Class
export class Ant extends Thing {
  // Constructor
  constructor(
    readonly map: Map,
    readonly color: keyof typeof ANT_COLORS,
    position = map.bbox.tl
  ) {
    super(position, ANT_COLORS[color]);
  }
}
