# ProPilotLicense — DGCA CPL Exam Prep

A proof-of-concept pilot exam prep platform. Students browse subjects, configure and take practice/mock sessions. Admins manage questions and generate new ones via Claude AI.

## Stack

- **Next.js 14** (App Router)
- **Supabase** (Postgres, no auth, no RLS)
- **Anthropic Claude API** (`claude-sonnet-4-20250514`)
- **Tailwind CSS**
- **Tabler Icons**

## Setup

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) → New project. Note your project URL and keys.

### 2. Run the schema

In the Supabase SQL editor, paste and run the contents of `scripts/schema.sql`.

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=sk-ant-...
```

### 4. Seed the database

```bash
npm run seed
```

This populates 8 subjects, all topics, source books, and 5 sample questions per subject (40 total).

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — student view.  
Open [http://localhost:3000/admin](http://localhost:3000/admin) — admin view.

## App Structure

```
/                           Student: subject grid
/subject/[id]               Student: session configuration
/session/[id]               Student: active practice or mock exam
/results/[id]               Student: score + review

/admin                      Admin: question bank
/admin/questions/new        Admin: create question
/admin/questions/[id]/edit  Admin: edit question
/admin/generate             Admin: AI question generator
```

## Deploy to Vercel

```bash
vercel --prod
```

Set the four environment variables in Vercel project settings before deploying.

## Design

- Primary colour: `#185FA5`
- Pass: ≥70% (green), Fail: <70% (red)
- No auth, no login, no registration
- Student session state in `localStorage`
- Mobile-first, 375px minimum width

