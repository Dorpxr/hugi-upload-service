# hugi-upload-service

Service to generate text and image content for the [hugi app](https://github.com/Dorpxr/hugi).

You can fork / clone your own and add your own environment variable secrets. See the **.env.example** file.

## Features

- [Supabase](https://supabase.com/) to store job queue.
- [Openai](https://platform.openai.com/docs/introduction) to generate content.
- [AWS S3](https://aws.amazon.com/s3/) to store images.
- [Notion databases](https://www.notion.so/) to store content for application.
- [Discord](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks) webhooks to report job completions.
