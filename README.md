# AI for Real Life

A free, practical "where do I start with AI?" site for everyone in India. Live at https://babubl.github.io/ai-for-real-life/

## Pages
| Page | What it is |
|---|---|
| `index.html` | Home: path quiz, 15-minute first win, tracks, paid-course advice, safety teaser, what's new |
| `basics.html` | How AI works: 8 foundation lessons, two experiments, final quiz |
| `course.html` | The 12-week course: missions, schedule patterns, agent recipes, progress card |
| `guides.html` | Choosing tools, AI for your shop, Indian languages, AI and jobs, technical next steps |
| `safety.html` | Family AI safety guide |
| `glossary.html` | Searchable glossary |
| `about.html` | About, FAQ, certificates, costs, privacy, disclaimer |

## How the site is built
Plain HTML, CSS and JavaScript. No framework.

- Edit page content in `src/*.html` (each starts with a small META block: title, description, scripts).
- Shared header, footer, fonts and social tags live in `tools/build.py`.
- Run `python3 tools/build.py` to regenerate the finished pages in the root folder, then commit both.
- Styles: `assets/site.css` (design system) plus one CSS file per page type. Scripts: `assets/site.js` plus one per page.

## Monthly update checklist
1. Home "What's new" and weekly challenge: edit the CONFIG block at the top of `assets/home.js`.
2. Update `UPDATED` and bump `V` in `tools/build.py`, then rebuild.
3. Review tool names and prices in the course toolbox and Week 5–12.
4. Update `lastmod` dates in `sitemap.xml`.

## Custom domain
1. Add a file `CNAME` containing just the domain.
2. DNS at your registrar: four `A` records for the root (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`) and a `CNAME` for `www` pointing to `babubl.github.io`.
3. Settings → Pages: enter the domain, then tick "Enforce HTTPS".
4. Change `SITE` in `tools/build.py` and `assets/site.js`, update `robots.txt` and `sitemap.xml`, rebuild, and submit the sitemap in Google Search Console.

## Roadmap
- Tamil version at `/ta/` (fonts already set up: Mukta Malar + Noto Serif Tamil)
