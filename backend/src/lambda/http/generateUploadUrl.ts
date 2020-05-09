import 'source-map-support/register';

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
} from 'aws-lambda';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { FileBusiness } from '../businessLogic/fileBusiness';

const fileBusiness = new FileBusiness();

const generateUploadUrlHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;

  return {
    statusCode: 201,
    body: JSON.stringify({ uploadUrl: fileBusiness.getSignedUrl(todoId) }),
  };
};

export const handler = middy(generateUploadUrlHandler).use(
  cors({ credentials: true }),
);
