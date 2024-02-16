import { Injectable } from '@nestjs/common';
import { S3Client, ObjectCannedACL } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { Upload } from '@aws-sdk/lib-storage';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Injectable()
export class AwsService {
  private readonly s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadImage(image: Express.Multer.File): Promise<string> {
    try {
      const key = `${Date.now()}-${image.originalname}`;
      const upload = new Upload({
        client: this.s3,
        params: {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          Body: Readable.from(image.buffer),
          ContentType: image.mimetype,
          ACL: 'public-read' as ObjectCannedACL,
        },
      });

      await upload.done();
      return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
    } catch (error) {
      console.error('Error uploading image:', error.message);
      throw error;
    }
  }
}
