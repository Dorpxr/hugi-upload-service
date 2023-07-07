import { supabaseClient } from "./client";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { jobConfig } from "../job.config";
const { TABLE_NAME } = jobConfig;

interface Queue {
  id: number;
  created_at: string;
  chat_prompt: string;
  image_prompt: string;
  status: 0 | 1;
}

type AddToQueueProps = {
  chatPrompt: string;
  imagePrompt: string;
};

export const addToQueue = async ({
  chatPrompt,
  imagePrompt,
}: AddToQueueProps) => {
  try {
    const result = await supabaseClient.from(TABLE_NAME).insert({
      chat_prompt: chatPrompt,
      image_prompt: imagePrompt,
    });
    return result;
  } catch (err) {
    console.error(`Could not insert item into queue table. Error: ${err}`);
  }
};

export const getNextInQueue = async () => {
  const result: PostgrestSingleResponse<Queue[]> = await supabaseClient
    .from(TABLE_NAME)
    .select()
    .eq("status", 0)
    .order("created_at", { ascending: true })
    .limit(1);

  if (!result) {
    throw Error("Job failure: Could not retrieve new job");
  }

  if (!result?.data) {
    throw Error("Job failure: Could not retrieve new job");
  }
  if (result.data.length === 0) {
    throw Error("Job failure: No pending jobs in the queue");
  }
  if (!result?.data[0]?.chat_prompt) {
    throw Error("Job failure: Retrieved job has no chap_prompt");
  }
  return result;
};

type UpdateQueueStatusProps = {
  id: Queue["id"];
  status: Queue["status"];
};

export const updateQueueStatus = async ({
  id,
  status,
}: UpdateQueueStatusProps) => {
  const result = await supabaseClient
    .from(TABLE_NAME)
    .update({ status })
    .eq("id", id);
  if (result.error) {
    throw Error(result.error.message);
  }
  return result;
};
