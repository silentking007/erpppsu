# PPSU ERP — Vercel Ready

This version keeps the **same login and student dashboard output/UI** as the supplied PHP project, but moves the backend to **Next.js + Turso/libSQL**, which is a better fit for Vercel.

## Recommended production stack
- Frontend/backend: Next.js
- Hosting: Vercel
- Database: Turso (libSQL / SQLite-compatible)
- Authentication: secure HTTP-only signed session cookie + bcrypt password hashes
- Images: existing assets in `public/assets` (for user-uploaded images, add Vercel Blob or Supabase Storage later)

## Local run
1. Install Node.js 20+.
2. Copy `.env.example` to `.env.local`.
3. Keep `TURSO_DATABASE_URL=file:./data/ppsu.db` for local development.
4. Run `npm install`.
5. Run `npm run dev`.
6. Open `http://localhost:3000`.
7. The first time the database initializes, a default admin is created automatically: **username `admin` / password `admin123`**.
8. Open `/admin/login`.

## Vercel + Turso deployment
1. Connect the Turso integration to your Vercel project.
2. Push this folder to GitHub and import/redeploy it in Vercel.
3. In Vercel Project Settings → Environment Variables, make sure `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, and `SESSION_SECRET` are present. Optionally add `DEFAULT_ADMIN_USERNAME` and `DEFAULT_ADMIN_PASSWORD` to choose the first admin credentials.
4. Redeploy. On the first database initialization, the default admin is seeded automatically.
5. Open `/admin/login` and sign in with the seeded admin credentials, then create student accounts.

### Default admin
- Username: `admin`
- Password: `admin123`
- For production, override with `DEFAULT_ADMIN_USERNAME` and `DEFAULT_ADMIN_PASSWORD` **before the database is initialized**.

The existing `/api/admin/bootstrap` endpoint is retained for compatibility, but it is no longer necessary for the normal first-admin setup.

## Important
- The visual output is intentionally preserved: login slideshow, fields, buttons, warning, store badges, dashboard cards, fee table, mobile breakpoint, fonts and Font Awesome icon choices.
- Do not use a local SQLite file on Vercel production. Use Turso for persistent data.
- Do not store production passwords in source code.

## Updated student account management
- Admin creates students with Enrollment Number + password.
- Students log in using Enrollment Number + the password set by admin.
- Admin can upload/replace a student profile image directly from the Edit/Create User form. Images are resized in the browser before being stored with the user record, so no separate file-storage integration is required.
- Admin form UI has been rebuilt with responsive labels, grouped sections, consistent input widths, photo preview, and mobile layout.
