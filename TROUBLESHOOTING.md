# Troubleshooting Guide

## Quick Fixes

### "Setup script won't run"
If you get an execution policy error when running `.ps1` files:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then run setup again:
```powershell
.\setup.ps1
```

### "npm: command not found"
Node.js isn't installed. Download and install from: https://nodejs.org

### "Backend won't start (port 3000 in use)"
Another process is using port 3000:

```powershell
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with the number shown)
taskkill /PID <PID> /F

# Then restart backend
.\start-backend.ps1
```

Or use a different port:
```powershell
cd backend
PORT=3001 npm run dev
```

### ".env.local is not being read"
1. Make sure file is in `backend/.env.local` (not `backend/.env`)
2. Restart the backend server after changing .env.local
3. Check that .env.local has `KEY=value` format (no spaces around =)

### "API calls returning 401 Unauthorized"
JWT token is missing or expired:

1. Login again at http://localhost:5500 (the login flow generates a new token)
2. Check that `Authorization: Bearer <token>` header is sent
3. Verify JWT_SECRET in .env.local matches what was generated

### "CORS errors when calling backend from frontend"
Make sure backend is running at http://localhost:3000

Add this to `next.config.js` in backend if needed:
```javascript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PATCH,DELETE,OPTIONS' },
      ],
    },
  ];
},
```

### "TypeError: fetch is not defined"
In Node.js, you may need to use a polyfill:

```bash
npm install --save isomorphic-fetch
```

Then add to the top of files that use fetch:
```javascript
import fetch from 'isomorphic-fetch';
```

---

## Database Issues

### "Supabase connection failed"
1. Check SUPABASE_URL in .env.local is correct
2. Check SUPABASE_SERVICE_ROLE_KEY is correct (must be service role, not anon)
3. Make sure you've run the SQL schema from `migrations/001_init_schema.sql`
4. Try pinging Supabase: `curl https://your-project.supabase.co/rest/v1/users?limit=1`

### "SQL migration failed"
1. Copy SQL from `backend/migrations/001_init_schema.sql`
2. In Supabase dashboard: Go to SQL Editor → New Query
3. Paste the entire SQL file
4. Click "Run"
5. Check for error messages

### "Row Level Security (RLS) errors"
If you see "new row violates row-level security policy":

1. Make sure you're authenticated (have a valid JWT token)
2. Check that the JWT contains the correct `sub` (user ID)
3. Verify RLS policies in Supabase allow the operation
4. In development, you can temporarily disable RLS in Supabase UI (not recommended for production)

---

## Third-Party Integration Issues

### "Tatum.io integration not working"
1. Verify API_KEY_TATUM is correct from https://tatum.io
2. Make sure you're on the right testnet (not mainnet)
3. Check Tatum API status: https://status.tatumio.com/
4. For USDT on TRON: use network='TRON' and currency='USDT'

### "Cashfree integration not working"
1. Get CLIENT_ID and CLIENT_SECRET from https://cashfree.com
2. Make sure you're using the right environment (TEST vs PRODUCTION)
3. Check webhook is configured in Cashfree dashboard
4. For testing, use test phone numbers: 9999999999

### "HyperVerge KYC not working"
1. Get credentials from https://hyperverge.co
2. Make sure app_id and app_key are correct
3. Images must be base64 encoded
4. Document types: PASSPORT, AADHAR, DRIVER_LICENSE, PAN

### "CoinGecko price API returns error"
1. No API key needed for CoinGecko (it's free)
2. Rate limit: 10-50 calls/minute
3. If getting 429 error, implement exponential backoff
4. Use cache: we cache prices for 5 minutes by default

---

## Frontend Issues

### "Frontend won't load"
1. Make sure Python is installed: `python --version`
2. Or use npx: `npx http-server -p 5500`
3. Check you're opening http://localhost:5500 (not file://)

### "API calls show 404 errors"
1. Make sure backend is running: `.\start-backend.ps1`
2. Check frontend is calling http://localhost:3000/api (not localhost:5500/api)
3. Verify API route file exists: `backend/src/app/api/route-name/route.ts`

### "localStorage not persisting tokens"
1. Check that you're not in private/incognito mode
2. Verify browser allows localStorage (check dev tools → Application → Storage)
3. Check that token is being saved: `console.log(localStorage.getItem('authToken'))`

### "Form validation not working"
1. Check browser console for JavaScript errors
2. Make sure `src/api/client.js` is loaded
3. Verify email/password meet minimum requirements:
   - Email: valid email format
   - Password: minimum 6 characters

---

## Performance Issues

### "Backend is slow"
1. Check if database queries are slow: add logging to Supabase
2. Reduce data fetching: use pagination for large datasets
3. Enable Redis caching (optional, in .env.local)
4. Check Network tab in Dev Tools to see response times

### "Memory leak / Backend crashes"
1. Check backend logs for errors
2. Reduce cache size if using Redis
3. Make sure connections are being closed properly
4. Monitor Node process: `node --inspect backend/src/main.js`

### "High latency to third-party APIs"
1. Use edge functions or CDN if available
2. Cache external API responses aggressively
3. Add timeout limits to external calls
4. Consider regional API endpoints if available

---

## Development Environment

### "TypeScript compilation errors"
1. Run: `npm run type-check` in backend/
2. Check tsconfig.json is correct
3. Install type definitions: `npm install --save-dev @types/node`
4. Restart your IDE

### "ESLint/Prettier issues"
1. Run: `npm run lint` to see all errors
2. Run: `npm run lint:fix` to auto-fix
3. Make sure .eslintrc.js and .prettierrc exist

### "Module not found errors"
1. Check import path is correct
2. Make sure file exists at the path
3. For @/ imports, verify tsconfig.json paths are set
4. Clear node_modules and reinstall: `rm -r node_modules && npm install`

---

## Deployment Issues

### "Vercel deployment fails"
1. Check build logs in Vercel dashboard
2. Make sure all environment variables are set in Vercel
3. Verify NODE_ENV=production is set
4. Check for any hardcoded localhost URLs

### "API works locally but not on Vercel"
1. Database may not be accessible from Vercel region
2. External APIs (Tatum, Cashfree) may have IP whitelist
3. Check SUPABASE_URL has correct region
4. Check logs in Vercel function logs

---

## Getting Help

1. **Check the logs**: Backend logs in terminal, Frontend logs in Dev Tools
2. **Read the documentation**:
   - backend/API_DOCUMENTATION.md - Full API reference
   - backend/SETUP_GUIDE.md - Complete setup guide
   - backend/ENV_VARIABLES.md - Configuration help
3. **Common issues**: This file
4. **Test the API**: Use curl or Postman to test endpoints
5. **Check status pages**: Supabase, Tatum, Cashfree, HyperVerge

---

## Test Commands

```bash
# Test price endpoint (public, no auth needed)
curl http://localhost:3000/api/price

# Test auth endpoint
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","action":"login"}'

# Test protected endpoint (requires token)
curl http://localhost:3000/api/wallet \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"

# Check if backend is responsive
curl http://localhost:3000/healthz
```

---

## Still Having Issues?

1. Run the test script: `.\test.ps1`
2. Check all required files exist
3. Review .env.local for missing keys
4. Check terminal output for error messages
5. Try the setup script again: `.\setup.ps1`
6. Read the API_DOCUMENTATION.md for more details
