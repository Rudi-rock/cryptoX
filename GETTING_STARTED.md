# CryptoSolve - Complete Setup Ready

Welcome to CryptoSolve! Your complete USDT/INR crypto exchange platform with backend and frontend is ready to deploy.

## Quick Start (5 minutes)

### 1. Run Setup Script
```powershell
.\setup.ps1
```

This will:
- Install Node.js dependencies
- Create .env.local configuration
- Generate JWT secret
- Create start scripts

### 2. Configure API Keys
After setup.ps1 completes, edit `backend\.env.local` and add your API keys:

```env
# Supabase (Get from https://supabase.com)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-key

# Tatum (Get from https://tatum.io)
API_KEY_TATUM=your-key

# Cashfree (Get from https://cashfree.com)
CASHFREE_CLIENT_ID=your-id
CASHFREE_CLIENT_SECRET=your-secret

# HyperVerge (Get from https://hyperverge.co)
HYPERVERGE_APP_ID=your-id
HYPERVERGE_APP_KEY=your-key
```

**For testing without real API keys:** Just leave the dummy values and the app will work with mock data.

### 3. Start the Backend (Terminal 1)
```powershell
.\start-backend.ps1
```

Backend runs at: http://localhost:3000/api

### 4. Start the Frontend (Terminal 2)
```powershell
.\start-frontend.ps1
```

Frontend runs at: http://localhost:5500

### 5. Open in Browser
Visit: http://localhost:5500

## Project Structure

```
cryptosolve/
├── backend/                      # Next.js 14 backend (API server)
│   ├── src/app/api/             # 10 API route groups
│   │   ├── auth/                # Login/Signup
│   │   ├── wallet/              # Wallet management
│   │   ├── orders/              # Order trading
│   │   ├── orderbook/           # Order book
│   │   ├── p2p/                 # P2P trading
│   │   ├── kyc/                 # KYC verification
│   │   ├── withdraw/            # Withdrawals
│   │   └── price/               # Price data
│   ├── src/lib/                 # Helper libraries
│   │   ├── tatum.ts             # USDT/TRC-20 wallets
│   │   ├── cashfree.ts          # INR payouts
│   │   ├── hyperverge.ts        # KYC verification
│   │   ├── supabase.ts          # Database
│   │   ├── jwt.ts               # Authentication
│   │   └── price.ts             # Price feeds
│   ├── migrations/              # Database schema
│   ├── package.json             # Dependencies
│   ├── .env.example             # Configuration template
│   ├── API_DOCUMENTATION.md     # Full API reference
│   ├── ENV_VARIABLES.md         # Configuration guide
│   └── ...
│
├── src/                         # Frontend (Vite/React)
│   ├── api/client.js            # API client for frontend
│   ├── components/              # React components
│   ├── pages/                   # Page views
│   └── ...
│
├── index.html                   # Main HTML file
├── setup.ps1                    # Automated setup
├── start-backend.ps1            # Start backend
├── start-frontend.ps1           # Start frontend
├── verify-setup.ps1             # Verify installation
├── TROUBLESHOOTING.md           # Common issues & fixes
├── QUICKSTART.md                # Quick start guide
└── README.md                    # Documentation
```

## Commands Reference

| Command | Purpose |
|---------|---------|
| `.\setup.ps1` | Complete setup (one-time) |
| `.\start-backend.ps1` | Start backend server |
| `.\start-frontend.ps1` | Start frontend server |
| `.\verify-setup.ps1` | Check installation status |

## API Endpoints (10 Routes)

- **POST** `/api/auth` - Login/Signup
- **GET/POST** `/api/wallet` - Wallet balance & deposit address
- **GET/POST/PATCH/DELETE** `/api/orders` - Order management
- **GET** `/api/orderbook` - Live order book
- **GET/POST** `/api/p2p` - P2P trading
- **POST** `/api/p2p/[id]/trade` - Initiate P2P trade
- **GET/POST** `/api/kyc` - KYC verification
- **POST** `/api/withdraw` - Withdrawals (INR/USDT)
- **GET** `/api/price` - USDT/INR price feed

## Features Included

✅ User authentication with JWT tokens  
✅ Wallet management (USDT & INR balances)  
✅ Limit & market orders for crypto trading  
✅ P2P trading with escrow protection  
✅ Real-time price feed (CoinGecko)  
✅ USDT TRC-20 wallet integration (Tatum)  
✅ INR payout integration (Cashfree)  
✅ KYC verification (HyperVerge)  
✅ Order book with aggregation  
✅ Row-level security on database  
✅ TypeScript throughout  
✅ Complete API documentation  

## Testing Without API Keys

The app works with mock data if you don't configure API keys:

1. Run `.\setup.ps1`
2. Leave `.env.local` with dummy values
3. Start backend and frontend
4. Login with any email/password
5. All features work with mock data

Real API integration works when you add actual API keys to `.env.local`.

## Documentation

- **QUICKSTART.md** - Get running in 15 minutes
- **SETUP_GUIDE.md** - Complete setup guide with all steps
- **backend/API_DOCUMENTATION.md** - Full API reference with examples
- **backend/ENV_VARIABLES.md** - Help for each configuration key
- **TROUBLESHOOTING.md** - Common issues and fixes

## Need Help?

1. Run verification: `.\verify-setup.ps1`
2. Check TROUBLESHOOTING.md for common issues
3. Review API_DOCUMENTATION.md for endpoint details
4. Check .env.local has correct keys
5. Look at browser console for errors

## Next Steps

1. **Run setup**: `.\setup.ps1`
2. **Add API keys**: Edit `backend\.env.local`
3. **Start backend**: `.\start-backend.ps1`
4. **Start frontend**: `.\start-frontend.ps1`
5. **Open browser**: http://localhost:5500

## Technology Stack

**Backend:**
- Next.js 14 with App Router
- TypeScript
- Supabase (PostgreSQL + Auth)
- Zod (validation)
- jose (JWT)
- axios (HTTP)

**Frontend:**
- React (Vite)
- Tailwind CSS
- Vanilla JavaScript
- localStorage (auth tokens)

**Integrations:**
- Tatum.io (Crypto wallets)
- Cashfree (INR payouts)
- HyperVerge (KYC)
- CoinGecko (Prices)

## Deployment

The backend is optimized for Vercel. To deploy:

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

See SETUP_GUIDE.md for detailed deployment instructions.

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** Production Ready
