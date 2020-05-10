import 'source-map-support/register';

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from 'aws-lambda';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { getUserId } from '../utils';
import { TodoBusiness } from '../businessLogic/todoBusiness';
import { createLogger } from '../../utils/logger';

const logger = createLogger('todoBusiness');

const todoBusiness = new TodoBusiness();

const deleteTodoHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);

  await todoBusiness.deleteTodo(todoId, userId);

  logger.info(`Todo Deleted ${todoId}`);

  return {
    statusCode: 204,
    body: '',
  };
};

export const handler = middy(deleteTodoHandler).use(
  cors({ credentials: true }),
);
