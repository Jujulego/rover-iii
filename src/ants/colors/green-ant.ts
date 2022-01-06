import { IAntColor } from './color';

// Constants
const greenAnt: IAntColor<'green'> = {
  name: 'green',
  texture: new URL('./green-ant.png', import.meta.url),
  color: '#4caf50',
};

export default greenAnt;
