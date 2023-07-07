# hugi-upload-service

Service to generate text and image content for the [hugi app](https://github.com/Dorpxr/hugi).

## Features

- [Supabase](https://supabase.com/) to store job queue.
- [Openai](https://platform.openai.com/docs/introduction) to generate content.
- [AWS S3](https://aws.amazon.com/s3/) to store images.
- [Notion databases](https://www.notion.so/) to store content for application.
- [Discord](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks) webhooks to report job completions.

## Configuration

### Secrets

You can fork / clone your own and add your own environment variable secrets. See the **.env.example** file.

You will need to [add your own secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) in your Github repository settings that match all of the **.env.example** file.

### Job Config File

There are also job configuration variables that you can adjust based on your needs in [job.config.ts](/src//job.config.ts), such as the GPT model, S3 bucket location, etc.

### Job Schedule

This project uses a [schedule](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule) event using cron. You can adjust the schedule in the [job.yml](.github/workflows//job.yml) configuration file for the action.
