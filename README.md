# DefenceIndia.com

India's Defence Intelligence Hub — news & analysis, a complete careers hub (20 entry routes + eligibility checker, exam calendar, salary calculator), an equipment database with comparison tools, and an industry hub (vendor directory, procurement tracker, start-ups). Static site, zero backend, deploys to GitHub Pages free plan.

## Structure

```
assets/         css, js (config.js = all settings), img
build/          generator: build.py + pages.py, data/*.json, content/**/*.md
docs/           BUILD-PROMPTS.md (concept + phase-wise prompts), RESEARCH.md (40-site audit)
.github/        Pages deployment workflow
```

## Build locally

```
pip install markdown pillow
python3 build/build.py --root /DefenceIndia-com/ --out dist     # GitHub project-pages URL
python3 build/build.py --root / --out dist                       # custom domain
python3 -m http.server -d dist 8000
```

## Configure (assets/js/config.js)

* `adsense.client` + `adsense.enabled` (and `ads.txt` line) once AdSense approves.
* `ga4` — Google Analytics 4 measurement ID.
* `youtube.channelId` (UC…) and `youtube.featured` video IDs.
* `whatsappChannel`, `telegram`, `social.*`.
* `support.*` — UPI ID, Buy Me a Coffee, PayPal, GitHub Sponsors.
* `contest` — current contest title, prize, deadline.
* `k` — the encoded contact inbox. It is never rendered; forms POST to the FormSubmit AJAX relay and fall back to `mailto:` on failure. **The first submission triggers a one-time activation email to the inbox — click it once.**

## Custom domain

Add a `CNAME` file containing `defenceindia.com` at the repo root and point DNS (A records 185.199.108–111.153, CNAME www → webworksa1.github.io). The workflow detects CNAME and rebuilds with root `/`.

## Adding content

* Article: drop a Markdown file with front-matter into `build/content/news/` or `build/content/analysis/`.
* Exam / equipment / company / programme: edit the JSON in `build/data/`.
* Push to `main` — the workflow rebuilds and deploys.

## Legal

Independent site; not affiliated with the Ministry of Defence, any armed force or government body. "Defence India" is used descriptively. See `/disclaimer/`.
