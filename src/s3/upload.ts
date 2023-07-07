import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./client";
import { jobConfig } from "../job.config";
const { S3_BASE_URL, S3_BUCKET_NAME } = jobConfig;

type Props = {
  fileName: string;
  body: string | Buffer;
};

export const uploadImage = async ({ fileName, body }: Props) => {
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: fileName,
    Body: body,
  });

  const response = await s3Client.send(command);
  if (
    response.$metadata.httpStatusCode &&
    response.$metadata.httpStatusCode >= 300
  ) {
    throw Error(`Job failure: Something went wrong with s3 upload`);
  }
  const imageUrl = S3_BASE_URL + fileName;
  return imageUrl;
};
