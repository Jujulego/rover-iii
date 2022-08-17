import { IAntColor } from './color';

// Constants
const whiteAnt: IAntColor<'white'> = {
  name: 'white',
  texture: new URL('./white-ant.png', import.meta.url),
  color: '#e0e0e0',
  opacity: .66
};

export default whiteAnt;
