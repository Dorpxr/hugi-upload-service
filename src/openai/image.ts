import { openaiClient } from "./client";
import { writeFileSync } from "fs";
import axios from "axios";

export const produceImage = async (prompt: string) => {
  const imageResult = await openaiClient.createImage({
    prompt: prompt,
    size: "1024x1024",
  });
  if (process.env.DEBUG) {
    writeFileSync(
      "mocks/imageResponse.json",
      JSON.stringify(imageResult.data, null, 2)
    );
  }
  const imageUrl = imageResult?.data?.data[0]?.url;
  if (!imageUrl) {
    throw Error("Job failure: Did not get valid image from the model");
  }
  return imageUrl;
};

export const formatFileName = (input: string) => {
  const formatted = `${input
    .trim()
    .toLowerCase()
    .replaceAll(" ", "-")
    .replace(/[^a-zA-Z0-9 -]/g, "")}.png`;
  return formatted;
};

export const downloadImage = async (url: string) => {
  const res = await axios.get(url, {
    responseType: "arraybuffer",
  });
  if (!res.data) {
    throw Error("Job failure: Issue downloading image");
  }
  const buffer = Buffer.from(res.data, "base64");
  return buffer;
};
