# Hafezy Quran Official Website

Static bilingual (English/Bengali) website using HTML, CSS and vanilla JavaScript. No build process, backend, or framework is required.

## Domain
Production domain: **https://hafezyquran.xyz**

## Deploy to GitHub Pages
1. Upload the contents of this folder to the website repository.
2. In GitHub, open **Settings → Pages**, select the deployment branch and root folder.
3. Keep `CNAME` at the published root (`hafezyquran.xyz`).
4. Configure DNS at your domain provider for GitHub Pages, then enable HTTPS.
5. Test every page, both languages, theme toggle, keyboard navigation and all links.

## Configure before release
Edit `js/config.js`:
- `apkDownloadUrl` is set to `https://app.hafezyquran.xyz/apps/Hafezy-Quran.apk`
- Set `googlePlayUrl` when the Play listing is live
- Screenshots are configured under `assets/screenshots/`
- App version on the site: **1.0.0**
- Support email: `support@hafezyquran.xyz`

## Features reflected on the site
- Offline Mushaf (612 pages)
- Quran audio
- Bangla pronunciation
- Bookmarks & progress
- Tajweed guidance
- Tasbeeh
- Islamic books

## Notes
- Language and theme preferences are stored in browser local storage.
- Contact is email-only (no server-side form).
