import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

// Client
let client: DynamoDBDocument;

export function dynamodbClient() {
  client ??= DynamoDBDocument.from(new DynamoDBClient({}));

  return client;
}
