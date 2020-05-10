import 'source-map-support/register';

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from 'aws-lambda';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { FileBusiness } from '../businessLogic/fileBusiness';
import { createLogger } from '../../utils/logger';

const logger = createLogger('generateUploadUrl');

const fileBusiness = new FileBusiness();

const generateUploadUrlHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;

  const signedUrl = fileBusiness.getSignedUrl(todoId);

  logger.info(`Generate Upload Url ${signedUrl}`);

  return {
    statusCode: 201,
    body: JSON.stringify({ uploadUrl: signedUrl }),
  };
};

export const handler = middy(generateUploadUrlHandler).use(
  cors({ credentials: true }),
);
