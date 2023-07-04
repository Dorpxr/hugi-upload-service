import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./client";

const BASE_URL = "https://hugi-images.s3.amazonaws.com/";
const BUCKET = "hugi-images";

type Props = {
  fileName: string;
  body: string | Buffer;
};

export const uploadImage = async ({ fileName, body }: Props) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: fileName,
    Body: body,
  });

  try {
    const response = await s3Client.send(command);
    if (
      response.$metadata.httpStatusCode &&
      response.$metadata.httpStatusCode >= 300
    ) {
      throw Error(`Something went wrong with s3 upload`);
    }
    return {
      imageUrl: BASE_URL + fileName,
    };
  } catch (err) {
    console.error(`Failed to upload image to s3 bucket. Error: ${err}`);
  }
};
