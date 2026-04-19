# Environment Variables Reference

Complete guide to all environment variables used in CryptoSolve backend.

## Overview

Environment variables are stored in `.env.local` (development) or system environment (production).

See `.env.example` for template.

## Supabase Variables

These enable database and authentication.

### `NEXT_PUBLIC_SUPABASE_URL`
- **Description**: Your Supabase project URL
- **Format**: `https://projectid.supabase.co`
- **Where to find**: Supabase Dashboard > Settings > API > Project URL
- **Required**: Yes
- **Public**: Yes (safe to expose)

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Description**: Supabase anonymous key for frontend
- **Format**: Long base64 string
- **Where to find**: Supabase Dashboard > Settings > API > Anon Key
- **Required**: Yes
- **Public**: Yes (limited scope via RLS)

### `SUPABASE_SERVICE_ROLE_KEY`
- **Description**: Supabase service role key for backend
- **Format**: Long base64 string
- **Where to find**: Supabase Dashboard > Settings > API > Service Role Key
- **Required**: Yes
- **Public**: NO - Never expose this key!
- **Usage**: Admin operations, user creation, verification

## Tatum.io Variables

For USDT TRC-20 wallet operations.

### `TATUM_API_KEY`
- **Description**: Tatum.io API authentication key
- **Where to find**: https://tatum.io/dashboard > API Keys
- **Required**: Yes (for wallet operations)
- **Public**: NO

### `TATUM_API_URL`
- **Description**: Tatum API endpoint
- **Default**: `https://api.tatum.io/v3`
- **Testnet**: `https://api-testnet.tatum.io/v3`
- **Required**: Yes
- **Public**: Yes

### `TATUM_MNEMONIC`
- **Description**: BIP39 mnemonic for wallet generation (optional)
- **Format**: 12 or 24 words
- **Required**: No (can use API-generated wallets)
- **Public**: NO
- **Notes**: If provided, wallets derived from this mnemonic

### `TATUM_PRIVATE_KEY`
- **Description**: Private key for signing USDT transfers
- **Format**: Hex string (0x...)
- **Required**: Yes (for withdrawals)
- **Public**: NO
- **Security**: Encrypt in production, never log this

### `USDT_TRC20_CONTRACT`
- **Description**: USDT token contract address on Tron
- **Default**: `TR7NHqjeKQxGTCi8q282XEXS4rtTZGR73c` (mainnet)
- **Testnet**: Use Shasta testnet contract
- **Required**: Yes
- **Public**: Yes

## Cashfree Variables

For INR payouts via UPI/IMPS.

### `CASHFREE_CLIENT_ID`
- **Description**: Cashfree merchant ID
- **Where to find**: https://dashboard.cashfree.com > Settings > API Keys
- **Required**: Yes (for INR payouts)
- **Public**: NO

### `CASHFREE_CLIENT_SECRET`
- **Description**: Cashfree API secret
- **Where to find**: https://dashboard.cashfree.com > Settings > API Keys
- **Required**: Yes (for INR payouts)
- **Public**: NO
- **Security**: Rotate periodically

### `CASHFREE_API_URL`
- **Description**: Cashfree API endpoint
- **Default**: `https://api.cashfree.com/pg`
- **Required**: Yes
- **Public**: Yes
- **Notes**: Check Cashfree docs for correct endpoint

## HyperVerge Variables

For KYC document verification.

### `HYPERVERGE_API_KEY`
- **Description**: HyperVerge authentication key
- **Where to find**: https://dashboard.hyperverge.co > API Keys
- **Required**: Yes (for KYC)
- **Public**: NO

### `HYPERVERGE_API_URL`
- **Description**: HyperVerge API endpoint
- **Default**: `https://api.hyperverge.co/v2`
- **Required**: Yes (for KYC)
- **Public**: Yes

## Security Variables

### `JWT_SECRET`
- **Description**: Secret key for signing JWT tokens
- **Format**: Random string, minimum 32 characters
- **Generate**: `openssl rand -base64 32`
- **Required**: Yes
- **Public**: NO - Never share!
- **Security**: Change on each production deployment
- **Notes**: Users can't forge tokens without this

### `NODE_ENV`
- **Description**: Current environment
- **Values**: `development` | `production` | `staging`
- **Default**: `development`
- **Usage**: Affects logging, error messages, optimization
- **Required**: No

## Cache Variables

### `REDIS_URL`
- **Description**: Redis connection URL for caching
- **Format**: `redis://[user[:password]@]host[:port][/db]`
- **Example**: `redis://localhost:6379`
- **Required**: No (optional, for performance)
- **Usage**: Cache prices, orderbook snapshots
- **Services**: Upstash (free tier), Redis Cloud, Local Redis

## Price Feed Variables

