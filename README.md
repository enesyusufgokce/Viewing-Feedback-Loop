# Viewing Feedback Loop

AI-assisted post-viewing feedback workflow for UK estate agents (demo application).

**Live demo:** [https://viewing-feedback-loop.vercel.app](https://viewing-feedback-loop.vercel.app)

## What this is

This project is a front-end demo built for a job application. It shows how an estate agent can draft personalised WhatsApp follow-ups after property viewings, process buyer replies into structured feedback, and generate weekly vendor care reports.

The data is mocked (no database or authentication). The UI is designed to walk through a realistic day-in-the-life flow for a single property and three buyers.

## Tech stack

- Next.js 14 (App Router)
- TypeScript
- React 18
- Tailwind CSS
- shadcn/ui (Radix primitives)
- Google Gemini API (`gemini-2.5-flash`) via `@google/generative-ai`

## Run locally

```bash
git clone https://github.com/enesyusufgokce/Viewing-Feedback-Loop.git
cd Viewing-Feedback-Loop
npm install
```

Copy the environment template and add your API key:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
GEMINI_API_KEY=your_key_here
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Restart the dev server after changing `.env.local`.

## API key

You need your own [Google AI Gemini API key](https://aistudio.google.com/apikey). Set it in `.env.local` as `GEMINI_API_KEY`. Do not commit `.env.local` (it is gitignored).

For Vercel deployment, add `GEMINI_API_KEY` in the project environment variables.

## Mock fallback

If `GEMINI_API_KEY` is missing or a Gemini request fails, the app falls back silently to pre-written responses in `lib/mockAIResponses.ts`. The demo remains usable without a key or when offline.

## Project structure

```
app/                 # Pages and API routes (generate-message, extract-feedback, generate-report)
components/          # UI (viewing cards, drawer, conversation, vendor report)
lib/
  ai/                # Client fetch helpers with fallback
  gemini/            # Server-side Gemini configuration
  mockData.ts        # Demo buyers, property, viewings
  mockAIResponses.ts # Fallback copy and extraction variants
  types.ts           # Shared TypeScript types
```

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Development server       |
| `npm run build`| Production build         |
| `npm run start`| Run production build     |
| `npm run lint` | ESLint                   |

## License

Demo build for portfolio and application purposes.
