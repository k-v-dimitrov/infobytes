import AWS from 'aws-sdk';
import fs from 'fs';

// import yargs from 'yargs/yargs';
// import { hideBin } from 'yargs/helpers';

import dotenv from 'dotenv';
dotenv.config();

// const { id: factId } = yargs(hideBin(process.argv)).argv as unknown as {
//   id: string;
// };

const factId = `b35037a-1f4c-4849-80d6-477001b811b9`;

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

// Specify the S3 bucket and file information
const bucketName = AWS_S3_BUCKET_NAME;
const fileName = `fact-video/${factId}.mp4`; // The name you want to give to the file in S3
// TODO: properly set the file path
const filePath = `/home/kiril/workspace/infobytes/fact-video-generator/generated-videos/4b35037a-1f4c-4849-80d6-477001b811b9.mp4`;

// Read the file from your local filesystem
const fileContent = fs.readFileSync(filePath);

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
