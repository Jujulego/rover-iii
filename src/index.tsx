import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ReactDOM from 'react-dom';

import { ImgLayer } from './components/img/ImgLayer';
import { cellularLayer } from './maps';
import { theme } from './theme';

// Polyfills
import 'regenerator-runtime/runtime';

// App
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <ImgLayer layer={cellularLayer(
      { w: 20, h: 20 },
      { water: 3, grass: 4, sand: 3 },
      { seed: 'toto', iterations: 5, outBiome: 'water' }
    )} />
  </ThemeProvider>,
  document.getElementById('root')
);
