# CryptoSolve Platform - Complete Setup Guide

This guide covers the complete setup and deployment of the CryptoSolve USDT/INR exchange platform.

## Project Structure

```
cryptosolve/
├── index.html                    # Frontend UI
├── src/
│   ├── api/
│   │   └── client.js            # Frontend API client
│   ├── components/              # React components (optional)
│   ├── hooks/                   # Custom React hooks
│   └── utils/                   # Utility functions
└── backend/                     # Next.js 14 backend
    ├── src/
    │   ├── app/api/             # API routes
    │   ├── lib/                 # Helper libraries
    │   ├── middleware.ts        # JWT authentication
    │   └── validations/         # Zod schemas
    ├── migrations/              # Supabase migrations
    ├── package.json
    ├── tsconfig.json
    └── .env.example
```

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Fill in all required values:

#### Supabase
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (for admin operations)

To get these:
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings > API keys
4. Copy the project URL and keys

#### Tatum.io (USDT TRC-20 Wallet Management)
- `TATUM_API_KEY`: Your Tatum API key
- `TATUM_API_URL`: Usually `https://api.tatum.io/v3`
- `TATUM_MNEMONIC`: (Optional) Mnemonic for wallet generation
- `TATUM_PRIVATE_KEY`: Private key for USDT transfers
- `USDT_TRC20_CONTRACT`: USDT contract address (default: `TR7NHqjeKQxGTCi8q282XEXS4rtTZGR73c`)

To get these:
1. Sign up at https://tatum.io
2. Go to Dashboard > API Keys
3. Create an API key

#### Cashfree (INR Payouts)
- `CASHFREE_CLIENT_ID`: Your Cashfree client ID
- `CASHFREE_CLIENT_SECRET`: Your Cashfree client secret
- `CASHFREE_API_URL`: Usually `https://api.cashfree.com/pg`

To get these:
1. Sign up at https://cashfree.com
2. Go to Dashboard > Settings > API Keys
3. Copy credentials

#### HyperVerge (KYC Verification)
- `HYPERVERGE_API_KEY`: Your HyperVerge API key
- `HYPERVERGE_API_URL`: Usually `https://api.hyperverge.co/v2`

To get these:
1. Sign up at https://hyperverge.co
2. Go to Dashboard > API Keys
3. Copy your API key

#### JWT & Other
- `JWT_SECRET`: Generate a strong random string (min 32 chars): `openssl rand -base64 32`
- `REDIS_URL`: (Optional) For caching: `redis://localhost:6379`
- `PRICE_FEED_URL`: CoinGecko API URL (default: `https://api.coingecko.com/api/v3`)

### 3. Set Up Supabase Schema

1. Go to your Supabase project dashboard
2. Go to SQL Editor
3. Copy the entire content from `backend/migrations/001_init_schema.sql`
4. Paste it into a new query
5. Click "Run"

This will create all necessary tables with Row Level Security policies enabled.

### 4. Run Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000/api`

## Frontend Setup

### 1. Update API Base URL

In `src/api/client.js`, update the `API_BASE_URL` if your backend is not running on `http://localhost:3000`:

```javascript
const API_BASE_URL = 'http://your-backend-url/api';
```

### 2. Serve Frontend

Option A: Using Live Server (VS Code Extension)
- Install "Live Server" extension
- Right-click `index.html` and select "Open with Live Server"

Option B: Using Python
```bash
python -m http.server 5500
```

Option C: Using Node.js
```bash
npx http-server
```

Frontend will be at `http://localhost:5500` or `http://localhost:8080`

## API Routes Reference

### Authentication
- **POST** `/api/auth` - Login/Signup
  - Body: `{ action: 'login'|'signup', email, password, [confirmPassword] }`
  - Returns: `{ success, token, user }`

### Wallet
- **GET** `/api/wallet` - Get wallet balances
  - Returns: `{ success, wallet: { usdtBalance, inrBalance, trc20Address } }`
- **POST** `/api/wallet` - Generate deposit address
  - Body: `{ currency: 'USDT' }`
  - Returns: `{ success, address }`

### Orders
- **GET** `/api/orders` - Get open orders
  - Returns: `{ success, orders, count }`
- **POST** `/api/orders` - Place order
  - Body: `{ side, orderType, price, amount, totalCost }`
  - Returns: `{ success, order }`
