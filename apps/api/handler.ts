import type { APIGatewayEvent } from 'aws-lambda';

export async function hello(event: APIGatewayEvent) {
  return {
    message: 'Go Serverless v3! Your function executed successfully!',
    input: event,
  };
}
