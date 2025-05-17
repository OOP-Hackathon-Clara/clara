# Clara Chat App

A modern chat application with AI integration built with Next.js.

## Features

- Real-time messaging interface
- Facebook Messenger-like UI
- OpenAI GPT integration for AI chat
- Server-side rendering for improved performance

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

### Setting up OpenAI API Key

To use the AI chat feature, you need to set up your OpenAI API key:

1. Create a `.env.local` file in the root directory
2. Add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
3. Restart the server if it's already running

You can get an API key from the [OpenAI Platform](https://platform.openai.com/api-keys).

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app` - Main application code using Next.js App Router
- `src/components` - React components
  - `chat/` - Chat interface components
  - `ai/` - AI chat components
- `src/app/api` - API routes
  - `openai/` - OpenAI integration API

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
