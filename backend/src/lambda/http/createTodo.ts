import 'source-map-support/register';

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';

import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { getUserId } from '../utils';
import { TodoBusiness } from '../businessLogic/todoBusiness';
import { createLogger } from '../../utils/logger';

const logger = createLogger('todoBusiness');

const todoBusiness = new TodoBusiness();

const createTodoHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const parsedBody = JSON.parse(event.body) as CreateTodoRequest;
  const userId = getUserId(event);

  const todoCreated = await todoBusiness.createTodo(userId, parsedBody);

  logger.info(`Created new Todo: ${todoCreated}`);

  return {
    statusCode: 201,
    body: JSON.stringify({
      item: todoCreated,
    }),
  };
};

export const handler = middy(createTodoHandler).use(
  cors({ credentials: true }),
);