### `PRICE_FEED_URL`
- **Description**: CoinGecko API endpoint for prices
- **Default**: `https://api.coingecko.com/api/v3`
- **Required**: No (has fallback)
- **Public**: Yes
- **Notes**: Free tier has rate limits

## Setup Instructions

### Step 1: Create `.env.local`

```bash
cd backend
cp .env.example .env.local
```

### Step 2: Fill in Variables

```bash
# Edit .env.local with your values
nano .env.local  # or use your editor
```

### Step 3: Validate

```bash
# Check all required vars are set
npm run validate-env  # If available
```

## Getting API Keys

### Supabase
1. Go to https://supabase.com
2. Create account/project
3. Settings > API
4. Copy URL and keys

### Tatum
1. Go to https://tatum.io
2. Sign up (free tier available)
3. Dashboard > API Keys
4. Create API key
5. For testnet: Use testnet API key

### Cashfree
1. Go to https://cashfree.com
2. Sign up as merchant
3. Dashboard > Settings > API Keys
4. Copy credentials
5. Enable UPI/IMPS in settings

### HyperVerge
1. Go to https://hyperverge.co
2. Sign up
3. Dashboard > API Keys
4. Copy API key
5. Enable required document types

## Testing Variables

### Development Setup
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJXXXX...
SUPABASE_SERVICE_ROLE_KEY=eyJXXXX...
TATUM_API_KEY=xxxxx
TATUM_API_URL=https://api.tatum.io/v3
CASHFREE_CLIENT_ID=xxxxx
CASHFREE_CLIENT_SECRET=xxxxx
JWT_SECRET=your_random_32_char_secret_here
```

### Test Without Full Setup
If you don't have all keys yet:

1. Use only Supabase (for auth/database)
2. Mock Tatum responses in development
3. Mock Cashfree responses in development
4. Use test/sandbox modes for APIs

## Production Setup

### Environment Variables
- Store in hosting platform's environment settings
- **Vercel**: Project Settings > Environment Variables
- **Railway**: Variables section
- **Docker**: Pass via -e or .env file

### Security Best Practices
1. **Never commit `.env.local`** - Add to .gitignore
2. **Use different keys per environment** - Dev/Staging/Prod
3. **Rotate service keys** - Every 90 days
4. **Encrypt at rest** - Use platform's encryption
5. **Log access** - Monitor who accesses keys
6. **Use key management** - Hashicorp Vault, AWS Secrets Manager

### Example Vercel Deployment
```bash
vercel env add SUPABASE_URL https://xxxxx.supabase.co
vercel env add SUPABASE_KEY eyJXXXX...
# ... add all keys
vercel deploy --prod
```

## Troubleshooting

### "Database connection failed"
- Check SUPABASE_URL format
- Verify SUPABASE_SERVICE_ROLE_KEY is service role, not anon key
- Ensure Supabase project is active

### "Invalid JWT token"
- Check JWT_SECRET is set
- Verify JWT_SECRET hasn't changed (invalidates existing tokens)
- Check token expiration (24h default)

### "API key rejected"
- Verify API key is correct (copy-paste completely)
- Check API hasn't been rotated
- Verify key has correct permissions

### "Connection timeout"
- Check API URLs are correct
- Verify internet connectivity
- Check firewall/network access
- Verify API endpoints are accessible

## Variable Validation

Check that all required variables are set:

```bash
# In backend directory
cat .env.local | grep -E '^[A-Z_]+=' | wc -l
# Should show number of variables set
```

## Monitoring

### Check Which Variables Are Used

```bash
# Search backend code
grep -r "process.env\." src/ | grep -o 'process\.env\.[A-Z_]*' | sort -u
```

### Production Logging
Don't log sensitive values:

```javascript
// ✗ Bad
console.log(process.env.JWT_SECRET);

// ✓ Good
console.log(`JWT Secret: ${process.env.JWT_SECRET?.substring(0, 10)}...`);
```

## Migration Between Environments

### Development → Production
1. Generate new API keys for production
2. Create new Supabase project (or use prod database)
3. Update all environment variables
4. Test thoroughly before deploying

### Using `.env.example`
Keep `.env.example` with dummy values:
```
SUPABASE_URL=your_supabase_url_here
TATUM_API_KEY=your_tatum_api_key_here
```

This helps new developers know what's needed.

## Summary Checklist

- [ ] Copy `.env.example` to `.env.local`
- [ ] Set up Supabase and get keys
- [ ] Set up Tatum account and API key
- [ ] Set up Cashfree and get credentials
- [ ] Set up HyperVerge and get API key
- [ ] Generate JWT_SECRET with `openssl rand -base64 32`
- [ ] Test backend with `npm run dev`
- [ ] Test API endpoints with curl
- [ ] Verify all keys are working

---

For issues, check the logs:
```bash
npm run dev
# Check console for configuration errors
```
