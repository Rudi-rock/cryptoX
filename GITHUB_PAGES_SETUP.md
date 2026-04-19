# GitHub Pages Deployment Guide

## ✅ What's Been Set Up

### Frontend (GitHub Pages)
- **Repository**: https://github.com/Rudi-rock/cryptoX
- **Live URL**: https://Rudi-rock.github.io/cryptoX (will be live once workflow runs)
- **Build Process**: Automatic via GitHub Actions on every push
- **Branch**: Deploys from `gh-pages` branch (auto-generated)

### Backend (Vercel)
- **Production URL**: https://backend-nine-nu-98.vercel.app
- **API Endpoints**: `/api/*` routes
- **Auto-deployment**: Configured for automatic updates on push

## 🚀 Enabling GitHub Pages

1. Go to: https://github.com/Rudi-rock/cryptoX/settings/pages
2. Under **Build and deployment**:
   - Source: Select **Deploy from a branch**
   - Branch: Select **gh-pages** (will appear after first workflow run)
   - Folder: Select **/ (root)**
3. Click **Save**

The workflow will:
1. Automatically build the frontend on every push to `main`
2. Deploy to the `gh-pages` branch
3. Make it available at: **https://Rudi-rock.github.io/cryptoX/**

## 🔄 Current Architecture

```
┌─────────────────────────────────────────────────────┐
│          GitHub Pages                                │
│  https://Rudi-rock.github.io/cryptoX                │
│  (Built from /dist folder)                          │
└──────────────────┬──────────────────────────────────┘
                   │ API Calls
                   ▼
┌─────────────────────────────────────────────────────┐
│          Vercel Backend                              │
│  https://backend-nine-nu-98.vercel.app/api          │
│  - Authentication                                   │
│  - Order Management                                 │
│  - Wallet Operations                                │
│  - P2P Trading                                      │
│  - KYC Verification                                │
└─────────────────────────────────────────────────────┘
```

## 📋 Deployment Status

- ✅ **Backend**: Deployed to Vercel
- ✅ **Frontend Build**: Configured for GitHub Pages
- ⏳ **GitHub Pages**: Workflow running (check Actions tab)
- ⏳ **Live Site**: Will be available at https://Rudi-rock.github.io/cryptoX/

## 🔧 Manual Build/Deploy

If you need to manually build the frontend:

```bash
npm install
npm run build
```

The `dist/` folder contains the production-ready frontend.

## 📝 Configuration Files

- **`.github/workflows/pages.yml`** - Automated build & deploy to GitHub Pages
- **`.github/workflows/deploy.yml`** - Backend auto-deployment to Vercel
- **`vite.config.js`** - Base path set to `/cryptoX/` for GitHub Pages
- **`src/api/client.js`** - API points to production backend on Vercel

## ⚡ Next Steps

1. **Verify GitHub Pages Enabled**: Go to repo settings → Pages
2. **Check Workflow Status**: Go to Actions tab in GitHub
3. **Add Environment Variables to Vercel**: Configure real credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `TATUM_API_KEY`
   - `CASHFREE_CLIENT_ID`
   - `CASHFREE_CLIENT_SECRET`
   - `HYPERVERGE_API_KEY`
   - `JWT_SECRET`

4. **Custom Domain** (Optional): Add a custom domain in GitHub Pages settings

## 🐛 Troubleshooting

**Pages not building?**
- Check Actions tab: https://github.com/Rudi-rock/cryptoX/actions
- Verify `.github/workflows/pages.yml` exists and is valid

**API calls failing?**
- Verify Vercel backend is running
- Check browser console for CORS errors
- Confirm API base URL in `src/api/client.js`

**Build failures?**
- Run `npm install` locally
- Check `npm run build` output for errors
- Verify Node.js version (18+)
