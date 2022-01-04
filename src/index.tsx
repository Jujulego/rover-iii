import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ReactDOM from 'react-dom';

import { Ant } from './ants/ant';
import { ImgAntLayer } from './components/img/ImgAntLayer';
import { ImgMapLayer } from './components/img/ImgMapLayer';
import { cellularMap } from './maps';
import { theme } from './theme';

// Polyfills
import 'regenerator-runtime/runtime';

// App
const map = cellularMap(
  { w: 20, h: 20 },
  { water: 3, grass: 4, sand: 3 },
  { seed: 'toto', iterations: 5, outBiome: 'water' }
);

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />

    <Box display="grid" gridAutoRows={64} gridAutoColumns={64}>
      <ImgMapLayer map={map} />
      <ImgAntLayer ants={[new Ant(map)]} />
    </Box>
  </ThemeProvider>,
  document.getElementById('root')
);
