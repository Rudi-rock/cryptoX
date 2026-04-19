# CryptoSolve API Backend

Next.js 14 backend for USDT/INR crypto exchange with Supabase, Tatum.io, Cashfree, and HyperVerge integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` from `.env.example` and add your API keys

3. Run development server:
```bash
npm run dev
```

4. Access API at `http://localhost:3000/api/*`

## API Routes

- `/api/auth` - Authentication (login/signup)
- `/api/wallet` - Wallet operations (balance, deposit address)
- `/api/orders` - Order management (place, fetch, cancel)
- `/api/orders/[id]/fill` - Order filling
- `/api/orderbook` - Live order book
- `/api/p2p` - P2P advertisements
- `/api/p2p/[id]/trade` - P2P trades
- `/api/kyc` - KYC verification
- `/api/withdraw` - Withdrawals (INR/USDT)
- `/api/price` - Price feed

## Database Schema

See `migrations/001_init_schema.sql` for Supabase schema.

## Architecture

- `src/app/api/*` - API routes
- `src/lib/*` - Helper libraries
- `src/middleware.ts` - JWT authentication
- `src/validations/*` - Zod schemas
