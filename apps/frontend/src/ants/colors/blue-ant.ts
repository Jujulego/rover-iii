import { IAntColor } from './color';

// Constants
const blueAnt: IAntColor<'blue'> = {
  name: 'blue',
  texture: new URL('./blue-ant.png', import.meta.url),
  color: '#3f51b5',
  opacity: .33
};

export default blueAnt;
