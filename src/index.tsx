import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ReactDOM from 'react-dom';

import { ImgLayer } from './components/img/ImgLayer';
import { Layer } from './maps/layer';
import { theme } from './theme';

// Polyfills
import 'regenerator-runtime/runtime';

// App
const map = Layer.fromMatrix([
  [ null,  'rock',  'rock',  'rock',  'rock',   null  ],
  ['rock', 'water', 'sand',  'sand',  'water', 'rock' ],
  ['rock', 'sand',  'grass', 'grass', 'sand',  'rock' ],
  ['rock', 'sand',  'grass', 'grass', 'sand',  'rock' ],
  ['rock', 'water', 'sand',  'sand',  'water', 'rock' ],
  [ null,  'rock',  'rock',  'rock',  'rock',   null  ],
]);

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <ImgLayer layer={map} />
  </ThemeProvider>,
  document.getElementById('root')
);
