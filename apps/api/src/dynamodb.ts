import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import AwsXRay from 'aws-xray-sdk-core';

// Utils
export function dynamodbClient() {
  let client = new DynamoDBClient({});

  if (!process.env.IS_OFFLINE) {
    client = AwsXRay.captureAWSv3Client(client);
  }

  return DynamoDBDocumentClient.from(client);
}
