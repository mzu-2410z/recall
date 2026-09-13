# Recall — Meeting Intelligence Platform

Recall is a Fathom AI-inspired meeting intelligence application designed to capture, transcribe, summarize, and search across meetings automatically. Built with Next.js 15, Supabase, Groq AI (Whisper & Llama 3.3 70B), and Tailwind CSS.

---

## 🌟 Key Features

1. **Dual Meeting Capture Engine**:
   - **Google Meet API Integration**: Direct REST API v2 sync for Google Workspace enterprise meetings (creates space, polls conference records and native transcript entries).
   - **Browser-Native Meeting Recorder**: Zero-extension screen/tab & microphone recorder using `getDisplayMedia` and `MediaRecorder` API for personal Gmail accounts or ad-hoc meetings.
2. **AI Processing Pipeline**:
   - **Groq Whisper v3 Large**: Fast, cost-efficient speech-to-text transcription with automatic timestamp alignment and speaker segment identification.
   - **Llama 3.3 70B Synthesis**: Generates executive summaries, key discussion points, decision lists, and assigned action items.
   - **Custom Summary Templates**: Select from pre-built templates (Sales BANT, 1-on-1, Tech Arch, Executive Board) or define custom extraction prompts.
3. **Interactive Media Player & Synced Transcript**:
   - Audio/video playback with interactive transcript.
   - Click any transcript segment or highlight to seek directly to the exact video/audio timestamp.
   - Filter transcript by speaker or search terms.
4. **Action Items Checklist**:
   - Interactive checkbox tracking with inline state persistence.
5. **Ask Recall (RAG & Enterprise Q&A)**:
   - Search across all past meetings with natural language questions.
   - Returns AI synthesized answers with clickable source citations and timestamps.
6. **YouTube Video Importer**:
   - Import public YouTube product videos, webinars, or talks directly into the meeting intelligence memory bank.
7. **Clip Creator & Sharing**:
   - Extract transcript snippets or video ranges into public shareable links.

---

## 🏗️ Architecture Overview

```
                          ┌───────────────────────────┐
                          │   Next.js 15 App Router   │
                          └─────────────┬─────────────┘
                                        │
             ┌──────────────────────────┼──────────────────────────┐
             │                          │                          │
  ┌──────────▼──────────┐    ┌──────────▼──────────┐    ┌──────────▼──────────┐
  │ Google Calendar/Meet│    │ Browser MediaRecorder│    │   YouTube Importer  │
  └──────────┬──────────┘    └──────────┬──────────┘    └──────────┬──────────┘
             │                          │                          │
             └──────────────────────────┼──────────────────────────┘
                                        │
                               ┌────────▼────────┐
                               │ Supabase Storage│
                               └────────┬────────┘
                                        │
                               ┌────────▼────────┐
                               │ Groq Whisper v3 │
                               └────────┬────────┘
                                        │
                               ┌────────▼────────┐
                               │ Groq Llama 3.3  │
                               └────────┬────────┘
                                        │
                         ┌──────────────▼──────────────┐
                         │ Supabase PostgreSQL DB + RLS│
                         └─────────────────────────────┘
```

---

## 🛠️ Environment Variables Setup

Copy `.env.example` to `.env.local` and populate the credentials:

```bash
cp .env.example .env.local
```

### Required Variables:

```ini
# Next.js Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google OAuth Credentials (for Calendar & Meet APIs)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Groq AI Key (for Whisper & Llama)
GROQ_API_KEY=gsk_your_groq_api_key
```

---

## 🗄️ Database Setup & Migrations

Recall uses Supabase PostgreSQL with Row Level Security (RLS) enabled on all tables.

Run migrations in numerical order:

```bash
# 1. Base Tables & Schema
psql -f supabase/migrations/001_initial_schema.sql

# 2. Row Level Security Policies
psql -f supabase/migrations/002_rls_policies.sql

# 3. Full-Text Search Indexes & Functions
psql -f supabase/migrations/003_search_indexes.sql

# 4. Realistic 8-Person 1-Hour Meeting Seed Data
psql -f supabase/seed.sql
```

---

## 💡 Google Meet API vs Browser Recording Fallback

> **Important Note on Google Meet API Limitations:**
> The Google Meet REST API v2 (`spaces.create`, `conferenceRecords`, `transcripts.entries`) allows programmatic space creation and transcript retrieval, **ONLY for Google Workspace enterprise/education accounts** where admin recording is enabled.
> Consumer Gmail accounts (`@gmail.com`) cannot access native Meet transcript artifacts via API.
> 
> **Recall's Dual Architecture**:
> 1. Workspace Accounts: Automatically queries Google Meet REST API v2 post-meeting.
> 2. Personal Gmail Accounts: Seamlessly uses Recall's built-in **Browser Meeting Recorder** (`app/(app)/record`), capturing tab/screen video and audio streams directly. Both paths feed into the exact same AI pipeline.

---

## 🔒 Security Hardening

- **Row Level Security (RLS)**: Users can only view, edit, or delete their own meetings, transcripts, and action items.
- **IDOR Protection**: All API routes strictly verify ownership against `auth.uid()` before returning data or creating signed URLs.
- **Private Storage**: Audio/video blobs stored in Supabase Storage are private. Playback URLs are served exclusively via 1-hour short-lived signed URLs generated via `/api/recordings/[meetingId]/url`.
- **Zod Validation & Sanitization**: All incoming API payloads (meeting titles, notes, queries) are parsed and validated via Zod schemas.
- **In-Memory Rate Limiting**: Sensitive endpoints (auth callback, AI summarization, transcription) use token bucket rate limiting to prevent DDoS or API quota abuse.

---

## 🚀 Local Development & Deployment

### 1. Install Dependencies & Start Server
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Vercel Production Deployment
Deploy directly via Vercel CLI or GitHub integration:
```bash
vercel --prod
```
Ensure all environment variables from `.env.example` are added in the Vercel Dashboard project settings.

---

## 📄 License

MIT License — Created for the 8x Software Engineer Practical Assessment.
