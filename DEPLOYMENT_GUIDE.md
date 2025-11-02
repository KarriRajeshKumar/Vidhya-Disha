# 🚀 Deployment Guide for Vidhya Disha

This guide will help you deploy your Vidhya Disha application to Vercel.

## 📋 Prerequisites

- GitHub account (you already have this: KarriRajeshKumar)
- Vercel account (free tier is sufficient)
- Google account (for Gemini API key)

---

## 🎯 Option 1: Deploy via Vercel Dashboard (Recommended)

This is the **easiest** method and requires no command line:

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (easier since your repo is already on GitHub)
4. Authorize Vercel to access your GitHub

### Step 2: Import Your Project

1. After logging in, click **"Add New..."** → **"Project"**
2. You'll see your GitHub repositories listed
3. Click **"Import"** next to **"Vidhya-Disha"**
4. Configure settings:
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**

### Step 3: Configure Environment Variables

After deployment (usually takes 1-2 minutes), you need to add environment variables:

1. Go to your project dashboard on Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Add these variables:

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**To get your Gemini API Key:**
- Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- Sign in with your Google account
- Click "Create API Key"
- Copy the key and paste it in Vercel

4. Click **"Save"**
5. Go to **"Deployments"** tab
6. Click the **"..."** menu on the latest deployment
7. Click **"Redeploy"**

### Step 4: Get Your Live URL

After redeployment completes, your site will be live at:
**`https://vidhya-disha.vercel.app`** (or a custom URL Vercel generates)

---

## 🎯 Option 2: Deploy via Vercel CLI (Advanced)

If you prefer using the command line:

### Step 1: Login to Vercel

```bash
vercel login
```

This will open a browser for authentication.

### Step 2: Deploy

```bash
vercel --prod
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No (first time)
- **Project name?** → vidhya-disha (or press Enter)
- **Directory?** → Press Enter
- **Override settings?** → No

### Step 3: Set Environment Variables

```bash
vercel env add VITE_GEMINI_API_KEY production
```

Enter your Gemini API key when prompted.

### Step 4: Redeploy with Environment Variables

```bash
vercel --prod
```

---

## 🔧 Environment Variables Reference

| Variable | Description | Required | Where to Get |
|----------|-------------|----------|--------------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key for AI features | No* | [Google AI Studio](https://makersuite.google.com/app/apikey) |

*Without this key, the AI Mentor will use local fallback responses.

---

## ✅ After Deployment

1. **Test your site**: Visit the URL Vercel provides
2. **Custom Domain** (Optional): Add your domain in Project Settings → Domains
3. **Auto-Deploy**: Every push to `main` branch will auto-deploy
4. **Preview Deployments**: Pull requests get preview URLs automatically

---

## 🐛 Troubleshooting

### Build Fails

**Error**: "Module not found"
- **Solution**: Make sure all dependencies are in `package.json`

**Error**: "Build command failed"
- **Solution**: Check the build logs in Vercel dashboard

### Site Works but AI Features Don't

**Problem**: AI Mentor not responding
- **Solution**: 
  1. Verify `VITE_GEMINI_API_KEY` is set in Environment Variables
  2. Redeploy after adding environment variable
  3. Check browser console for errors (F12)

### Routes Return 404

**Problem**: Direct URL access shows 404
- **Solution**: Already fixed! `vercel.json` handles SPA routing

---

## 📱 Mobile Testing

Test your deployed site on mobile:
1. Open the Vercel URL on your phone
2. Or scan the QR code from Vercel dashboard

---

## 🔄 Updating Your Site

Every time you push to GitHub:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Vercel will automatically:
1. Detect the push
2. Build your site
3. Deploy the new version
4. Update your live URL

---

## 🎉 Success!

Your Vidhya Disha platform is now live on the internet! 🚀

Share your URL with users:
**`https://vidhya-disha.vercel.app`**

---

## 💡 Tips

- **Free tier**: 100GB bandwidth/month (plenty for getting started)
- **Custom domain**: Free SSL certificates included
- **Analytics**: Enable in Vercel dashboard for visitor insights
- **Speed**: Your site is globally distributed via CDN

---

## 📞 Need Help?

- Vercel Docs: https://vercel.com/docs
- Community: https://github.com/vercel/vercel/discussions
- Support: Available in Vercel dashboard

