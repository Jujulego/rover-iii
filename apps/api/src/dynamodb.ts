import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import AwsXRay from 'aws-xray-sdk-core';

// Utils
export function dynamodbClient() {
  return DynamoDBDocumentClient.from(
    AwsXRay.captureAWSv3Client(new DynamoDBClient({}))
  );
}
