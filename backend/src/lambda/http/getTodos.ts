import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { getUserId } from '../utils';

const docClient = new AWS.DynamoDB.DocumentClient();

const todosTable = process.env.TODOS_TABLE;
const indexName = process.env.INDEX_NAME;

const getTodosHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event);
  const result = await docClient
    .scan({
      TableName: todosTable,
      IndexName: indexName,
      FilterExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    })
    .promise();

  const items = result.Items;

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ items }),
  };
};

export const handler = middy(getTodosHandler).use(cors({ credentials: true }));
