import { CognitoJwtVerifier } from 'aws-jwt-verify/cognito-verifier';
import { CognitoJwtPayload } from 'aws-jwt-verify/jwt-model';
import {
  APIGatewayProxyEventV2WithRequestContext,
  APIGatewayEventRequestContextV2,
  APIGatewayProxyEventV2
} from 'aws-lambda';
import { Unauthorized } from 'http-errors';

import { Middleware } from './types';

// Type
export type AnonymousRequestContext = APIGatewayEventRequestContextV2;

export interface AuthenticatedRequestContext extends APIGatewayEventRequestContextV2 {
  jwt: CognitoJwtPayload;
}

// Middleware
export function auth<O>(opts: { anonymous: true }): Middleware<APIGatewayProxyEventV2, O, APIGatewayProxyEventV2WithRequestContext<AnonymousRequestContext | AuthenticatedRequestContext>>;
export function auth<O>(opts?: { anonymous?: false }): Middleware<APIGatewayProxyEventV2, O, APIGatewayProxyEventV2WithRequestContext<AuthenticatedRequestContext>>;
export function auth<O>(opts?: { anonymous?: boolean }): Middleware<APIGatewayProxyEventV2, O, APIGatewayProxyEventV2WithRequestContext<AnonymousRequestContext | AuthenticatedRequestContext>> {
  // Initiate verifier
  const verifier = CognitoJwtVerifier.create({
    tokenUse: 'access',
    clientId: process.env.AUTH_CLIENT_ID!,
    userPoolId: process.env.AUTH_USER_POOL_ID!,
  });

  return (handler) => async (event, context) => {
    // Extract and verify token
    const token = event.headers['authorization']?.replace(/^Bearer /, '');

    if (token) {
      try {
        const payload = await verifier.verify(token);
        Object.assign(event.requestContext, { jwt: payload });

        console.log(`Allow access to ${payload.username} user`);
        return handler(event, context);
      } catch (err) {
        if (opts?.anonymous) {
          console.warn(err);
        } else {
          console.error(err);
        }
      }
    }

    // Handle anonymous case
    if (opts?.anonymous) {
      console.log('Allow access to anonymous user');
      return handler(event, context);
    } else {
      throw new Unauthorized();
    }
  };
}
