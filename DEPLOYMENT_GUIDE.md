# 🚀 Shifting to Production Guide

This guide explains how to move your **YashoTech Fest 2K26** website from local development to a live production environment.

---

## 1️⃣ Frontend Deployment (React)

### Step 1: Build for Production
Run this command in your project root:
```bash
npm run build
```
This creates a `dist` folder containing your optimized website.

### Step 2: Deploy `dist` Folder
Upload the contents of the `dist` folder to your hosting provider (e.g., Netlify, Vercel, Hostinger).

### Step 3: Environment Variables
In your hosting dashboard, set this environment variable:
- `VITE_API_URL`: Your live backend URL (e.g., `https://yashotech-api.render.com/api`)

---

## 2️⃣ Backend Deployment (Node.js)

### Step 1: Upload Backend Code
Upload your `backend` folder to a Node.js hosting service (e.g., Render, Railway, Heroku, AWS).

### Step 2: Configure Environment Variables (CRITICAL)
Set these variables in your hosting dashboard. **Do NOT use a `.env` file in production.**

| Variable | Value Description |
|----------|-------------------|
| `NODE_ENV` | Set to `production` |
| `FRONTEND_URL` | **Must match your live frontend URL exactly** (e.g., `https://yashotech.netlify.app`). If this doesn't match, you will get CORS errors! |
| `DB_HOST` | Your production database host (e.g., AWS RDS, Clever Cloud) |
| `DB_USER` | Production database username |
| `DB_PASS` | Production database password |
| `DB_NAME` | Production database name |
| `RAZORPAY_KEY_ID` | **LIVE Key ID** (starts with `rzp_live_...`) |
| `RAZORPAY_KEY_SECRET` | **LIVE Key Secret** |

### Step 3: Start Command
Use this command to start your server:
```bash
npm start
```

---

## 3️⃣ Key Differences: Local vs Production

| Feature | Local (Development) | Production (Live) |
|---------|---------------------|-------------------|
| **Frontend URL** | `http://localhost:5173` | `https://your-website.com` |
| **Backend URL** | `http://localhost:5001` | `https://your-api.com` |
| **Razorpay Keys** | `rzp_test_...` (Fake money) | `rzp_live_...` (Real money) |
| **Database** | Local MySQL (XAMPP) | Cloud MySQL Database |

---

## ✅ Deployment Checklist
- [ ] Frontend built with `npm run build`
- [ ] Backend `FRONTEND_URL` matches your live site URL
- [ ] Razorpay keys switched to **LIVE** mode
- [ ] Production database connected

---

## 4️⃣ Final Submission / Handover (What to Send?)

If the deployment team asks for the **Full Source Code**:
1.  **Delete** the `node_modules` folder inside both the root folder and `backend` folder (they are huge and not needed).
2.  **Delete** the `dist` folder (they can rebuild it).
3.  **Zip the entire project folder** containing:
    - `src` (Frontend Code)
    - `public` (Assets)
    - `backend` (Backend Code)
    - `package.json` (Project settings)
    - `vite.config.js`
    - `.env` (Optional - Contains sensitive keys)

**Do NOT send:**
❌ `node_modules` (Heavy, they will install it themselves)
❌ `.git` folder (Version control history)

