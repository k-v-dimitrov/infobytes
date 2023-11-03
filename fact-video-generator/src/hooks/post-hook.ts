import AWS from 'aws-sdk';
import fs from 'fs';

import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import dotenv from 'dotenv';
dotenv.config();

const {
  AWS_S3_ACCESS_KEY,
  AWS_S3_SECRET_ACCESS_KEY,
  AWS_S3_REGION,
  AWS_S3_BUCKET_NAME,
} = process.env;

AWS.config.update({
  accessKeyId: AWS_S3_ACCESS_KEY,
  secretAccessKey: AWS_S3_SECRET_ACCESS_KEY,
  region: AWS_S3_REGION,
});

const { videoPath, factId } = yargs(hideBin(process.argv)).argv as unknown as {
  videoPath: string;
  factId: string;
};
// Specify the S3 bucket and file information
const bucketName = AWS_S3_BUCKET_NAME;
// The name you want to give to the file in S3
const fileName = `fact-video/${factId}.mp4`;

// Read the file from your local filesystem
const fileContent = fs.readFileSync(videoPath);

// Define S3 parameters for the upload
const params: AWS.S3.PutObjectRequest = {
  Bucket: bucketName,
  Key: fileName, // The name you want to give to the file in S3
  Body: fileContent,
};

const s3 = new AWS.S3();
// Upload the file to the S3 bucket
s3.upload(params, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
  if (err) {
    console.error('Error uploading file:', err);
  } else {
    console.log('File uploaded successfully. S3 URL:', data.Location);
  }
});
