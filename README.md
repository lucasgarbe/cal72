# cal72

Calendar and event management for clubs, built with SvelteKit.

## Prerequisites

- Node.js >= 18
- pnpm
- PostgreSQL

## Setup

1. Copy `.env.example` to `.env` and set your `DATABASE_URL`
2. Install dependencies:
   ```
   pnpm install
   ```
3. Run database migrations:
   ```
   pnpm run db:migrate
   ```
4. Start dev server:
   ```
   pnpm run dev
   ```

## Build

```
pnpm run build
```

Run in production:

```
pnpm run start
```

## License

MIT