# CryptoSolve - USDT/INR Crypto Exchange Platform

A complete, production-ready cryptocurrency exchange platform with trading, P2P functionality, and comprehensive KYC verification.

![Status](https://img.shields.io/badge/status-production--ready-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-18+-green)

## Features

- ✅ **User Authentication** - JWT-based auth with Supabase
- ✅ **Trading** - Limit and market orders for USDT/INR
- ✅ **P2P Trading** - Direct peer-to-peer trades with escrow
- ✅ **Wallets** - USDT (TRC-20) and INR balances
- ✅ **KYC Verification** - HyperVerge integration
- ✅ **Withdrawals** - INR (Cashfree) and USDT (Tatum)
- ✅ **Live Prices** - Real-time price feeds (CoinGecko)
- ✅ **Order Book** - Aggregated order data
- ✅ **Security** - Row-level database security, JWT validation
- ✅ **TypeScript** - Full type safety

## Tech Stack

### Backend
- **Next.js 14** - React framework with API routes
- **TypeScript** - Type-safe code
- **Supabase** - PostgreSQL database + auth
- **Zod** - Schema validation
- **jose** - JWT handling

### Frontend
- **React** - UI framework
- **Tailwind CSS** - Styling
- **Vanilla JavaScript** - No build step needed
- **localStorage** - Token storage

### Integrations
- **Tatum.io** - Cryptocurrency wallets & transfers
- **Cashfree** - INR payouts
- **HyperVerge** - KYC verification
- **CoinGecko** - Price feeds

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone the repo
git clone <your-repo-url>
cd cryptosolve

# Copy environment file
cp backend/.env.example backend/.env.local

# Edit .env.local with your API keys
# (or leave dummy values for testing)

# Start with Docker
docker-compose up
```

Services will be available at:
- **Frontend**: http://localhost:5500
- **Backend API**: http://localhost:3000/api

### Option 2: Manual Setup

```bash
# Clone repo
git clone <your-repo-url>
cd cryptosolve

# Run setup
./setup-simple.ps1

# Edit API keys
# backend\.env.local

# Start all services
./start-all.ps1
```

Or start individually:

**Terminal 1 - Backend:**
```bash
.\start-backend.ps1
```

**Terminal 2 - Frontend:**
```bash
.\start-frontend.ps1
```

Then open: http://localhost:5500

## Configuration

### Required API Keys

Create `backend/.env.local`:

```env
# Supabase (https://supabase.com)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-key

# Tatum (https://tatum.io)
API_KEY_TATUM=your-key

# Cashfree (https://cashfree.com)
CASHFREE_CLIENT_ID=your-id
CASHFREE_CLIENT_SECRET=your-secret

# HyperVerge (https://hyperverge.co)
HYPERVERGE_APP_ID=your-id
HYPERVERGE_APP_KEY=your-key

# JWT
JWT_SECRET=auto-generated-or-provide-your-own
```

**For testing** - Leave dummy values and the app works with mock data.

### Database Setup

1. Create Supabase project at https://supabase.com
2. Go to SQL Editor
3. Copy entire contents of `backend/migrations/001_init_schema.sql`
4. Run the SQL to create tables and RLS policies

## API Endpoints

All endpoints return JSON. Protected endpoints require `Authorization: Bearer {token}` header.

### Authentication
- `POST /api/auth` - Login/Signup

### Wallet
- `GET /api/wallet` - Get balances (protected)
- `POST /api/wallet` - Generate deposit address (protected)

### Orders
- `GET /api/orders` - List user orders (protected)
- `POST /api/orders` - Place order (protected)
- `PATCH /api/orders/[id]/fill` - Fill order (protected)
- `DELETE /api/orders/[id]` - Cancel order (protected)

### Order Book
- `GET /api/orderbook` - Get aggregated order book (public)

### P2P Trading
- `GET /api/p2p` - List P2P ads (public)
- `POST /api/p2p` - Create P2P ad (protected)
- `POST /api/p2p/[id]/trade` - Initiate trade (protected)

### KYC
- `GET /api/kyc` - Get KYC status (protected)
- `POST /api/kyc` - Submit KYC (protected)

### Withdrawals
- `POST /api/withdraw` - Withdraw INR or USDT (protected)

### Price Feed
- `GET /api/price` - Get current USDT/INR price (public)

## Project Structure

```
cryptosolve/
├── backend/                    # Next.js API server
│   ├── src/app/api/           # API routes
│   ├── src/lib/               # Helper libraries
│   ├── src/middleware.ts      # JWT validation
│   ├── migrations/            # Database schema
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example           # Configuration template
│   └── Dockerfile
│
├── src/                       # Frontend
│   ├── api/client.js          # API client
│   ├── components/            # React components
│   └── pages/                 # Page views
│
├── index.html                 # Main HTML
├── docker-compose.yml         # Multi-container setup
├── start-all.ps1              # Master startup script
├── setup-simple.ps1           # Setup automation
├── .github/workflows/         # CI/CD pipelines
└── README.md
```

## Development

### Type Checking
```bash
cd backend
npm run type-check
```

### Linting
```bash
cd backend
npm run lint
```

### Build
```bash
cd backend
npm run build
```

## Deployment

### Vercel (Recommended for Backend)

1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Docker

```bash
docker-compose up -d
```

### Traditional VPS

1. Install Node.js 18+
2. Clone repo
3. Run `npm install` in backend/
4. Set environment variables
5. Run `npm start` for production

## Troubleshooting

### "Cannot find module '@supabase/supabase-js'"
```bash
cd backend
npm install
```

### "Supabase URL is invalid"
Make sure `SUPABASE_URL` in `.env.local` is set to a real Supabase project URL (not dummy values) for database operations.

### "CORS errors from frontend"
Backend is likely not running. Start with `.\start-backend.ps1`

### "Port already in use"
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill it
taskkill /PID <PID> /F
```

### Database connection issues
1. Verify Supabase URL and keys in `.env.local`
2. Check that SQL schema has been run in Supabase
3. Ensure RLS policies are enabled

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for more common issues.

## Documentation

- [GETTING_STARTED.md](GETTING_STARTED.md) - 5-minute quickstart
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Complete setup guide
- [API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md) - Full API reference
- [ENV_VARIABLES.md](backend/ENV_VARIABLES.md) - Configuration help
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues & solutions

## Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## Security

- All user data is isolated via Row-Level Security
- Passwords are hashed by Supabase Auth
- API endpoints are protected with JWT validation
- Third-party integrations use secure API keys
- TypeScript prevents type-related bugs

## License

MIT - See [LICENSE](LICENSE) file

## Support

- 📚 [Documentation](SETUP_GUIDE.md)
- 🐛 [Issues](../../issues)
- 💬 [Discussions](../../discussions)

## Roadmap

- [ ] Advanced charting with TradingView
- [ ] WebSocket for real-time updates
- [ ] Multi-currency support
- [ ] Advanced order types (trailing stop, iceberg)
- [ ] API rate limiting
- [ ] User referral program
- [ ] Mobile app
- [ ] Staking platform

## Status

This project is **production-ready** and can be deployed immediately. All API routes are implemented, database schema is complete, and frontend integration is finished.

---

**Built with ❤️ for crypto traders**
