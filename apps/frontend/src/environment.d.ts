/* eslint-disable @typescript-eslint/no-unused-vars */

// Define env vars
namespace NodeJS {
  interface ProcessEnv {
    readonly API_URL: string;
    readonly AUTH_DOMAIN: string;
    readonly AUTH_IDENTITY_POOL_ID: string;
    readonly AUTH_USER_POOL_ID: string;
    readonly AUTH_CLIENT_ID: string;
  }
}
