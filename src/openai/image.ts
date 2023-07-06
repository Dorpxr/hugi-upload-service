import { openaiClient } from "./client";
import { writeFileSync } from "fs";
import axios from "axios";

type ProduceImageProps = {
  promptContent: string;
};

export const produceImage = async ({ promptContent }: ProduceImageProps) => {
  try {
    const imageResult = await openaiClient.createImage({
      prompt: promptContent,
      size: "1024x1024",
    });
    if (process.env.DEBUG) {
      writeFileSync(
        "mocks/imageResponse.json",
        JSON.stringify(imageResult.data, null, 2)
      );
    }
    return imageResult.data.data[0].url;
  } catch (err) {
    console.error(
      `Could not retrieve image response from openai. Error: ${err}`
    );
  }
};

export const formatFileName = (input: string) => {
  const formatted = `${input
    .trim()
    .toLowerCase()
    .replaceAll(" ", "-")
    .replace(/[^a-zA-Z0-9 -]/g, "")}.png`;
  return formatted;
};

type DownloadImageProps = {
  url: string;
};

export const downloadImage = async ({ url }: DownloadImageProps) => {
  try {
    const res = await axios.get(url, {
      responseType: "arraybuffer",
    });
    const buffer = Buffer.from(res.data, "base64");
    return buffer;
  } catch (err) {
    console.error(`Failed to download image. Error: ${err}`);
  }
};
