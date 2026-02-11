# 🚂 YashoTech Fest 2K26 — Easy Railway Deployment Guide

> **Goal**: Deploy Backend & Database on **Railway** (easiest method) + Frontend on **Vercel** (fastest).

---

##  PART 1: Backend Deployment (Railway)

1. **Sign Up**: Go to **[railway.app](https://railway.app)** and login with GitHub.
2. **New Project**: Click **"New Project"** → **"Deploy from GitHub repo"**.
3. **Select Repo**: Choose your `Yashotechfest2k26` repository.
4. **Add Database**:
   - Right-click on the canvas (or click "New") → **Database** → **MySQL**.
   - It will create a MySQL service for you.

5. **Connect Backend to Database**:
   - Click on your **Backend Service** card.
   - Go to **Variables** tab.
   - Add these variables (copy values from the **MySQL Service** card → **Connect** tab):
     - `DB_HOST`: (MySQL Host)
     - `DB_PORT`: (MySQL Port)
     - `DB_USER`: (MySQL User)
     - `DB_PASS`: (MySQL Password)
     - `DB_NAME`: (MySQL Database Name)
     - `PORT`: `5001` (Railway provides `PORT`, but good to set default)
     - `JWT_SECRET`: (Any random string)
     - `RAZORPAY_KEY_ID`: `rzp_test_RYS2wuO74mycmf`
     - `RAZORPAY_KEY_SECRET`: `BK5sUw8xJebBWJ1g2GFu1y30`
     - `FRONTEND_URL`: `https://yashotech.vercel.app` (We will get this later)

6. **Start Command**:
   - Go to **Settings** → **Build & Deploy**.
   - **Root Directory**: `backend` (Important! because your backend is in a subfolder).
   - **Start Command**: `npm start`

7. **Deploy**: It should auto-deploy. Wait for the green checkmark ✅.
8. **Get URL**: Go to **Settings** → **Networking** → **Generate Domain**.
   - Copy this URL (e.g., `https://backend-production.up.railway.app`).

---

## PART 2: Frontend Deployment (Vercel)

1. **Sign Up**: Go to **[vercel.com](https://vercel.com)** and login with GitHub.
2. **Add New**: Click **"Add New..."** → **"Project"**.
3. **Import Repo**: Import `Yashotechfest2k26`.
4. **Configure Project**:
   - **Framework Preset**: Vite (should auto-detect).
   - **Root Directory**: Click "Edit" and select `Yashotechfest2k26-source` (the folder containing `vite.config.js`).
5. **Environment Variables**:
   - `VITE_API_URL`: Paste your **Railway Backend URL** + `/api` (e.g., `https://backend-production.up.railway.app/api`).
   - `VITE_RAZORPAY_KEY_ID`: `rzp_test_RYS2wuO74mycmf`
6. **Deploy**: Click **"Deploy"**.

---

## PART 3: Final Connection

1. Copy your new **Vercel Domain** (e.g., `https://yashotech-fest.vercel.app`).
2. Go back to **Railway** → Backend Service → **Variables**.
3. Update `FRONTEND_URL` to your actual Vercel domain.
4. Railway will auto-redeploy.

---

## ✅ Done!
Your website is live!
- Frontend: `https://yashotech-fest.vercel.app`
- Backend: `https://backend-production.up.railway.app`

---

## ⚠️ CRITICAL: Will it go offline?

### Railway (Backend)
- **YES**, your backend WILL STOP if you run out of trial credits ($5).
- **Recommendation**: For a live event, **add a credit card** to upgrade to the "Hobby" plan. It costs ~$5/month but ensures your site stays online 24/7.
- Check your usage at [railway.app/settings](https://railway.app/settings).

### Vercel (Frontend)
- **NO**, Vercel's free tier is very generous.
- Unless you have millions of visitors, it will stay online forever.
