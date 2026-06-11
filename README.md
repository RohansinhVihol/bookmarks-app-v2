# Bookmarks App

A personal bookmark manager with public profiles. Save your favourite links, mark them public or private, and share your profile with anyone via a unique `@handle`.

**Live:** https://bookmarks-app-v2-384t.vercel.app/ · **Repo:** https://github.com/RohansinhVihol/bookmarks-app-v2

---

## What it does

- **Accounts** — sign up and log in with email + password. A welcome email is sent on registration. Resend is used by default; Gmail SMTP is available as a fallback for when Resend's free tier limits are reached.
- **Bookmarks** — add, edit, and delete your own bookmarks. Each bookmark has a title, URL, and a public / private toggle.
- **Privacy** — every bookmark is locked to its owner at the database level using Supabase Row Level Security. Direct API calls from other users return nothing.
- **Public profile** — each user claims a unique `@handle` at signup. Anyone can visit `/@handle` and see that user's public bookmarks — no login needed.
- **Dashboard** — logged-in users land on their personal dashboard. Unauthenticated visitors are redirected to `/login` by middleware.

---

## Tech stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Auth + DB | Supabase (Postgres + RLS) |
| Email | Resend (primary) · Gmail SMTP (fallback) |
| Deployment | Vercel |
| Session recording | Entire CLI |

---

## Running locally

**1. Clone the repo**
```bash
git clone https://github.com/yourusername/bookmarks-app.git
cd bookmarks-app
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Copy the example file and fill in your keys:
```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Resend (primary email)
RESEND_API_KEY=re_...

# Gmail SMTP (fallback — see Email configuration below)
SMTP_USER=yourgmail@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
```

Where to get each key:
- **Supabase keys** → [supabase.com](https://supabase.com) → your project → Settings → API
- **Resend key** → [resend.com](https://resend.com) → API Keys → Create API Key
- **Gmail App Password** → Google Account → Security → 2-Step Verification → App Passwords → Generate

**4. Run the database schema**

In your Supabase project → SQL Editor → paste and run the contents of `supabase/schema.sql`.

**5. Start the dev server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
bookmarks-app/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Home / landing
│   │   ├── login/page.tsx            # Login
│   │   ├── signup/page.tsx           # Sign up
│   │   ├── auth/actions.ts           # Auth server actions
│   │   ├── dashboard/
│   │   │   ├── layout.tsx            # Protected layout
│   │   │   ├── page.tsx              # Bookmark dashboard
│   │   │   └── actions.ts            # CRUD server actions
│   │   └── @[handle]/page.tsx        # Public profile page
│   ├── components/
│   │   ├── AddBookmarkForm.tsx
│   │   ├── BookmarkList.tsx
│   │   └── BookmarkCard.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser client
│   │   │   ├── server.ts             # Server component client
│   │   │   └── admin.ts              # Service role client (server only)
│   │   ├── email.ts                  # Resend welcome email
│   │   ├── email-smtp.ts             # Gmail SMTP fallback
│   │   └── types.ts
│   └── middleware.ts                 # Route protection
├── supabase/
│   └── schema.sql                    # Full DB schema + RLS policies
├── .env.example
└── README.md
```

---

## Email configuration

The app has two email helpers in `src/lib/`:

**`email.ts`** — uses Resend. Default for production.

**`email-smtp.ts`** — uses Gmail SMTP via `SMTP_USER` + `SMTP_PASS`. Switch to this during development or when Resend's free tier is limiting you.

> Resend's free tier only delivers to the email address used to register the Resend account — not to arbitrary users. Until you verify a custom domain on Resend, use the Gmail SMTP fallback for real user testing.

To generate a Gmail App Password: Google Account → Security → 2-Step Verification → App Passwords → select "Mail" → Generate. Your regular Gmail password will not work.

---

## Where the AI agent got something wrong

**1. RLS enabled but never activated** — The agent wrote RLS policies but forgot `alter table ... enable row level security`, so they were silently ignored. Caught by testing a second account via direct API call — it returned another user's bookmarks. Fixed by adding the enable statements to the schema.

**2. Admin client misused** — The agent used `createAdminClient()` inside the public profile server component and passed it into a client component. Refactored to keep all admin calls server-side and pass only serialised data to the UI.

**3. Resend free tier not accounted for** — The agent used Resend as the sole email provider without knowing it can't deliver to arbitrary users on the free tier. Discovered this when sign-up emails silently failed for test accounts. Added `email-smtp.ts` as a Gmail SMTP fallback using `SMTP_USER` and `SMTP_PASS`.

---

## What I'd improve with more time

- **Drag-and-drop reordering** — let users sort bookmarks manually with a position column in the DB.
- **Tags / collections** — group bookmarks into named folders.
- **Rate limiting on signup** — Upstash Redis-backed rate limiting on the signup endpoint.
- **Verified custom domain on Resend** — removes the free tier sending restriction so Resend can be used end-to-end in production.

---

## Deployment

The app is deployed on Vercel with all environment variables set in the project dashboard. The `NEXT_PUBLIC_SITE_URL` is set to the production Vercel URL so welcome email links point to the right place.

To deploy your own copy:
```bash
vercel
```

Then add the same environment variables in the Vercel dashboard under **Settings → Environment Variables**.

---

## Security notes

- RLS is enabled on both `bookmarks` and `profiles` tables — no user can read, edit, or delete another user's data even via direct API calls.
- The service role key is only used server-side in `src/lib/supabase/admin.ts` and never exposed to the browser.
- Route protection is handled both in `middleware.ts` (redirect before render) and in each server layout (double-check on the server).
- Handles are validated with a regex (`^[a-z0-9_]{3,20}$`) and uniqueness is enforced by a `unique` constraint at the DB level — not just a UI check.