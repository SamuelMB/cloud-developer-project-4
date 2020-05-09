import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda';
import 'source-map-support/register';

import { verify, decode } from 'jsonwebtoken';
import { createLogger } from '../../utils/logger';
import { Jwt } from '../../auth/Jwt';
import { JwtPayload } from '../../auth/JwtPayload';
import * as jwksClient from 'jwks-rsa';
import * as util from 'util';

const logger = createLogger('auth');

const jwksUrl = 'https://auth-todo.auth0.com/.well-known/jwks.json';

export const handler = async (
  event: CustomAuthorizerEvent,
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken);
  try {
    const jwtToken = await verifyToken(event.authorizationToken);
    logger.info('User was authorized', jwtToken);

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
    };
  } catch (e) {
    logger.error('User not authorized', { error: e.message });

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*',
          },
        ],
      },
    };
  }
};

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  try {
    const token = getToken(authHeader);
    const jwt: Jwt = decode(token, { complete: true }) as Jwt;
    const client = jwksClient({
      strictSsl: true,
      jwksUri: jwksUrl,
    });

    const kid = jwt.header.kid;

    const getSigningKey = util.promisify(client.getSigningKey);
    const signingKey = await getSigningKey(kid);
    return verify(token, signingKey.getPublicKey(), {
      algorithms: ['RS256'],
    }) as JwtPayload;
  } catch (error) {
    logger.error(error);
  }
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header');

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header');

  const split = authHeader.split(' ');
  const token = split[1];

  return token;
}
