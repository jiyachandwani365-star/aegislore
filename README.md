# AegisLore

Production-ready Next.js foundation for AegisLore.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

3. Update `DATABASE_URL` and `AUTH_SECRET`.

4. Generate Prisma client and run migrations:

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. Start development:

   ```bash
   npm run dev
   ```

## Architecture

See `ARCHITECTURE.md` for the architectural decisions and extension rules.
