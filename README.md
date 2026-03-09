# Crime Database Management System

Two related Next.js applications use a shared database and can be built
and deployed from this monorepo.

- `officer-app` — internal dashboard for police officers.
- `public-app` — public transparency portal with read-only access.

## Development

Install dependencies at the repo root to populate both workspaces:

```bash
npm ci
```

You can run either app locally with the workspace scripts:

```bash
npm run dev:officer    # starts officer-app (port 3000 by default)
npm run dev:public     # starts public-app (port 3001/3002)
```

Set `NEXT_PUBLIC_OFFICER_URL` to the officer site URL when running the
public app locally.

## Database

Use Supabase (PostgreSQL) as the backend. Apply the SQL files in
`officer-app/scripts/` in order to create the schema, seed data, and add
features:

1. `001_create_crime_tables.sql`
2. `002_seed_crime_data.sql`
3. `003_add_officer_auth.sql`
4. `004_add_accused_property.sql`
5. `005_add_case_notes_evidence_notifications.sql`

You can run them via the Supabase CLI or copy-paste them into the SQL
editor.

## Deployment

1. **Create a Supabase project.** Copy the `SUPABASE_URL` and keys.
2. **Provision the database** with the SQL migrations above.
3. **Seed data** if desired: `npm run seed:officer`.
4. **Deploy each app separately** (e.g. two Vercel projects) using the
   root of this repo but setting the "Root Directory" to the
   appropriate subfolder.
5. **Environment variables** for each app:

   ```text
   SUPABASE_URL
   SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY   # officer-app only
   JWT_SECRET                  # officer-app only
   NEXT_PUBLIC_OFFICER_URL     # public-app
   NEXT_PUBLIC_BASE_URL        # optional; used by RSS feed
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY  # optional; used by heatmap
   ```

6. After the officer app is live, use its URL in
   `NEXT_PUBLIC_OFFICER_URL` for the public app and redeploy it.

## Features

- **Officer app:** FIR CRUD, case notes, evidence uploads, notifications,
  statistics, PDF download, officer authentication, RLS policies.
- **Public app:** Browse cases with filters, statistics charts, heatmap,
  language toggle (English/Malayalam), news articles, RSS feed.

## Future enhancements

- Add more sophisticated heatmap using geocoded coordinates.
- Enable RSS for FIR updates.
- Add user accounts for the public portal.
- Internationalisation beyond Malayalam.

---

Feel free to explore the codebase or ask for assistance!