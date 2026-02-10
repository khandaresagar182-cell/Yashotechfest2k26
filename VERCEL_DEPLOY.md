# 🚀 YashoTech Fest 2K26 — Frontend Deployment Guide (Vercel)

> **Goal**: Deploy the React Frontend on **Vercel** for free.

---

## 1. Prepare for Deployment

Vercel usually auto-detects everything, but adding a `vercel.json` ensures it handles the routing correctly (for React Router).

**This file has already been created for you in the project root.**

---

## 2. Deploy to Vercel

1. **Push your code to GitHub** (if you haven't already).
2. Go to **[vercel.com/new](https://vercel.com/new)**.
3. Import your **Yashotechfest2k26** repository.
4. Vercel will auto-detect **Vite**.
5. In the **Environment Variables** section, add:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://<YOUR_RAILWAY_APP_URL>/api` |
   | `VITE_RAZORPAY_KEY_ID` | `rzp_test_RYS2wuO74mycmf` |

   > **Note**: You will get the `VITE_API_URL` *after* you deploy your backend on Railway. You can deploy Frontend first, then update this variable later in Vercel Settings.

6. Click **Deploy**.

---

## 3. Fix "404 Not Found" on Refresh

If you refresh a page like `/register` and get a 404 error, it means Vercel doesn't know to serve `index.html` for all routes.

**Fix**: Ensure `vercel.json` exists in your root folder (I have created it for you).

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
