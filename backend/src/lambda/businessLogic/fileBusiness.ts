import * as AWS from 'aws-sdk';
import { FileAccess } from '../dataLayer/fileAccess';
import { createLogger } from '../../utils/logger';

const logger = createLogger('fileBusiness');

export class FileBusiness {
  private readonly s3Client;
  private readonly fileAccess;

  constructor() {
    this.s3Client = new AWS.S3({
      signatureVersion: 'v4',
    });
    this.fileAccess = new FileAccess(this.s3Client);
  }

  getSignedUrl(todoId: string): string {
    logger.info('Getting SignedUrl');
    const signedUrl = this.fileAccess.getSignedUrl(todoId);
    logger.info(`SignedUrl Recovered: ${signedUrl}`);
    return signedUrl;
  }
}
