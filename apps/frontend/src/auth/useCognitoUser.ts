import { Auth, CognitoUser } from '@aws-amplify/auth';
import { Hub } from '@aws-amplify/core';
import { useEffect, useState } from 'react';

// Hooks
export function useCognitoUser(): CognitoUser | undefined {
  const [user, setUser] = useState<CognitoUser>();

  useEffect(() => {
    const unsub = Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
          setUser(data);
          break;

        case 'signOut':
          setUser(undefined);
          break;
      }
    });

    Auth.currentAuthenticatedUser()
      .then((user) => setUser(user));

    return unsub;
  }, []);

  return user;
}
