import { Auth, CognitoUser } from '@aws-amplify/auth';
import { Hub } from '@aws-amplify/core';
import { FC, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// Component
const AuthPage: FC = () => {
  const [user, setUser] = useState<CognitoUser | null>(null);
  const [customState, setCustomState] = useState(null);

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          setUser(data);
          break;
        case "signOut":
          setUser(null);
          break;
        case "customOAuthState":
          setCustomState(data);
      }
    });

    Auth.currentAuthenticatedUser()
      .then((currentUser) => setUser(currentUser))
      .catch(() => console.log("Not signed in"));

    return unsubscribe;
  }, []);

  // Render
  return (
    <Box component="main" mx={4} my={4}>
      <Button onClick={() => Auth.federatedSignIn()}>Open Hosted UI</Button>
      <Button onClick={() => Auth.signOut()}>Sign out {user?.getUsername()}</Button>
    </Box>
  );
};

export default AuthPage;
