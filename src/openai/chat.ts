import { openaiClient } from "./client";

type Props = {
  promptContent: string;
};

export const produceContentText = async ({ promptContent }: Props) => {
  try {
    const chatCompletion = await openaiClient.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: promptContent }],
    });
    return chatCompletion.data.choices[0].message?.content;
  } catch (err) {
    console.error(
      "Could not retrieve generated response from openai. Error: " + err
    );
  }
};
