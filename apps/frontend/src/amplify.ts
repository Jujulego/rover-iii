import { Auth } from '@aws-amplify/auth';

// Configure authentication
Auth.configure({
  region: 'eu-west-3',
  identityPoolId: process.env.AUTH_IDENTITY_POOL_ID,
  userPoolId: process.env.AUTH_USER_POOL_ID,
  userPoolWebClientId: process.env.AUTH_CLIENT_ID,
  oauth: {
    domain: process.env.AUTH_DOMAIN,
    scope: ['email', 'openid', 'profile'],
    redirectSignIn: window.location.origin + window.location.pathname,
    responseType: 'code',
  }
});
