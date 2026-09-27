# DefenceIndia.com

India's Defence Intelligence Hub — news & analysis, a complete careers hub (20 entry routes + eligibility checker, exam calendar, salary calculator), an equipment database with comparison tools, and an industry hub (vendor directory, procurement tracker, start-ups). Static site, zero backend, served straight from the `main` branch by GitHub Pages (free plan).

**Live:** https://webworksa1.github.io/DefenceIndia-com/

## How it is hosted

GitHub Pages → *Deploy from a branch* → `main` / `(root)`. No Actions workflow. The pages in this repo are plain HTML with a small YAML front matter block; GitHub's built-in Jekyll wraps them in `_layouts/default.html`, injects the shared forms/sidebars from `_includes/`, and prefixes every internal link with `baseurl` from `_config.yml`. Every push to `main` is live within a minute or two.

## Structure

```
_config.yml       site url + baseurl (change these two lines for a custom domain)
_layouts/         default.html — header, contact bar, nav, footer, scripts
_includes/        lead_form, vendor_form, newsletter_block, sidebar_lead, most_read
index.html, news/, analysis/, careers/, equipment/, forces/, industry/ … — the pages
assets/           css, js (config.js = all settings), img
search-index.json, sitemap.xml, feed.xml, robots.txt, manifest.webmanifest, ads.txt
build/            generator (build.py, pages.py, jekyll.py), data/*.json, content/**/*.md
docs/             BUILD-PROMPTS.md (concept + phase-wise prompts), RESEARCH.md (40-site audit)
```

## Editing content

* **Quick edit:** change any page's `index.html` directly on GitHub and commit — it is live on the next Pages build.
* **Regenerate from source:** add a Markdown article to `build/content/news/` or `build/content/analysis/`, or edit the JSON in `build/data/` (exams, equipment, companies, programmes), then run

  ```
  pip install markdown pillow
  python3 build/jekyll.py --out site
  ```

  and copy the contents of `site/` over the repo root. `jekyll.py` rebuilds every page, the includes, the search index, sitemap and feed in the Pages-native form used here.

## Configure (assets/js/config.js)

* `adsense.client` + `adsense.enabled` (and the line in `ads.txt`) once AdSense approves.
* `ga4` — Google Analytics 4 measurement ID.
* `youtube.channelId` (UC…) and `youtube.featured` video IDs.
* `whatsappChannel`, `telegram`, `social.*`.
* `support.*` — UPI ID, Buy Me a Coffee, PayPal, GitHub Sponsors.
* `contest` — current contest title, prize, deadline.
* `k` — the encoded contact inbox. It is never rendered; forms POST to the FormSubmit AJAX relay and fall back to `mailto:` on failure. **The first submission triggers a one-time activation email to the inbox — click it once.**

## Custom domain (defenceindia.com)

1. Add a `CNAME` file at the repo root containing `defenceindia.com`.
2. In `_config.yml` set `url: https://defenceindia.com` and `baseurl: ""`.
3. DNS: A records 185.199.108.153 / .109.153 / .110.153 / .111.153, and `CNAME www → webworksa1.github.io`.
4. In repo Settings → Pages, enter the domain and tick *Enforce HTTPS*.

## Legal

Independent site; not affiliated with the Ministry of Defence, any armed force or government body. "Defence India" is used descriptively. See `/disclaimer/`.
