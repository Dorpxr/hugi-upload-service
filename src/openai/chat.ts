import { openaiClient } from "./client";
import { jobConfig } from "../job.config";

export const produceContentText = async (promptContent: string) => {
  const chatCompletion = await openaiClient.createChatCompletion({
    model: jobConfig.CHAT_MODEL,
    messages: [{ role: "user", content: promptContent }],
  });
  const content = chatCompletion?.data.choices[0]?.message?.content;
  if (!content) {
    throw Error("Job failure: Did not get valid text content from the model");
  }
  return content;
};
