import { CssBaseline, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ReactDOM from 'react-dom';

import { theme } from './theme';

// Polyfills
import 'regenerator-runtime/runtime';

// App
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Typography variant="h1">Hello world !</Typography>
  </ThemeProvider>,
  document.getElementById('root')
);
