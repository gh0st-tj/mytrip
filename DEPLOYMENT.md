# 🚀 Deployment Guide

## Deploy to GitHub Pages

Your Italy Trip Planner is configured for automatic deployment to GitHub Pages!

### ✅ What's Already Configured:

1. **Vite Config**: Base path set to `/mytrip/`
2. **GitHub Actions**: Automatic deployment workflow created
3. **Deploy Script**: `npm run deploy` command available
4. **Dependencies**: `gh-pages` package included

---

## 🎯 One-Time Setup (After Pushing to GitHub)

### Enable GitHub Pages:

1. Go to your repository: https://github.com/gh0st-tj/mytrip
2. Click **Settings** tab
3. Scroll to **Pages** section (left sidebar)
4. Under **Source**, select:
   - Source: **GitHub Actions** (recommended)
5. Save

That's it! Every push to `main` will auto-deploy.

---

## 📦 Deployment Methods

### Method 1: Automatic (Recommended)
**After initial push, deployment is automatic!**

```bash
git add .
git commit -m "Update trip plans"
git push
```

GitHub Actions will:
1. Detect the push
2. Build your app
3. Deploy to GitHub Pages
4. Available at: https://gh0st-tj.github.io/mytrip/

**Wait 2-3 minutes** after pushing for deployment to complete.

### Method 2: Manual Deploy Script
If you prefer manual control:

```bash
npm run deploy
```

This will:
1. Build the production version
2. Deploy to `gh-pages` branch
3. Update your live site

---

## 🌐 Your Live URL

After deployment, your app will be available at:

**https://gh0st-tj.github.io/mytrip/**

---

## 📝 Deployment Checklist

Before your first deployment:

- [x] Vite config updated with base path
- [x] GitHub Actions workflow created
- [x] .gitignore configured
- [x] Deploy script added
- [ ] Push to GitHub
- [ ] Enable GitHub Pages in settings
- [ ] Wait for first deployment
- [ ] Visit your live site!

---

## 🔄 Updating Your Site

### For New Features:
```bash
# Make your changes
git add .
git commit -m "Add new feature"
git push
# Wait 2-3 minutes, site updates automatically!
```

### For Bug Fixes:
```bash
# Fix the bug
git add .
git commit -m "Fix: description of fix"
git push
# Auto-deploys in ~3 minutes
```

---

## 🐛 Troubleshooting

### Site not deploying?
1. Check Actions tab in GitHub repo
2. Look for failed workflows
3. Check build logs
4. Verify GitHub Pages is enabled

### 404 Error?
- Ensure base path is `/mytrip/` in vite.config.ts
- Check that repository name matches
- Wait a few minutes after deployment

### Old version showing?
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Clear browser cache
- Try incognito/private mode

---

## 📱 Sharing Your Trip

Once deployed, you can:
- Share the URL with family/friends
- Access from any device
- Bookmark on phone home screen
- Works offline after first visit (PWA-ready)

---

## 🎨 Custom Domain (Optional)

Want a custom domain like `italy-trip.com`?

1. Buy domain from registrar
2. Add CNAME file to `/public`:
   ```
   your-domain.com
   ```
3. Configure DNS:
   - Add CNAME record pointing to `gh0st-tj.github.io`
4. Update in GitHub Pages settings

---

## 💾 Data Persistence Note

**Important**: 
- GitHub Pages only hosts the **app code**
- User data (photos, notes, journal) is stored in **browser localStorage**
- Each user's data is local to their browser
- No backend/database (yet!)

**For multi-device sync**, consider future features:
- Firebase integration
- Supabase backend
- Export/import functionality

---

## 🚀 Ready to Deploy!

Run these commands to push to GitHub:

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Italy trip planner with notes, photos, timeline, and map"

# Set main branch
git branch -M main

# Add remote
git remote add origin https://github.com/gh0st-tj/mytrip.git

# Push
git push -u origin main
```

After pushing, check:
1. **Actions tab** to see deployment progress
2. **Settings → Pages** to enable GitHub Pages (if not auto-enabled)
3. **Wait ~3 minutes** for first deployment
4. **Visit**: https://gh0st-tj.github.io/mytrip/

---

## 🎉 Success!

Your Italy Trip Planner will be live and accessible from anywhere!

Share it with Tom & Alina, plan your trip together, and have an amazing time in Italy! 🇮🇹✨
