# Publish DefenceIndia.com on GitHub Pages (free plan)

The repo holds the **source** (generator + content). GitHub Pages must run the build workflow to produce the 107 HTML pages — a plain "Deploy from a branch: main" setting serves the raw source and shows nothing.

## Two clicks

**1. Add the workflow file (prefilled — just press "Commit changes" twice):**

https://github.com/WEBWORKSA1/DefenceIndia-com/new/main?filename=.github/workflows/pages.yml&value=name%3A%20Build%20and%20deploy%20to%20GitHub%20Pages%0A%0Aon%3A%0A%20%20push%3A%0A%20%20%20%20branches%3A%20%5Bmain%5D%0A%20%20workflow_dispatch%3A%0A%0Apermissions%3A%0A%20%20contents%3A%20read%0A%20%20pages%3A%20write%0A%20%20id-token%3A%20write%0A%0Aconcurrency%3A%0A%20%20group%3A%20pages%0A%20%20cancel-in-progress%3A%20true%0A%0Ajobs%3A%0A%20%20build%3A%0A%20%20%20%20runs-on%3A%20ubuntu-latest%0A%20%20%20%20steps%3A%0A%20%20%20%20%20%20-%20uses%3A%20actions%2Fcheckout%40v4%0A%20%20%20%20%20%20-%20uses%3A%20actions%2Fsetup-python%40v5%0A%20%20%20%20%20%20%20%20with%3A%0A%20%20%20%20%20%20%20%20%20%20python-version%3A%20%223.12%22%0A%20%20%20%20%20%20-%20run%3A%20pip%20install%20markdown%20pillow%0A%20%20%20%20%20%20-%20name%3A%20Build%20site%0A%20%20%20%20%20%20%20%20run%3A%20%7C%0A%20%20%20%20%20%20%20%20%20%20if%20%5B%20-f%20CNAME%20%5D%3B%20then%20ROOT%3D%22%2F%22%3B%20else%20ROOT%3D%22%2F%24%7BGITHUB_REPOSITORY%23%2A%2F%7D%2F%22%3B%20fi%0A%20%20%20%20%20%20%20%20%20%20echo%20%22Building%20with%20root%20%24ROOT%22%0A%20%20%20%20%20%20%20%20%20%20python3%20build%2Fbuild.py%20--root%20%22%24ROOT%22%20--out%20dist%0A%20%20%20%20%20%20%20%20%20%20%5B%20-f%20CNAME%20%5D%20%26%26%20cp%20CNAME%20dist%2F%20%7C%7C%20true%0A%20%20%20%20%20%20-%20uses%3A%20actions%2Fconfigure-pages%40v5%0A%20%20%20%20%20%20%20%20with%3A%0A%20%20%20%20%20%20%20%20%20%20enablement%3A%20true%0A%20%20%20%20%20%20-%20uses%3A%20actions%2Fupload-pages-artifact%40v3%0A%20%20%20%20%20%20%20%20with%3A%0A%20%20%20%20%20%20%20%20%20%20path%3A%20dist%0A%20%20deploy%3A%0A%20%20%20%20needs%3A%20build%0A%20%20%20%20runs-on%3A%20ubuntu-latest%0A%20%20%20%20environment%3A%0A%20%20%20%20%20%20name%3A%20github-pages%0A%20%20%20%20%20%20url%3A%20%24%7B%7B%20steps.deployment.outputs.page_url%20%7D%7D%0A%20%20%20%20steps%3A%0A%20%20%20%20%20%20-%20id%3A%20deployment%0A%20%20%20%20%20%20%20%20uses%3A%20actions%2Fdeploy-pages%40v4%0A

(If the editor opens empty, paste the contents of [`deploy/pages.yml`](deploy/pages.yml).)

**2. Settings → Pages → "Build and deployment" → Source: select "GitHub Actions"** (not "Deploy from a branch").
https://github.com/WEBWORKSA1/DefenceIndia-com/settings/pages

The commit from step 1 triggers the workflow (Actions tab); if it ran before step 2, open Actions → *Build and deploy to GitHub Pages* → *Run workflow*. About two minutes later the site is live at:

**https://webworksa1.github.io/DefenceIndia-com/**

## After it is live

* Every push to `main` rebuilds and redeploys automatically.
* Custom domain: add a `CNAME` file containing `defenceindia.com` at the repo root, point DNS (A records 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153; CNAME `www` → `webworksa1.github.io`) and enable HTTPS in **Settings → Pages**. The workflow detects the CNAME and rebuilds with root `/`.
* Forms: submit any form once and click the one-time activation link that FormSubmit emails to the inbox; all forms deliver from then on.
* Fill in `assets/js/config.js` (AdSense ID + `ads.txt`, GA4, YouTube channel ID, WhatsApp/Telegram, UPI/PayPal/Buy Me a Coffee handles, contest details).
