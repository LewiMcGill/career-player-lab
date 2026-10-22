# Career Player Lab Online
Next.js + Supabase starter, following the GitHub → Vercel workflow.

## Local test
1. Install Node.js LTS and extract this ZIP.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`; fill in Supabase URL and publishable/anon key.
4. Run `npm run dev`; open http://localhost:3000.

## Supabase setup
1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. Copy the project URL and publishable key from Supabase API settings.

## Deploy
1. Push this folder to a new GitHub repository. Never upload `.env.local`.
2. Import that repository in Vercel.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` under Vercel Project Settings → Environment Variables.
4. Deploy. Later code changes: `git add .`, `git commit -m "Update Career Player Lab"`, `git push`.

## Privacy
This no-login starter uses permissive Supabase policies for easy setup. Anyone who knows the public app endpoint may be able to read/change the shared save. Do not store sensitive data. For stronger privacy, add authentication or a server-side access code.
