import { IAntColor } from './color';

// Constants
const pinkAnt: IAntColor<'pink'> = {
  name: 'pink',
  texture: new URL('./pink-ant.png', import.meta.url),
  color: '#e91e63',
  opacity: .33
};

export default pinkAnt;
