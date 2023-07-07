import "dotenv/config";
import { signIn } from "../supabase/auth";
import { getNextInQueue, updateQueueStatus } from "../supabase/queue";
import { produceContentText } from "../openai/chat";
import { downloadImage, formatFileName, produceImage } from "../openai/image";
import { uploadImage } from "../s3/upload";
import { addNewNotionPage } from "../notion/post";
import { sendJobUpdate } from "../discord/job-update";
import { jobConfig } from "../job.config";
const { NOTION_DATABASE_URL, JOB_FAILURE_IMAGE } = jobConfig;

const runJob = async () => {
  try {
    await signIn();
    const jobContext = await getNextInQueue();
    const pageContent = await produceContentText(
      jobContext.data[0].chat_prompt
    );
    const title = await produceContentText(
      `Can you create a 30 or less character title for these paragraphs with no special characters? Here are the paragraphs: ${pageContent}`
    );
    const summary = await produceContentText(
      `Can you create a 100 or less character summary for these paragraphs? Here are the paragraphs: ${pageContent}`
    );
    const image = await produceImage(jobContext.data[0].image_prompt);
    const imageBuffer = await downloadImage(image);
    const imageUploadResult = await uploadImage({
      fileName: formatFileName(title),
      body: imageBuffer,
    });
    await addNewNotionPage({
      featureUrl: imageUploadResult,
      summary: summary,
      title: title,
      content: pageContent.split("\n"),
    });

    await updateQueueStatus({
      id: jobContext.data[0].id,
      status: 1,
    });

    await sendJobUpdate({
      image: imageUploadResult,
      linkUrl: NOTION_DATABASE_URL,
      summary: summary,
      title: title,
    });
  } catch (err) {
    // All job errors thrown should bubble to here
    await sendJobUpdate({
      image: JOB_FAILURE_IMAGE,
      linkUrl: NOTION_DATABASE_URL,
      title: "Job Failure",
    });
    console.error(err);
  }
};

runJob();
