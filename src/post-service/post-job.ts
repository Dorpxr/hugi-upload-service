import "dotenv/config";
import { signIn } from "../supabase/auth";
import { getNextInQueue, updateQueueStatus } from "../supabase/queue";
import { produceContentText } from "../openai/chat";
import { downloadImage, produceImage } from "../openai/image";
import { uploadImage } from "../s3/upload";
import { addNewNotionPage } from "../notion/post";

const postJob = async () => {
  await signIn();
  const nextPrompt = await getNextInQueue();
  if (!nextPrompt?.data) {
    throw Error("Job failure getting new prompt");
  }
  const pageContent = await produceContentText({
    promptContent: nextPrompt?.data[0]?.chat_prompt,
  });
  if (!pageContent) {
    throw Error("Job failure getting page content");
  }
  const title = await produceContentText({
    promptContent: `Can you create a 30 or less character title for these paragraphs with no special characters? Here are the paragraphs: ${pageContent}`,
  });
  if (!title) {
    throw Error("Job failure getting title for page");
  }
  const summary = await produceContentText({
    promptContent: `Can you create a 100 or less character summary for these paragraphs? Here are the paragraphs: ${pageContent}`,
  });
  if (!summary) {
    throw Error("Job failure getting summary for page");
  }
  const image = await produceImage({
    promptContent: nextPrompt?.data[0]?.image_prompt,
  });
  if (!image) {
    throw Error(`image is undefined`);
  }
  const imageBuffer = await downloadImage({
    url: image,
  });
  if (!imageBuffer) {
    throw Error(`imageBuffer is undefined`);
  }
  const imageUploadResult = await uploadImage({
    fileName: `${title
      .trim()
      .toLowerCase()
      .replaceAll(":", "")
      .replaceAll(",", "")
      .replaceAll(" ", "-")}.png`,
    body: imageBuffer,
  });
  if (!imageUploadResult || !imageUploadResult?.imageUrl) {
    throw Error(`uploaded image source not found`);
  }

  await addNewNotionPage({
    featureUrl: imageUploadResult.imageUrl,
    summary: summary,
    title: title,
    content: pageContent.split("\n"),
  });

  await updateQueueStatus({
    id: nextPrompt.data[0].id,
    status: 1,
  });
};

postJob();
