import { supabaseClient } from "./client";
import { jobConfig } from "../job.config";
const { BUCKET_NAME } = jobConfig;

type Props = {
  fileName: string;
  body: string | Buffer;
};

export const uploadImage = async ({ fileName, body }: Props) => {
  const { data, error } = await supabaseClient.storage
    .from(BUCKET_NAME)
    .upload(fileName, body);
  if (error) {
    throw Error(
      `Job failure: Something went wrong with supabase storage upload`
    );
  }
  return data;
};
