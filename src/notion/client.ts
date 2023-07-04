import { Client } from "@notionhq/client";

export const databaseId = process.env.NOTION_DATABASE_ID;
export const notionClient = new Client({ auth: process.env.NOTION_API_KEY });
