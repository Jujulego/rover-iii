import { Auth } from '@aws-amplify/auth';
import { FC } from 'react';

import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { useCognitoUser } from '../../auth/useCognitoUser';

// Component
export const TopBar: FC = () => {
  const user = useCognitoUser();

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Ants
          </Typography>
          { user ? (
            <Button color="inherit" onClick={() => Auth.signOut()}>Logout</Button>
          ) : (
            <Button color="inherit" onClick={() => Auth.federatedSignIn()}>Login</Button>
          ) }
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};
