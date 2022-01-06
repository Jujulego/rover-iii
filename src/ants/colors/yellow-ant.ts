import { IAntColor } from './color';

// Constants
const yellowAnt: IAntColor<'yellow'> = {
  name: 'yellow',
  texture: new URL('./yellow-ant.png', import.meta.url),
  color: '#ffc107',
};

export default yellowAnt;
