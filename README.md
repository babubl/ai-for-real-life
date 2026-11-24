# AI for Real Life

A free, practical "where do I start with AI?" site for everyone: a 2-minute path quiz, a 15-minute first win, six tracks, an honest take on paid courses, family AI safety, a monthly "what's new", and a hands-on 12-week course with nine agent recipes.

Plain HTML, no build step. Works on GitHub Pages as-is.

## Files
- `index.html`: home page (quiz, first win, tracks, paid courses, safety, what's new, learn together)
- `basics.html`: AI School, 8 foundation lessons (AI, ML, deep learning, data, neural networks, branches, generative AI, ethics) with two experiments and a final exam
- `course.html`: the 12-week course with missions, XP, and a shareable finish-line card
- `favicon.svg`, `robots.txt`, `sitemap.xml`, `.nojekyll`

## Monthly updates
Open `index.html` and edit the block marked `Edit these to update the site` near the bottom:
- `NEWS`: add a new month at the top of the list
- `CHALLENGE`: this week's buddy challenge
- `COMMUNITY_LINK`: paste a WhatsApp or Telegram group link to show the "Join the group" button

## Publish on GitHub Pages
Settings → Pages → Source: Deploy from a branch → `main` / root → Save.
Site: https://babubl.github.io/ai-for-real-life/

## Custom domain
1. Buy the domain.
2. Add a file named `CNAME` containing just the domain (e.g. `example.in`).
3. At your registrar, add DNS records: four `A` records for the root (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`) and a `CNAME` record for `www` pointing to `babubl.github.io`.
4. In Settings → Pages, enter the domain and tick "Enforce HTTPS" once it's available.
5. Update the URLs in `robots.txt` and `sitemap.xml`, then submit the sitemap in Google Search Console.

## Roadmap
- Tamil version (`/ta/`)
