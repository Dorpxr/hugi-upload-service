import axios from "axios";

type Props = {
  notionPageUrl: string;
  pageFeatureImage: string;
  pageTitle: string;
  pageSummary: string;
};

export const sendJobUpdate = async ({
  notionPageUrl,
  pageFeatureImage,
  pageTitle,
  pageSummary,
}: Props) => {
  const discordUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!discordUrl) {
    throw Error("Must have discord webhook url environment variable set.");
  }
  return axios.post(discordUrl, {
    content: `New generated post uploaded to notion! Please review page properties, make any adjustments, and change the status of the post to DONE when you are finished to publish this live.`,
    embeds: [
      {
        title: pageTitle,
        url: notionPageUrl,
        description: pageSummary,
        image: {
          url: pageFeatureImage,
        },
      },
    ],
  });
};
