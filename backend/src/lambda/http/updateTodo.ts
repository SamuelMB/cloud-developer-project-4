import 'source-map-support/register';

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest';
import { getUserId } from '../utils';
import { TodoBusiness } from '../businessLogic/todoBusiness';
import { createLogger } from '../../utils/logger';

const logger = createLogger('updateTodo');

const todoBusiness = new TodoBusiness();

const updateTodoHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const updatedTodo = JSON.parse(event.body) as UpdateTodoRequest;
  const userId = getUserId(event);

  await todoBusiness.updateTodo(todoId, userId, updatedTodo);

  logger.info(`Todo Updated: ${updatedTodo}`);

  return {
    statusCode: 204,
    body: '',
  };
};

export const handler = middy(updateTodoHandler).use(
  cors({ credentials: true }),
);
