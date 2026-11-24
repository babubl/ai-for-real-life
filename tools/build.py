#!/usr/bin/env python3
"""Builds the site pages from src/*.html by adding the shared head, header and footer.

Each src file starts with a META comment holding JSON:
<!--META {"title": "...", "desc": "...", "path": "basics.html", "nav": "basics",
          "css": ["assets/basics.css"], "js": ["assets/basics.js"], "jsonld": {...}, "subbar": "...html..."} -->
Run:  python3 tools/build.py      (writes the finished pages to the repo root)
Change SITE below when the custom domain goes live.
"""
import json, re, pathlib

SITE = "https://aiforreallife.in/"
UPDATED = "November 2026"
V = "20261124h"
ROOT = pathlib.Path(__file__).resolve().parent.parent

MARK = ('<svg viewBox="0 0 32 32" width="{s}" height="{s}" aria-hidden="true" focusable="false">'
        '<rect width="32" height="32" rx="8" fill="{bg}"/><g fill="#fff"><circle cx="9" cy="9" r="2"/>'
        '<circle cx="16" cy="9" r="2"/><circle cx="23" cy="9" r="2"/><circle cx="9" cy="16" r="2"/>'
        '<circle cx="23" cy="16" r="2"/><circle cx="9" cy="23" r="2"/><circle cx="16" cy="23" r="2"/></g>'
        '<path d="M9 23 16 16 23 9" stroke="#F2A93B" stroke-width="3" stroke-linecap="round" fill="none"/>'
        '<circle cx="16" cy="16" r="3" fill="#F2A93B"/></svg>')

NAV = [("start", "./#start", "Start here"), ("basics", "basics.html", "How AI works"),
       ("course", "course.html", "Course"), ("build", "build.html", "Build a website"),
       ("guides", "guides.html", "Guides"), ("safety", "safety.html", "Safety"), ("about", "about.html", "About")]

FONTS = ("https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,500;0,6..72,600;1,6..72,400"
         "&family=Mukta:wght@400;600;700&family=IBM+Plex+Mono&display=swap")

def head(m):
    url = SITE + ("" if m["path"] == "index.html" else m["path"])
    css = "".join(f'<link rel="stylesheet" href="{c}?v={V}">\n' for c in m.get("css", []))
    ld = ""
    if m.get("jsonld"):
        ld = '<script type="application/ld+json">' + json.dumps(m["jsonld"], ensure_ascii=False) + "</script>\n"
    robots = '<meta name="robots" content="noindex">\n' if m.get("noindex") else ""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{m['title']}</title>
<meta name="description" content="{m['desc']}">
{robots}<link rel="canonical" href="{url}">
<meta name="theme-color" content="#FBF8F3" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0F1115" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="website">
<meta property="og:site_name" content="AI for Real Life">
<meta property="og:title" content="{m.get('og', m['title'])}">
<meta property="og:description" content="{m['desc']}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}assets/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="author" content="Babu Balasubramanian">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{FONTS}">
<link rel="stylesheet" href="assets/site.css?v={V}">
{css}{ld}</head>
<body>
"""

def header(active, cta):
    cur = ' aria-current="page"'
    links = "".join(f'<a href="{h}"{cur if k == active else ""}>{t}</a>' for k, h, t in NAV)
    rows = "".join(f'<a class="row" href="{h}"{cur if k == active else ""}>{t}</a>' for k, h, t in NAV)
    return f"""<a class="skip" href="#main">Skip to content</a>
<header class="site-head">
  <div class="container head-row">
    <a class="brand" href="./" aria-label="AI for Real Life, home">{MARK.format(s=28, bg='var(--brand)')}<span class="wm">AI <i>for</i> Real Life</span></a>
    <nav class="main-nav" aria-label="Main">{links}</nav>
    <a class="btn btn-primary head-cta" href="{cta[0]}">{cta[1]}</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>Menu</button>
  </div>
</header>
<nav class="menu-sheet" id="menu" aria-label="Menu" hidden>{rows}<a class="btn btn-primary" href="{cta[0]}">{cta[1]}</a></nav>
"""

def footer(js):
    scripts = f'<script src="assets/site.js?v={V}"></script>\n' + "".join(
        f'<script src="{j}?v={V}"></script>\n' for j in js)
    return f"""<footer class="site-foot">
  <div class="container">
    <div class="foot-grid">
      <div class="foot-brand">
        <a class="brand" href="./" aria-label="AI for Real Life, home">{MARK.format(s=28, bg='#2A36B1')}<span class="wm">AI <i>for</i> Real Life</span></a>
        <p>A free, practical way for anyone in India to learn AI by using it. Made in Chennai by Babu Balasubramanian. No ads, no sign-up, no tracking.</p>
      </div>
      <div><h4>Learn</h4><ul><li><a href="./#start">Find my path</a></li><li><a href="basics.html">How AI works</a></li><li><a href="course.html">12-week course</a></li><li><a href="build.html">Build a website</a></li><li><a href="syllabus.html">Syllabus</a></li><li><a href="glossary.html">Glossary</a></li></ul></div>
      <div><h4>Guides</h4><ul><li><a href="safety.html">Family AI safety</a></li><li><a href="guides.html#shop">AI for your shop</a></li><li><a href="guides.html#indian-languages">AI in Indian languages</a></li><li><a href="guides.html#jobs">AI and your job</a></li><li><a href="guides.html#next-steps">Create AI: technical path</a></li></ul></div>
      <div><h4>About</h4><ul><li><a href="about.html">About this site</a></li><li><a href="about.html#faq">FAQ</a></li><li><a href="about.html#privacy">Privacy</a></li><li><a href="https://github.com/babubl/ai-for-real-life/issues">Contact &amp; feedback</a></li></ul></div>
    </div>
    <div class="foot-bottom"><span>© 2026 Babu Balasubramanian · Last reviewed {UPDATED}</span><span>English · தமிழ் coming soon</span><span>AI tools change fast. Check each tool's own site for current prices and features.</span></div>
  </div>
</footer>
{scripts}</body>
</html>
"""

def build():
    for src in sorted((ROOT / "src").glob("*.html")):
        text = src.read_text(encoding="utf-8")
        mm = re.match(r"\s*<!--META\s*(\{.*?\})\s*-->\s*", text, re.S)
        if not mm:
            raise SystemExit(f"{src.name}: missing META")
        m = json.loads(mm.group(1))
        body = text[mm.end():]
        cta = tuple(m.get("cta", ["./#start", "Find my path"]))
        out = head(m) + header(m.get("nav", ""), cta) + m.get("subbar", "") + '<main id="main">\n' + body + "\n</main>\n" + footer(m.get("js", []))
        (ROOT / m["path"]).write_text(out, encoding="utf-8")
        print("built", m["path"])

if __name__ == "__main__":
    build()
