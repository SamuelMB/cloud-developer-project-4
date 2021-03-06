import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { getUserId } from '../utils';
import { TodoBusiness } from '../businessLogic/todoBusiness';
import { createLogger } from '../../utils/logger';

const logger = createLogger('getTodos');

const todoBusiness = new TodoBusiness();

const getTodosHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const userId = getUserId(event);

  const items = await todoBusiness.getTodos(userId);

  logger.info(`Items Recovered: ${items}`);

  return {
    statusCode: 200,
    body: JSON.stringify({ items }),
  };
};

export const handler = middy(getTodosHandler).use(cors({ credentials: true }));
