import "dotenv/config";
import inquirer from "inquirer";
import { addToQueue } from "../supabase/queue";
import { signIn } from "../supabase/auth";

const newJob = async () => {
  const answers = await inquirer.prompt([
    { name: "chatPrompt", message: "Chat text prompt:" },
    { name: "imagePrompt", message: "Image prompt:" },
  ]);

  await signIn();
  const result = await addToQueue(answers);
  if (result?.error) {
    throw Error(result?.error.message);
  }
  if (result?.status === 200) {
    console.log(`Successfully added prompt to the queue!`);
  }
};

newJob();
