import * as AWS from 'aws-sdk';
import { FileAccess } from '../dataLayer/fileAccess';

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
    return this.fileAccess.getSignedUrl(todoId);
  }
}
