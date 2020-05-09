import 'source-map-support/register';

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';

import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { TodoItem } from '../../models/TodoItem';
import { getUserId } from '../utils';

const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;
const bucketName = process.env.IMAGES_S3_BUCKET;

const createTodoHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const parsedBody: CreateTodoRequest = JSON.parse(event.body);
  const userId = getUserId(event);
  const todoId = uuidv4();

  const newTodo: TodoItem = {
    userId: userId,
    todoId,
    ...parsedBody,
    done: false,
    createdAt: new Date().toISOString(),
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`,
  };

  await docClient.put({ TableName: todosTable, Item: newTodo }).promise();

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ newTodo }),
  };
};

export const handler = middy(createTodoHandler).use(
  cors({ credentials: true }),
);
