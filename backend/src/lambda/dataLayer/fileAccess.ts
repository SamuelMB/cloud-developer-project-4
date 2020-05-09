import * as AWS from 'aws-sdk';

export class FileAccess {
  private readonly bucketName: string;
  private readonly s3Client: AWS.S3;
  private readonly urlExpiration: number;

  constructor(s3Client: AWS.S3) {
    this.s3Client = s3Client;
    this.bucketName = process.env.IMAGES_S3_BUCKET;
    this.urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION);
  }

  getSignedUrl(todoId: string): string {
    return this.s3Client.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: todoId,
      Expires: this.urlExpiration,
    });
  }
}
