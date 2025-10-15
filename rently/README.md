# Rently

Modern, Arabic-first SaaS for property management in the Middle East.

## Quickstart

1. Install dependencies
```bash
npm install
```

2. Set environment
```bash
cp .env.example .env
```

3. Generate DB and seed
```bash
npx prisma migrate dev --name init
npm run prisma:seed
```

4. Run the app
```bash
npm run dev
```

Open http://localhost:3000 to view. The root redirects to `/en`.

### Login
- Email: `admin@rently.local`
- Password: `admin1234`

### Tech
- Next.js (App Router) + Tailwind CSS
- Prisma + SQLite
- NextAuth (Credentials) + Prisma Adapter
- next-intl (Arabic/English, RTL)

### Stubs
- Payments: `/api/payments/{paytabs|mada|stc}`
- Notifications: `/api/notifications`
