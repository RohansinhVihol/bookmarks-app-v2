# 🔖 Bookmarks App

A modern Full-Stack personal bookmark manager with public profiles. Save your favourite links, mark them public or private, and share your collection with anyone via a unique `@handle`.

---

![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

Production-ready bookmarks platform featurin Row Level Security, dual email provider support (Resend + Gmail SMTP), and public profile pages — deployed on Vercel.

---

## 🌐 Live Project Links

🚀 **Live App**
https://your-app.vercel.app

🐙 **GitHub Repo**
https://github.com/yourusername/bookmarks-app

---

## 📌 Project Overview

**Users can:**
- Sign up and log in with email + password
- Receive a welcome email on registration
- Add, edit, and delete their own bookmarks
- Toggle bookmarks between public and private
- Claim a unique `@handle` for their public profile

**Anyone (no login) can:**
- Visit `/@handle` and see that user's public bookmarks

---

## 🚀 Features

### 👤 User Features
- Supabase JWT Authentication
- Welcome email on sign-up (Resend / Gmail SMTP)
- Add, edit, delete bookmarks
- Public / private toggle per bookmark
- Unique `@handle` public profile page
- Protected dashboard (server-side + middleware)

### 🔐 Security Features
- Row Level Security (RLS) on all tables — enforced at the database level
- Service role key used server-side only — never exposed to the browser
- Route protection via Next.js middleware + server layout double-check
- Handle uniqueness enforced by DB `unique` constraint, not just UI

---

## 🧑‍💻 Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS

**Backend / Database:**
- Supabase (Postgres + Row Level Security)
- Supabase Auth (JWT)
- Next.js Server Actions

**Email:**
- Resend (primary)
- Gmail SMTP (fallback via `SMTP_USER` + `SMTP_PASS`)

**Deployment:**
- Vercel (frontend + serverless API)
- Entire CLI (AI session recording)

---

## 📁 Folder Structure

```
bookmarks-app/
│
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
│
├── supabase/
│   └── schema.sql                    # Full DB schema + RLS policies
├── .env.example
└── README.md
```

---

## 🧱 Application Architecture

```
User / Browser
      ↓
Next.js App Router (Vercel)
      ↓
Middleware (Route Protection)
      ↓
Server Actions / Server Components
      ↓
Supabase Auth (JWT)
      ↓
Supabase Postgres + Row Level Security
      ↓
Resend / Gmail SMTP (Welcome Email)
```

---

## 🔗 API / Server Action Routes

### Auth Actions (`/app/auth/actions.ts`)
```
signUp()      →  Create account + profile + send welcome email
signIn()      →  Login with email + password
signOut()     →  Clear session and redirect
```

### Bookmark Actions (`/app/dashboard/actions.ts`)
```
addBookmark()     →  POST  /dashboard  (create)
updateBookmark()  →  POST  /dashboard  (update by id)
deleteBookmark()  →  POST  /dashboard  (delete by id)
```

### Public Profile
```
GET /@[handle]   →  Public page — shows only is_public = true bookmarks
```

---

## 🔐 Environment Variables

### Supabase
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### App
```env
NEXT_PUBLIC_SITE_URL=
```

### Email — Resend (primary)
```env
RESEND_API_KEY=
```

### Email — Gmail SMTP (fallback)
```env
SMTP_USER=
SMTP_PASS=
```

---

## 📧 Email Configuration

The app has two email helpers in `src/lib/`:

**`email.ts`** — uses Resend. Default for production.

**`email-smtp.ts`** — uses Gmail SMTP via `SMTP_USER` + `SMTP_PASS`. Use this during development or when Resend's free tier is limiting you.

> ⚠️ Resend's free tier only delivers to the email address used to register the Resend account — not to arbitrary users. Until you verify a custom domain on Resend, use the Gmail SMTP fallback for real user testing.

To generate a Gmail App Password:
Google Account → Security → 2-Step Verification → App Passwords → Select "Mail" → Generate.
Your regular Gmail password will **not** work.

---

## ▶️ Run Project Locally

### Clone Repository

```bash
git clone https://github.com/yourusername/bookmarks-app.git
cd bookmarks-app
```

### Install Dependencies

```bash
npm install
```

### Set Up Environment Variables

```bash
cp .env.example .env.local
```

Fill in your keys (see Environment Variables section above).

### Run Database Schema

In your Supabase project → SQL Editor → paste and run `supabase/schema.sql`.

### Start Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🤖 Where the AI Agent Got Something Wrong

**1. RLS enabled but never activated**
The agent wrote RLS policies but forgot `alter table ... enable row level security`, so they were silently ignored. Caught by testing a second account via direct API call — it returned another user's bookmarks. Fixed by adding the enable statements to the schema.

**2. Admin client misused**
The agent used `createAdminClient()` inside the public profile server component and passed it into a client component. Refactored to keep all admin calls server-side and pass only serialised data to the UI.

**3. Resend free tier not accounted for**
The agent used Resend as the sole email provider without knowing it can't deliver to arbitrary users on the free tier. Discovered this when sign-up emails silently failed for test accounts. Added `email-smtp.ts` as a Gmail SMTP fallback using `SMTP_USER` and `SMTP_PASS`.

---

## 📈 Project Highlights

✔ Full-stack Next.js 14 App Router architecture  
✔ Supabase Row Level Security — privacy enforced at DB level  
✔ Dual email provider support — Resend + Gmail SMTP fallback  
✔ Server-side + middleware route protection (double-checked)  
✔ Public profile pages — no login required  
✔ Entire CLI session recording for full AI agent transparency  

---

## 📊 Future Improvements

- Drag-and-drop bookmark reordering
- Tags / collections for bookmark organisation
- Rate limiting on signup (Upstash Redis)
- Verified custom domain on Resend (removes free tier restriction)
- Bookmark import from browser export (HTML)
- Dashboard analytics — most clicked links

---

## 🌍 Deployment

Project deployed on **Vercel Serverless Infrastructure**

```bash
vercel --prod
```

Add all environment variables in Vercel dashboard under **Settings → Environment Variables**.

Set `NEXT_PUBLIC_SITE_URL` to your production Vercel URL so welcome email links work correctly.

---

## 🔐 Security Notes

- RLS is enabled on both `bookmarks` and `profiles` tables — no user can read, edit, or delete another user's data even via direct API calls
- Service role key is only used server-side in `src/lib/supabase/admin.ts` — never exposed to the browser
- Route protection handled in both `middleware.ts` and each server layout
- Handles validated with regex (`^[a-z0-9_]{3,20}$`) and uniqueness enforced by DB `unique` constraint — not just a UI check

---

## 👨‍💻 Author

**Rohansinh Vihol**

Full-Stack Developer

🔗 GitHub: https://github.com/RohansinhVihol
🔗 LinkedIn: https://www.linkedin.com/in/rohansinhvihol