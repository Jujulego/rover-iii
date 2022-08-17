import blueAnt from './blue-ant';
import greenAnt from './green-ant';
import pinkAnt from './pink-ant';
import whiteAnt from './white-ant';
import yellowAnt from './yellow-ant';

// Type
export type AntColor = typeof blueAnt | typeof greenAnt | typeof pinkAnt | typeof whiteAnt | typeof yellowAnt;
export type AntColorName = AntColor['name'];

// Constants
export const ANT_COLORS: Record<AntColorName, AntColor> = {
  blue:   blueAnt,
  green:  greenAnt,
  pink:   pinkAnt,
  white:  whiteAnt,
  yellow: yellowAnt,
};
