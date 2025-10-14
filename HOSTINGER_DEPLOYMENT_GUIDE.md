# Hostinger Deployment Guide for SCOUT

## ✅ Step 1: Build Complete
Your production build is ready in the `dist` folder!

## 📦 Step 2: Prepare Files for Upload

Your production files are in: `SCOUT/dist/`

This includes:
- `index.html` - Main HTML file
- `assets/` folder - All CSS and JS files
- All image files from `public/` folder

## 🌐 Step 3: Upload to Hostinger

### Option A: Using Hostinger File Manager (Recommended for beginners)

1. **Log in to Hostinger**
   - Go to https://hostinger.com
   - Log in to your account
   - Go to "Hosting" section

2. **Access File Manager**
   - Click on your hosting plan
   - Click "File Manager" button
   - Navigate to `public_html` folder (or your domain's root folder)

3. **Clear Existing Files** (if any)
   - Delete all existing files in `public_html`
   - Keep `.htaccess` if it exists

4. **Upload Your Files**
   - Click "Upload Files" button
   - Select ALL files from your `SCOUT/dist` folder
   - **Important:** Upload the CONTENTS of dist folder, not the dist folder itself
   - Wait for upload to complete

### Option B: Using FTP (Recommended for frequent updates)

1. **Get FTP Credentials**
   - In Hostinger panel, go to "FTP Accounts"
   - Note down:
     - FTP Host (usually: ftp.yourdomain.com)
     - FTP Username
     - FTP Password
     - Port: 21

2. **Download FTP Client**
   - Download FileZilla: https://filezilla-project.org/
   - Install and open FileZilla

3. **Connect to Your Server**
   - Host: Your FTP host
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21
   - Click "Quickconnect"

4. **Upload Files**
   - On the left: Navigate to your `SCOUT/dist` folder
   - On the right: Navigate to `public_html`
   - Select all files from dist folder
   - Drag and drop to `public_html`

## 🔧 Step 4: Configure Hostinger for React Router

Since your app uses React Router, you need to create/update `.htaccess` file:

### Create .htaccess file in public_html:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

**How to create .htaccess:**
1. In File Manager, click "New File"
2. Name it `.htaccess`
3. Right-click and "Edit"
4. Paste the above content
5. Save

## 🔐 Step 5: Environment Variables (IMPORTANT!)

Your Supabase credentials are in `.env` file but won't work after deployment.

### Option A: Hostinger Environment Variables (If available)
1. Go to Hostinger panel
2. Find "Environment Variables" section
3. Add:
   - `VITE_SUPABASE_URL` = Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase Key

### Option B: Rebuild with Production Env (Recommended)
1. Create `.env.production` file in SCOUT folder:
   ```
   VITE_SUPABASE_URL=https://zhimjntgtpcypntgrjzf.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

2. Rebuild:
   ```bash
   npm run build
   ```

3. Re-upload the new dist files

## ✅ Step 6: Test Your Deployment

1. Visit your domain: `https://yourdomain.com`
2. Test all pages:
   - Home: `/`
   - Join Waitlist: `/join-waitlist`
   - Explore Nomad: `/explore-nomad`
   - Values: `/values-of-waitlist`

3. Test form submission
4. Check if progress bars work

## 🐛 Common Issues & Solutions

### Issue 1: Blank Page
**Solution:** Check browser console (F12) for errors. Usually missing .htaccess file.

### Issue 2: 404 on Page Refresh
**Solution:** Add .htaccess file (see Step 4)

### Issue 3: Form Not Submitting
**Solution:** Check if environment variables are set correctly

### Issue 4: Images Not Loading
**Solution:** Ensure all images from `public/` folder are uploaded

### Issue 5: CSS Not Loading
**Solution:** Clear browser cache (Ctrl + F5)

## 🔄 Future Updates

When you make changes:

1. Make changes to your code
2. Run `npm run build`
3. Upload new files from `dist` folder
4. Clear browser cache to see changes

## 📊 Quick Checklist

- [ ] Production build created (`npm run build`)
- [ ] All files uploaded to `public_html`
- [ ] `.htaccess` file created for routing
- [ ] Environment variables configured
- [ ] Tested home page
- [ ] Tested all routes
- [ ] Tested form submission
- [ ] Tested progress bar updates
- [ ] SCOUT logo navigation works

## 🎉 You're Done!

Your SCOUT app should now be live on Hostinger!

## 📞 Need Help?

If you encounter issues:
1. Check Hostinger's error logs (in control panel)
2. Check browser console (F12) for errors
3. Verify all files uploaded correctly
4. Ensure Supabase credentials are correct

