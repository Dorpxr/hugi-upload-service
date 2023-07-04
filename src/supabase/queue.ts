import { supabaseClient } from "./client";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

interface Queue {
  id: number;
  created_at: string;
  chat_prompt: string;
  image_prompt: string;
  status: 0 | 1;
}

const TABLE_NAME = "prompt-queue";

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
  try {
    const result: PostgrestSingleResponse<Queue[]> = await supabaseClient
      .from(TABLE_NAME)
      .select()
      .eq("status", 0)
      .order("created_at", { ascending: true })
      .limit(1);
    return result;
  } catch (err) {
    console.error(
      `Could not retrieve next queued item in the table. Error: ${err}`
    );
  }
};

type UpdateQueueStatusProps = {
  id: Queue["id"];
  status: Queue["status"];
};

export const updateQueueStatus = async ({
  id,
  status,
}: UpdateQueueStatusProps) => {
  try {
    const result = await supabaseClient
      .from(TABLE_NAME)
      .update({ status })
      .eq("id", id);
    if (result.error) {
      throw Error(result.error.message);
    }
    return result;
  } catch (err) {
    console.error(`Could not update item status. Error: ${err}`);
  }
};
