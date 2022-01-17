import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import ReactDOM from 'react-dom';
import React from 'react';

import { App } from './App';
import { theme } from './theme';

// Polyfills
import 'regenerator-runtime/runtime';

// App
ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
