# Publish DefenceIndia.com on GitHub Pages (free plan) — one step

Everything needed to build and deploy the site is in this repo. GitHub blocks third-party integrations from creating files under `.github/workflows/`, so the workflow file needs to be placed there once, by you, in the browser (about 30 seconds):

1. Open https://github.com/WEBWORKSA1/DefenceIndia-com/new/main?filename=.github/workflows/pages.yml
2. Paste the full contents of [`deploy/pages.yml`](deploy/pages.yml) into the editor.
3. Click **Commit changes** (commit directly to `main`).

That commit triggers the workflow, which builds the 107-page site, enables GitHub Pages automatically (`configure-pages` with `enablement: true`) and deploys it. Within ~2 minutes the site is live at:

**https://webworksa1.github.io/DefenceIndia-com/**

Check progress under the **Actions** tab. If the run reports that Pages could not be enabled, open **Settings → Pages**, set *Source* to **GitHub Actions**, and re-run the workflow (Actions → *Build and deploy to GitHub Pages* → *Run workflow*).

## After it is live

* Every push to `main` rebuilds and redeploys automatically.
* Custom domain: add a `CNAME` file containing `defenceindia.com` at the repo root, point DNS (A records 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153; CNAME `www` → `webworksa1.github.io`) and enable HTTPS in **Settings → Pages**. The workflow detects the CNAME and rebuilds with root `/`.
* Forms: submit any form once and click the one-time activation link that FormSubmit emails to the inbox; all forms deliver from then on.
* Fill in `assets/js/config.js` (AdSense ID + `ads.txt`, GA4, YouTube channel ID, WhatsApp/Telegram, UPI/PayPal/Buy Me a Coffee handles, contest details).
