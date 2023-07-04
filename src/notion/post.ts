import { databaseId, notionClient } from "./client";

type PageProps = {
  featureUrl: string;
  summary: string;
  title: string;
  content: string[];
};

export const addNewNotionPage = async (context: PageProps) => {
  try {
    const { properties, children } = page(context);
    const result = notionClient.pages.create({
      parent: {
        database_id: databaseId || "id",
      },
      properties,
      // @ts-ignore WTF
      children,
    });
    console.log(result);
  } catch (err) {
    console.error(`Could not add new page to notion. Error: ${err}`);
  }
};

const page = ({ featureUrl, summary, title, content }: PageProps) => {
  return {
    properties: {
      FeatureImageUrl: { url: featureUrl },
      Summary: {
        rich_text: [
          {
            text: {
              content: summary,
            },
          },
        ],
      },
      Story: {
        title: [
          {
            text: {
              content: title,
            },
          },
        ],
      },
    },
    children: content.map((paragraph) => ({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content: paragraph,
            },
          },
        ],
      },
    })),
  };
};
