import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { isHttpError } from 'http-errors';
import _omit from 'lodash.omit';

import { Handler } from './types';

// Types
export type ApiGatewayResult = Omit<APIGatewayProxyStructuredResultV2, 'body'> & { body?: unknown; };

// Utils
function isApiGatewayResult(obj: any): obj is ApiGatewayResult {
  return typeof obj === 'object' && ('body' in obj || 'statusCode' in obj || 'headers' in obj || 'cookies' in obj);
}

function wrapResult(obj: unknown): ApiGatewayResult {
  if (isApiGatewayResult(obj)) {
    return obj;
  }

  return {
    statusCode: 200,
    body: obj,
  };
}

// Middleware
export function apiGateway<E = APIGatewayProxyEventV2>(handler: Handler<E, unknown>): Handler<E, APIGatewayProxyStructuredResultV2> {
  return async (...args) => {
    try {
      const res = wrapResult(await handler(...args));

      if (typeof res.body !== 'string') {
        res.body = JSON.stringify(res.body);
        res.headers = {
          ...res.headers,
          'Content-Type': 'application/json'
        };
      }

      return res as APIGatewayProxyStructuredResultV2;
    } catch (err) {
      if (isHttpError(err)) {
        return {
          statusCode: err.statusCode,
          headers: {
            ...err.headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(_omit(err, ['headers', 'status', 'statusCode', 'expose']))
        };
      }

      throw err;
    }
  };
}
