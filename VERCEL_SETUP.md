# Exact Vercel Setup

### 1. GitHub
Create a repository and upload the contents of this folder.

### 2. Vercel
Choose **Import Git Repository**. Framework should be detected as Next.js. Build command: `next build`. Output is automatic.

### 3. Turso
Create a Turso database and copy its URL and auth token. Add them as Vercel environment variables.

### 4. Environment variables
```
TURSO_DATABASE_URL=libsql://YOUR-DB.turso.io
TURSO_AUTH_TOKEN=YOUR_TOKEN
SESSION_SECRET=LONG_RANDOM_SECRET
ADMIN_SETUP_KEY=ONE_TIME_SETUP_SECRET
```

### 5. First admin
After deployment, call:
```
POST https://YOUR-DOMAIN.vercel.app/api/admin/bootstrap
Content-Type: application/json

{"key":"ONE_TIME_SETUP_SECRET","username":"admin","password":"YOUR_STRONG_PASSWORD"}
```
Then go to:
`https://YOUR-DOMAIN.vercel.app/admin/login`

### 6. User flow
Admin → Create User → give username/password → user opens the normal `/` login → student sees only their own dashboard.

### 7. UI
No UI redesign is intended. This conversion changes the deployment/backend architecture, not the visible PPSU login/dashboard design.
