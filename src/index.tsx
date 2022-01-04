import { CssBaseline, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ReactDOM from 'react-dom';

import { Layer } from './maps/layer';
import { theme } from './theme';

// Polyfills
import 'regenerator-runtime/runtime';

// App
const map = Layer.fromMatrix([
  [ null,   'rock', 'rock',  'rock',  null  ],
  ['rock',  'sand', 'sand',  'sand', 'rock' ],
  ['rock',  'sand', 'grass', 'sand', 'rock' ],
  ['rock',  'sand', 'sand',  'sand', 'rock' ],
  [ null,   'rock', 'rock',  'rock',  null  ],
]);

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Typography variant="h1">Hello world !</Typography>
  </ThemeProvider>,
  document.getElementById('root')
);
