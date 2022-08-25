import { apiGateway } from '../../src/middlewares';
import { APIGatewayProxyEventV2, Context } from 'aws-lambda';

// Setup
let event: APIGatewayProxyEventV2;
let context: Context;

beforeEach(() => {
  event = {
    version: '2.0',
    routeKey: '$default',
    rawPath: '/test',
    rawQueryString: '',
    headers: {},
    requestContext: {
      accountId: 'test-account',
      apiId: 'test-api',
      domainName: 'test-api.example.com',
      domainPrefix: 'test-api',
      http: {
        method: 'GET',
        path: '/test',
        protocol: 'HTTP/1.1',
        sourceIp: '10.0.0.1',
        userAgent: 'Jest'
      },
      requestId: 'test-request-id',
      routeKey: '$default',
      stage: '$default',
      time: '12/Mar/2020:19:03:58 +0000',
      timeEpoch: 1583348638390
    },
    isBase64Encoded: false,
  };

  context = {
    callbackWaitsForEmptyEventLoop: false,
    functionName: 'test',
    functionVersion: '1',
    invokedFunctionArn: 'aws:lambda:test:1',
    memoryLimitInMB: '512',
    awsRequestId: 'test-request-id',
    logGroupName: 'test-logs',
    logStreamName: 'test-logs-stream',
    getRemainingTimeInMillis: jest.fn().mockReturnValue(900000),
    done: jest.fn(),
    fail: jest.fn(),
    succeed: jest.fn(),
  };
});

// Tests
describe('apiGateway', () => {
  it('should return structured result as is', async () => {
    const handler = jest.fn()
      .mockResolvedValue({
        body: 'toto'
      });

    await expect(apiGateway(handler)(event, context))
      .resolves.toEqual({
        body: 'toto'
      });
  });
});
