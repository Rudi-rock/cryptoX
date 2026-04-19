# Quick Start Guide - CryptoSolve Exchange

Get the platform running in 15 minutes.

## Prerequisites

- Node.js 18+
- npm or yarn
- A Supabase account (free tier works)
- API keys for Tatum, Cashfree, HyperVerge

## 5-Minute Quickstart

### 1. Supabase Setup (3 mins)

1. Go to https://supabase.com and create account
2. Create a new project
3. Go to Settings > API Keys
4. Copy Project URL and Anon Key
5. Go to SQL Editor and paste schema from `backend/migrations/001_init_schema.sql`
6. Click Run

### 2. Backend Setup (2 mins)

```bash
cd backend
npm install

# Create .env.local
cp .env.example .env.local

# Edit .env.local with:
# - SUPABASE URLs from step 1
# - JWT_SECRET: openssl rand -base64 32
# - API keys (use dummy values if you don't have them yet)
```

### 3. Start Backend

```bash
npm run dev
```

✅ Backend running at `http://localhost:3000/api`

### 4. Start Frontend

In new terminal:

```bash
cd ..  # Go back to root
# Option A: Using Python
python -m http.server 5500

# Option B: Using npx
npx http-server
```

✅ Frontend at `http://localhost:5500` or `http://localhost:8080`

## Test It

1. Open frontend in browser
2. Click "Trade" or "Connect Wallet"
3. Sign up with test email
4. Frontend will call backend automatically

## API Keys Setup

### Required for Full Functionality

#### 1. Tatum.io
```bash
# Get key from https://tatum.io/dashboard
# Store in .env.local:
TATUM_API_KEY=your_key_here
```

#### 2. Cashfree
```bash
# Get from https://dashboard.cashfree.com/settings/api-keys
CASHFREE_CLIENT_ID=your_id
CASHFREE_CLIENT_SECRET=your_secret
```

#### 3. HyperVerge
```bash
# Get from https://dashboard.hyperverge.co
HYPERVERGE_API_KEY=your_key
```

## Frontend-to-Backend Integration

The frontend automatically calls your backend APIs through `src/api/client.js`.

Key functions:
- `api.login(email, password)` - Authenticate
- `api.getWallet()` - Fetch balances
- `api.placeOrder(side, type, price, amount)` - Place order
- `api.getOrderBook()` - Get live orderbook

Token is automatically saved to `localStorage` after login.

## Next Steps

1. **Add Wallet Connect** - Modify `src/api/client.js` for MetaMask
2. **Enable Testnet** - Use Tatum testnet APIs
3. **Deploy Backend** - Push to Vercel/Railway
4. **Deploy Frontend** - Push to Netlify/Vercel
5. **Monitor** - Check Supabase logs

## Troubleshooting

### "Can't connect to backend"
```
✓ Ensure npm run dev is running in backend/
✓ Check API_BASE_URL in src/api/client.js
✓ Check CORS isn't blocking requests
```

### "Supabase auth failing"
```
✓ Verify SUPABASE URLs in .env.local
✓ Check Supabase project exists
✓ Verify schema was created successfully
```

### "Orders not saving"
```
✓ Check Supabase orders table exists
✓ Verify user is authenticated
✓ Check JWT token is being sent
```

## Production Deployment

### Backend (Vercel)
```bash
# Create vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}

# Deploy
vercel --prod
```

### Frontend
Update `API_BASE_URL` in `src/api/client.js` to production URL

```javascript
const API_BASE_URL = 'https://your-backend.vercel.app/api';
```

Then deploy to Netlify/Vercel/GitHub Pages.

## File Structure Cheatsheet

```
Frontend: index.html + src/api/client.js
Backend: backend/src/app/api/* (all API routes)
Database: Supabase (tables: users, wallets, orders, p2p_ads, etc.)
```

## Quick Reference

| Task | Command |
|------|---------|
| Install deps | `npm install` in backend/ |
| Start API | `npm run dev` in backend/ |
| Start frontend | `python -m http.server 5500` in root |
| View logs | Check backend terminal |
| Check db | Go to Supabase dashboard |
| Test API | `curl http://localhost:3000/api/price` |

## One-Command Setup (Linux/Mac)

```bash
cd backend && npm install && npm run dev &
sleep 2
python -m http.server 5500
```

## Tips

1. **Use `.env.local`** - Never commit actual keys
2. **Test endpoints** - Use curl before frontend
3. **Check logs** - Backend logs show all errors
4. **Monitor DB** - Supabase logs show queries
5. **Use Postman** - Test APIs before frontend integration

## Getting Help

1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup
2. Check [API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md) for endpoints
3. Check error messages in browser console and backend logs
4. Review code comments in backend/src/app/api/

## What's Working

✅ Authentication (signup/login with JWT)  
✅ Wallet management (balances, addresses)  
✅ Order placement and cancellation  
✅ Order book (real-time aggregation)  
✅ P2P trading (ads, escrow)  
✅ KYC verification (document upload)  
✅ Withdrawals (INR/USDT)  
✅ Price feed (live USDT/INR)  
✅ Frontend integration with backend  

## Performance Tips

- Frontend caches orders locally
- Order book updates every 30 seconds
- Price updates every 30 seconds
- Use Redis for caching (optional)
- Add database indexes for large datasets

---

You're now ready to build on CryptoSolve! 🚀
