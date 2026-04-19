# GitHub Repository Setup & Deployment Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Enter repository name: `cryptosolve` (or your preferred name)
3. Add description: "USDT/INR Cryptocurrency Exchange Platform"
4. Choose:
   - **Public** (if you want it open-source)
   - **Private** (if for personal/business use)
5. ⚠️ **Do NOT initialize with README** (we have one)
6. Click "Create repository"

## Step 2: Configure Git Locally

```powershell
# Set your git identity if not done before
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 3: Push to GitHub

```powershell
# Navigate to project
cd c:\Users\rudra\OneDrive\Desktop\cryptosolve

# Add all files
git add .

# Commit
git commit -m "Initial commit: CryptoSolve platform with 10 API endpoints, Supabase, and full frontend"

# Add remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/cryptosolve.git

# Rename branch to main if needed
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 4: Add GitHub Secrets (for Deployment)

1. Go to your GitHub repo
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add these secrets (for Vercel deployment):

```
VERCEL_TOKEN          = (get from vercel.com/account/tokens)
VERCEL_PROJECT_ID     = (get from vercel project settings)
VERCEL_ORG_ID         = (get from vercel account settings)
SUPABASE_URL          = your-supabase-url
SUPABASE_KEY          = your-supabase-key
API_KEY_TATUM         = your-tatum-key
CASHFREE_CLIENT_ID    = your-cashfree-id
CASHFREE_CLIENT_SECRET= your-cashfree-secret
HYPERVERGE_APP_ID     = your-hyperverge-id
HYPERVERGE_APP_KEY    = your-hyperverge-key
```

## Step 5: Set Up Auto-Deployment

### Option A: Vercel (Recommended for Backend)

```powershell
# Install Vercel CLI
npm install -g vercel

# Deploy from backend directory
cd backend
vercel
# Follow prompts to connect GitHub repo
```

**Result:** Backend auto-deploys on every push to `main`

### Option B: Docker Deployment

Push Docker image to Docker Hub or GitHub Container Registry:

```powershell
# Login to Docker Hub
docker login

# Build and tag
docker build -t yourusername/cryptosolve:latest ./backend

# Push
docker push yourusername/cryptosolve:latest
```

Then deploy with:
```bash
docker run -p 3000:3000 \
  -e SUPABASE_URL=your-url \
  -e SUPABASE_SERVICE_ROLE_KEY=your-key \
  yourusername/cryptosolve:latest
```

### Option C: Traditional Server

1. SSH into server
2. `git clone https://github.com/yourusername/cryptosolve.git`
3. `cd cryptosolve/backend`
4. `npm install`
5. Set `.env` variables
6. `npm start` (or use PM2: `pm2 start npm --name cryptosolve -- start`)

## Step 6: Enable GitHub Actions

1. Go to repo → Actions tab
2. CI/CD workflows should auto-activate
3. Tests run on every push
4. Deployment runs on push to `main`

## Step 7: Monitor Deployments

### View GitHub Actions
- Repo → Actions tab
- See test/build/deploy status

### View Vercel Deployments
- vercel.com dashboard
- See deployment logs
- View live URL

## Automatic Startup Options

### Local Development (Windows)

**Quick start with Docker:**
```powershell
docker-compose up
```

**Or native:**
```powershell
.\start-all.ps1
```

### Production (Server)

**With Docker:**
```bash
docker-compose -f docker-compose.yml up -d
```

**With systemd (Linux):**
Create `/etc/systemd/system/cryptosolve.service`:
```ini
[Unit]
Description=CryptoSolve Platform
After=network.target

[Service]
Type=simple
User=cryptosolve
WorkingDirectory=/opt/cryptosolve
ExecStart=/usr/bin/node /opt/cryptosolve/backend/dist/server.js
Restart=on-failure
Environment="NODE_ENV=production"

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl enable cryptosolve
sudo systemctl start cryptosolve
```

**With PM2 (Any OS):**
```bash
npm install -g pm2

# Start
pm2 start "npm --prefix backend run start" --name cryptosolve

# Auto-restart on reboot
pm2 startup
pm2 save
```

## Environment Files

### For Vercel
Set all variables in: Settings → Environment Variables

### For Docker
Create `.env.production`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-key
JWT_SECRET=your-secret
API_KEY_TATUM=your-key
CASHFREE_CLIENT_ID=your-id
CASHFREE_CLIENT_SECRET=your-secret
HYPERVERGE_APP_ID=your-id
HYPERVERGE_APP_KEY=your-key
NODE_ENV=production
```

### For Server
`.env.local` in `/opt/cryptosolve/backend/`

## CI/CD Pipeline

Your workflows run automatically:

1. **On every push:**
   - ✅ Install dependencies
   - ✅ Type checking
   - ✅ Build check
   - ✅ Build Docker image

2. **On push to main:**
   - 🚀 Deploy to Vercel
   - 🐳 Push Docker image (optional)

## Monitoring

### GitHub Actions
```powershell
# View recent runs
gh run list

# View specific run
gh run view <run-id>
```

### Vercel
```powershell
# View deployments
vercel projects

# View logs
vercel logs cryptosolve
```

## Database Migrations

For production:

1. Create Supabase project
2. Run SQL from `backend/migrations/001_init_schema.sql`
3. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in environment

## Troubleshooting Deployment

### GitHub Actions fails
- Check logs: Repo → Actions → failed workflow
- Verify secrets are set correctly
- Check Node.js version compatibility

### Vercel deployment fails
- Check build settings
- Verify environment variables
- Review Vercel logs: `vercel logs --follow`

### Docker issues
- `docker ps` - see running containers
- `docker logs <container>` - see logs
- `docker-compose logs -f` - follow logs

## Quick Reference

```powershell
# Local development
git pull                    # Get latest code
.\start-all.ps1             # Start both services
# Visit http://localhost:5500

# Push changes
git add .
git commit -m "Your message"
git push                    # Auto-deploys to Vercel

# Check deployment
gh run list                 # GitHub Actions status
# Or visit GitHub Actions tab

# Production
docker-compose up -d        # Start with Docker
# Or vercel deploy --prod
```

## Support

- 📖 See REPO_README.md
- 🐛 Check GitHub Issues
- 📝 Read SETUP_GUIDE.md
