import axios from "axios";

type Props = {
  linkUrl: string;
  image: string;
  title: string;
  summary?: string;
};

export const sendJobUpdate = async ({
  linkUrl,
  image,
  title,
  summary,
}: Props) => {
  const discordUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!discordUrl) {
    throw Error("Must have discord webhook url environment variable set.");
  }
  return axios.post(discordUrl, {
    content: `New generated post uploaded to notion! Please review page properties, make any adjustments, and change the status of the post to DONE when you are finished to publish this live.`,
    embeds: [
      {
        title: title,
        url: linkUrl,
        description: summary || null,
        image: {
          url: image,
        },
      },
    ],
  });
};
