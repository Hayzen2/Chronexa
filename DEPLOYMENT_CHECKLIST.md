# 🚀 Chronexa Deployment Checklist

Complete this checklist to deploy your Chronexa app to production using Vercel + Railway.

## Phase 1: Preparation (5 minutes)

- [ ] Code is committed and pushed to GitHub (`main` branch)
- [ ] All environment variables documented in `.env.production.example`
- [ ] README.md is up-to-date with setup instructions
- [ ] `.github/workflows/deploy.yml` is in your repository
- [ ] `vercel.json` is in your repository
- [ ] `railway.json` is in your repository

**Verify with:**
```bash
git push origin main
git log --oneline -5  # Latest commit should be deployment config
```

---

## Phase 2: Vercel Setup (10 minutes)

### Step 1: Create Vercel Account & Project
- [ ] Sign up at [vercel.com](https://vercel.com) with GitHub
- [ ] Click **"Add New"** → **"Project"**
- [ ] Import your **Chronexa** repository
- [ ] Framework Preset: **Vite**
- [ ] Root Directory: **./client**
- [ ] Click **"Deploy"**

### Step 2: Add Environment Variables to Vercel
- [ ] Go to Project Settings → **Environment Variables**
- [ ] Add `VITE_BACKEND_URL` = `https://your-backend.up.railway.app/api`
  - *(You'll get this URL from Railway in Phase 3)*
- [ ] Save and redeploy

### Step 3: Get Vercel Secrets for CI/CD
- [ ] Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
- [ ] Create new token → Copy it
- [ ] Note down:
  - [ ] **Project ID** (from Project Settings → General)
  - [ ] **Org ID** (from account settings)

---

## Phase 3: Railway Setup (15 minutes)

### Step 1: Create Railway Project
- [ ] Sign up at [railway.app](https://railway.app) with GitHub
- [ ] Click **"+ New Project"** → **"Deploy from GitHub"**
- [ ] Select **Chronexa** repository
- [ ] Choose **root** directory (`.`)

### Step 2: Configure Backend Service
- [ ] Railway creates a service automatically
- [ ] Rename it to: **chronexa-backend**
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm run server`
- [ ] Click **"Deploy"**

### Step 3: Add PostgreSQL Database
- [ ] Click **"+ Add Service"** → **"Database"** → **"PostgreSQL"**
- [ ] Railway auto-generates connection string
- [ ] Variable name will be: `DATABASE_URL`
- [ ] Should auto-link to backend service

### Step 4: Add Redis Cache
- [ ] Click **"+ Add Service"** → **"Cache"** → **"Redis"**
- [ ] Auto-generates connection string
- [ ] Variable name: `REDIS_URL`
- [ ] Auto-linked to backend

### Step 5: Add Environment Variables to Railway
- [ ] Go to your Railway project → **Variables**
- [ ] Add these *exactly* as shown in `.env.production.example`:
  - [ ] `NODE_ENV=production`
  - [ ] `BACKEND_PORT=3000`
  - [ ] `DB_SYNCHRONIZE=false`
  - [ ] `JWT_REFRESH_SECRET=<generate random 32+ char string>`
  - [ ] `JWT_ACCESS_SECRET=<generate random 32+ char string>`
  - [ ] `SMTP_HOST=smtp.gmail.com`
  - [ ] `SMTP_PORT=587`
  - [ ] `SMTP_USER=<your email>`
  - [ ] `SMTP_PASS=<your 16-char Gmail app password>`
  - [ ] `MAIL_FROM=Chronexa <noreply@chronexa.com>`
  - [ ] `FRONTEND_URL=<your Vercel URL>`
  - [ ] `OBJECT_STORAGE_*` (for MinIO)

### Step 6: Get Railway Backend URL
- [ ] Click on **chronexa-backend** service
- [ ] Find **Public URL** (e.g., `https://chronexa-backend.up.railway.app`)
- [ ] Copy this URL and update Vercel's `VITE_BACKEND_URL` variable

### Step 7: Generate Gmail App Password
- [ ] Enable 2FA on your Gmail account (settings → security)
- [ ] Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
- [ ] Select Mail → Other (custom name)
- [ ] Copy 16-character password
- [ ] Add as `SMTP_PASS` in Railway variables

### Step 8: Get Railway Token for CI/CD
- [ ] Go to [railway.app/account/tokens](https://railway.app/account/tokens)
- [ ] Create new token
- [ ] Copy the token

---

## Phase 4: GitHub Actions Secrets (5 minutes)

### Step 1: Add Secrets to GitHub
- [ ] Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
- [ ] Click **"New repository secret"** and add:

| Secret Name | Value |
|-------------|-------|
| `VERCEL_TOKEN` | Your Vercel token from Phase 2 |
| `VERCEL_ORG_ID` | Your Vercel Org ID from Phase 2 |
| `VERCEL_PROJECT_ID` | Your Vercel Project ID from Phase 2 |
| `RAILWAY_TOKEN` | Your Railway token from Phase 3 |

---

## Phase 5: Test Deployment (10 minutes)

### Step 1: Trigger Deployment
- [ ] Make a small change to your code (e.g., update README)
- [ ] Commit and push: `git push origin main`
- [ ] GitHub Actions automatically runs CI/CD

### Step 2: Monitor Deployment Progress
- [ ] **GitHub Actions**: Repo → Actions tab → Watch workflow run
- [ ] **Vercel**: Dashboard → Deployments → Should show new deployment
- [ ] **Railway**: Project → Deployments → Should show new build

### Step 3: Verify Live App
- [ ] Frontend loads: https://your-chronexa.vercel.app
- [ ] Backend responds: https://your-backend.up.railway.app/health
- [ ] Try registering a new account
- [ ] Verify email notification works
- [ ] Create a task and verify it saves

### Step 4: Check Logs for Errors
- [ ] Vercel Logs: Dashboard → Deployments → Click latest → View logs
- [ ] Railway Logs: Project → Backend service → Deployments → View logs
- [ ] Look for connection errors or missing variables

---

## Phase 6: Post-Deployment (5 minutes)

### Security
- [ ] Verify no secrets committed to git: `git log -p | grep -E "(SECRET|PASSWORD|PASS)"`
- [ ] All sensitive values only in Vercel/Railway dashboards
- [ ] Enable **branch protection** on GitHub (require checks before merge)

### Monitoring
- [ ] Set up error alerts in Vercel (optional)
- [ ] Set up monitoring in Railway (optional)
- [ ] Test automated redeploy on next commit

### Custom Domain (Optional)
- [ ] Buy domain from registrar (Namecheap, GoDaddy, etc.)
- [ ] In Vercel Settings → Domains → Add custom domain
- [ ] Follow DNS configuration steps provided by Vercel

---

## 🎯 Success Criteria

Your deployment is successful when:

- ✅ Frontend loads without errors at `https://your-chronexa.vercel.app`
- ✅ Login/Register works and emails send
- ✅ Tasks create/update/delete successfully
- ✅ Every `git push main` auto-deploys within 2-3 minutes
- ✅ No sensitive data in GitHub repository
- ✅ Logs show no persistent errors

---

## 🆘 If Something Goes Wrong

### Deployment Fails
1. Check GitHub Actions logs → Click failed workflow → View full output
2. Check Vercel build logs → Recent deployment
3. Check Railway build logs → Service deployments

### Frontend Blank Page
1. Open DevTools (F12) → Console tab
2. Check if `VITE_BACKEND_URL` is set correctly
3. Verify backend service is running in Railway

### Backend Connection Error
1. Check PostgreSQL in Railway → Running?
2. Verify `DATABASE_URL` variable is set
3. Check logs for actual error message: `npm run server` locally with same env vars

### Email Not Sending
1. Verify Gmail 2FA is enabled
2. Check app password is correct (not regular password)
3. Verify `SMTP_*` variables match exactly

---

## 📚 Helpful Resources

- [Vercel Deployment Docs](https://vercel.com/docs/concepts/deployments/overview)
- [Railway Docs](https://railway.app/docs)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Troubleshooting Guide](./DEPLOYMENT.md#-troubleshooting)

---

## ✨ Your Deployment is Live!

Share your app: **https://your-chronexa.vercel.app**

Every push to `main` branch automatically updates your live app! 🚀