- **DELETE** `/api/orders?orderId={id}` - Cancel order
  - Returns: `{ success }`
- **PATCH** `/api/orders/[id]/fill` - Fill order (admin)
  - Body: `{ buyerAddress? }`
  - Returns: `{ success, txHash? }`

### Order Book
- **GET** `/api/orderbook` - Get live order book
  - Returns: `{ success, orderBook: { bids, asks, timestamp } }`

### P2P
- **GET** `/api/p2p` - Get P2P ads
  - Returns: `{ success, ads, count }`
- **POST** `/api/p2p` - Create P2P ad
  - Body: `{ side, rate, minLimit, maxLimit, paymentMethods }`
  - Returns: `{ success, ad }`
- **POST** `/api/p2p/[id]/trade` - Initiate trade
  - Body: `{ amount }`
  - Returns: `{ success, escrow }`

### KYC
- **GET** `/api/kyc` - Get KYC status
  - Returns: `{ success, kycStatus, verificationId }`
- **POST** `/api/kyc` - Submit KYC
  - Body: `{ selfieImage, aadhaarImage, fullName, dateOfBirth }`
  - Returns: `{ success, verificationId, status }`

### Withdrawal
- **POST** `/api/withdraw` - Request withdrawal
  - Body: `{ type: 'inr'|'usdt', amount, [upiId|toAddress] }`
  - Returns: `{ success, [txHash|transferId] }`

### Price
- **GET** `/api/price` - Get USDT/INR price
  - Returns: `{ success, price: { rate, symbol, timestamp } }`

## Authentication Flow

1. User signs up/logs in via frontend
2. Frontend calls `/api/auth` with credentials
3. Backend returns JWT token
4. Frontend stores token in `localStorage`
5. All subsequent API calls include token in `Authorization: Bearer {token}` header
6. Middleware validates token on each request

## Testing the Platform

### 1. Test Login/Signup
```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "signup",
    "email": "user@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### 2. Test Get Price
```bash
curl http://localhost:3000/api/price
```

### 3. Test Protected Route (with token)
```bash
curl -X GET http://localhost:3000/api/wallet \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Deployment

### Backend (Vercel - Recommended)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Set environment variables in Vercel dashboard
5. Deploy

### Frontend (Netlify/Vercel/GitHub Pages)

1. Update `API_BASE_URL` in `src/api/client.js` to your production backend URL
2. Deploy to your hosting platform

## Security Considerations

1. **JWT Secret**: Use a strong, random secret
2. **CORS**: Configure allowed origins in Next.js
3. **Rate Limiting**: Implement rate limiting on sensitive endpoints
4. **Input Validation**: All endpoints use Zod validation
5. **RLS**: Supabase Row Level Security policies prevent unauthorized data access
6. **API Keys**: Never commit `.env.local` to git
7. **HTTPS**: Always use HTTPS in production

## Monitoring & Debugging

### Backend Logs
```bash
npm run dev  # Shows real-time logs
```

### Database
- Supabase Dashboard: Monitor queries and performance
- SQL Editor: Run custom queries

### Frontend
- Browser DevTools > Network: Monitor API calls
- Browser DevTools > Console: Check for errors

## Troubleshooting

### "Invalid or expired token"
- Ensure JWT_SECRET is set correctly
- Check token expiration (default 24h)
- Re-authenticate user

### "Wallet not found"
- Generate deposit address via `/api/wallet` POST
- Check user was created in database

### "Tatum API error"
- Verify API key and endpoint URL
- Check network connectivity
- Review Tatum documentation

### "Supabase connection failed"
- Verify URL and keys in `.env.local`
- Check database is running
- Review Supabase logs

## Next Steps

1. **Implement WebSocket** for real-time order updates
2. **Add wallet** connect (MetaMask, WalletConnect)
3. **Add trading engine** for automatic order matching
4. **Implement KYC verification** webhook handling
5. **Add transaction history** and analytics
6. **Implement referral system**
7. **Add 2FA** (TOTP/SMS)
8. **Implement rate limiting** and DDoS protection

## Support

For issues or questions:
1. Check the documentation in this file
2. Review API error messages
3. Check Supabase/Tatum/Cashfree logs
4. Consult official API documentation

## License

MIT
