import { indigo, deepOrange } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// Themes
export const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: deepOrange,
    mode: 'dark',
  },
  components: {
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: { variant: 'h6' },
      },
    },
    MuiDialog: {
      defaultProps: {
        maxWidth: 'xs',
        fullWidth: true,
      },
    },
  },
});
