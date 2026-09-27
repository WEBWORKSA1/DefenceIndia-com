# DefenceIndia.com — Concept Decision & Phase-wise Build Prompts

## 1. The idea (and why this one)

**DefenceIndia.com = India's Defence Intelligence Hub: News + Careers + Industry, on one domain.**

Three audiences that no existing Indian site serves together, ranked by revenue per visitor:

| Audience | Size / signal | Monetisation | Value per 1,000 visits (est.) |
|---|---|---|---|
| **Aspirants** (NDA, CDS, AFCAT, Agniveer, SSB, CAPF) | NDA ~5–6 lakh applicants/cycle, Agniveer 30+ lakh registrations/yr, SSC GD 40+ lakh; "NDA eligibility", "Agniveer salary" are six-figure monthly searches | AdSense (education CPC ₹8–25 in India), **coaching-institute leads (₹150–600/lead)**, affiliate books, test-series revenue share | ₹2,500–8,000 |
| **Industry** (MSMEs, start-ups, OEM BD teams, investors) | ₹1.27 lakh cr production, 400+ iDEX start-ups, 10,000+ registered vendors; defence-stock retail interest | **Directory listings (₹5k–50k/yr), RFQ/vendor leads (₹2k–20k each), sponsored features (₹25k+), expo media partnerships** | ₹15,000–60,000 |
| **Enthusiasts / serving / veterans** | Highest volume, lowest CPC; drives YouTube and newsletter growth | AdSense, YouTube, merch, donations, contests sponsorship | ₹800–2,000 |

Why not a pure news site (the idrw / Livefist model): AdSense-only defence news in India yields ~₹1,000–2,000 per 1,000 visits and is hostage to breaking-news volume. The careers layer triples RPM through lead-gen; the industry layer adds high-ticket B2B revenue independent of traffic. All three share the same content engine and domain authority.

**Gaps confirmed in the 40-site audit** (see RESEARCH.md): no Indian competitor has a structured equipment database, an eligibility checker, a procurement tracker, a self-serve media kit, a vendor directory, a real newsletter product, or a contest/lead funnel. This build ships all of them on day one.

**Revenue stack (in launch order):** AdSense → coaching leads (counselling form) → newsletter sponsorship → industry directory & RFQ leads → sponsored content/press releases → YouTube → contests sponsorship → donations/patrons → affiliate → domain/website sponsorship or sale (top-bar CTA on every page).

---

## 2. Phase-wise prompts

Each phase is a self-contained prompt you can hand to a developer or an AI agent. Constraints that apply to every phase are in Phase 0.

### Phase 0 — Global constraints (prepend to every prompt)

```
Build for DefenceIndia.com, a static site hosted on GitHub Pages (free plan): no server code,
no build step required at runtime; plain HTML/CSS/JS, optional Python generator committed to the repo.
Design system: navy #0b1f3a, saffron #f2801e, green #1a8a4a, Inter font, light + dark mode,
mobile-first, 16px gutters, no horizontal scroll, WCAG AA contrast, semantic HTML, skip-link.
On the top of EVERY page show the bar: "Contact, if you are interested in this website / domain
name / Sponsorship / Advertisement / Partnership" linked to https://web.works/contact.
The only contact inbox is webworksa1@gmail.com — it must NEVER appear in markup, link text,
mailto attributes or JSON. Store it encoded in config.js, decode at runtime only when a form
is submitted or a mail link is clicked (fetch POST to a form relay, mailto fallback).
Every form: honeypot, required-field validation, consent checkbox, success/error status, GA4 event.
Monetisation hooks on every page: leaderboard + sidebar + in-article ad slots gated by config,
newsletter capture, counselling CTA, share buttons, WhatsApp/Telegram links.
Legal: trademark/copyright disclosure in the footer of every page + /disclaimer/ page stating
non-affiliation with MoD/forces/government and descriptive use of "Defence India".
SEO: canonical, OG/Twitter, JSON-LD (NewsArticle, FAQPage), sitemap.xml, robots.txt, RSS, 404.
```

### Phase 1 — Foundation & design system
```
Create the repository skeleton: /assets/css/style.css (design tokens, layout, cards, forms, tables,
tools, ad slots, footer, dark mode via data-theme + prefers-color-scheme), /assets/js/config.js
(site name, encoded contact key, form endpoint, AdSense/GA4 IDs, YouTube channel, social,
donation rails, affiliate tag, current contest), /assets/js/main.js (theme toggle, mobile nav,
active nav, reading progress, cookie notice, ticker, countdowns, config-driven links, AdSense/GA4
loaders, YouTube embeds, universal form handler with relay + mailto fallback, multi-step forms,
client-side search over search-index.json, share links, table filter).
Write a Python generator build/build.py + build/pages.py that renders every page with a shared
head/topbar/header/ticker/footer and supports a --root prefix (needed for GitHub project pages).
```

### Phase 2 — Content engine (News & Analysis)
```
Implement Markdown articles with front-matter (title, date, category, tags, thumb, summary) in
build/content/news and build/content/analysis. Render article pages with breadcrumb, eyebrow,
meta (date, read time), in-article ad, share bar, related articles (tag/category overlap),
sticky sidebar (counselling CTA, newsletter, ad, most-read), NewsArticle JSON-LD.
Seed 12 evergreen explainers + 4 analyses (Agnipath, budget, Tejas, SSB, exports, Vikrant,
BrahMos, LAC infrastructure, drones, women in forces, iDEX, defence stocks; theatre commands,
India–China balance, DAP 2020, submarine gap). Build /news/ and /analysis/ listings with
category pills, and a homepage ticker of the latest 8 headlines. Generate feed.xml.
```

### Phase 3 — Careers Hub (traffic + lead engine)
```
Create data/exams.json with 20 entries (NDA, CDS, AFCAT, Agniveer Army/Navy/Vayu, SSB, TES,
TGC, SSC Tech, NCC Special, Navy SSC, Navy 10+2 B.Tech, CAPF AC, TA, ICG AC, ICG Navik, SSC GD,
JAG, AISSEE/RIMC) with age band, gender, qualification level, pattern, next date, salary, tips.
Render /careers/ (officer vs other-ranks grids, tools cards, guides) and one landing page per
entry (facts table, countdown, tips, FAQ accordion + FAQPage JSON-LD, affiliate book CTA,
embedded 2-step counselling form).
Tools: /careers/eligibility-checker/ (DOB + gender + qualification + stream → matching entries
with countdowns and "Get guidance" CTAs; reveals the lead form and pre-fills matched entries),
/careers/exam-calendar/ (sortable table with live countdowns, level filter),
/careers/salary-calculator/ (7th CPC matrix, MSP, DA, HRA by city class, field allowance).
```

### Phase 4 — Lead-generation system (the conversion layer)
```
Build /counselling/: dedicated landing page — value stats, FAQ accordion, and the 2-step form
(Step 1: exam-interest chips, qualification, DOB, state, gender → Step 2: name, WhatsApp mobile,
email, mode preference, message, consent). Progress bar, trust strip (100% free, ex-officer
mentors, 24h callback, no spam), thank-you page with next actions.
Build /vendor-enquiry/: B2B form (company, contact, email, phone, org type, interest incl.
"acquiring/sponsoring this website", capabilities). Embed it on /industry/, /industry/directory/,
/industry/startups/. Place the counselling form on the homepage lead band, every exam page,
the eligibility checker result and the exam calendar. All submissions go to the single hidden
inbox via the relay; subject line prefixed "[DefenceIndia.com] <form name>".
```

### Phase 5 — Equipment database & comparison tools
```
Create data/equipment.json (33 platforms across Aircraft, Helicopters, Land Systems, Missiles,
Naval, Drones) with specs map, 0–100 capability index (speed/range/payload/tech), status,
origin, description, compare[] links. Render /equipment/ (category filter + search),
one page per item (spec grid, index bars, compare CTA, often-compared cards, related articles),
/equipment/compare/ (2–3 item selector via ?a=&b=, cards + spec matrix).
Build /india-vs/ with data/compare.json (budget, personnel, aircraft, tanks, naval, subs,
warheads, GFP rank) for India, Pakistan, China, USA, Russia, France — best value highlighted.
```

### Phase 6 — Forces & Industry hubs
```
/forces/ + /forces/{army,navy,air-force,coast-guard,capf}/: profile, facts table, how-to-join
cards pulled from exams.json, key equipment cards, related reading.
/industry/: KPI stats, cards to directory/tracker/start-ups, latest programmes table, industry
reading, vendor form, sponsored-feature widget, key resources (iDEX, SRIJAN, DDP, GeM, SIDM).
/industry/directory/: 30-company table (DPSU/private/JV/start-up) with live text filter.
/industry/procurement-tracker/: 15 programmes with date, value, vendor, stage, filter.
/industry/startups/: iDEX explainer + notable start-ups.
```

### Phase 7 — Monetisation pages
```
/support/: three tiers (Supporter ₹99, Patron ₹499, One-time) wired to config (Buy Me a Coffee,
UPI ID, PayPal, GitHub Sponsors), corporate sponsorship form, "where the money goes" split.
/advertise/: media kit — audience stats, packages (display, sponsored content, lead-gen partner,
newsletter, video, contest sponsorship) with price anchors, media-kit request form, website /
domain acquisition notice → web.works/contact, advertising policy.
/partner/: six partnership types + proposal form.
/contests/: config-driven current contest (title, prize, deadline countdown), 10-question
practice quiz that writes the score into the registration form, contest rules, other contests,
sponsor CTA.
/join-us/: six open roles (correspondent, exam writer, video producer, data researcher,
ex-officer mentors, BD) + application / write-for-us form + guest guidelines.
/videos/: config-driven YouTube channel embed + featured videos, topic-suggestion form,
sponsor-a-video CTA. /newsletter/: segment-aware subscribe block.
```

### Phase 8 — Legal, SEO & trust
```
/about/, /contact/ (topic select incl. tips, corrections, press releases; hidden mail link),
/disclaimer/ (non-affiliation, descriptive use of "Defence India", nominative fair use of marks,
copyright, accuracy, OPSEC), /privacy/ (forms, cookies, AdSense/GA, DPDP Act 2023, GDPR),
/terms/ (tools, submissions, contests), /editorial-policy/ (sourcing, independence,
corrections, OPSEC, AI use). Generate sitemap.xml, robots.txt, ads.txt placeholder,
manifest.webmanifest, favicon.svg, og.png, 404.html, .nojekyll, search-index.json.
```

### Phase 9 — QA & deployment
```
Verify: 0 occurrences of the inbox address anywhere in /dist; topbar present on 100% of pages;
0 broken internal links (crawl every href/src); Playwright screenshots at 390px and 1366px for
home, article, exam page, eligibility (with a run), compare, industry, support, contests;
hamburger + dark-mode toggle; form POST intercepted to the relay endpoint.
Deploy: GitHub Actions workflow (python build with --root /<repo>/ unless CNAME exists,
actions/configure-pages with enablement:true, upload-pages-artifact, deploy-pages).
Push to github.com/webworksa1/DefenceIndia-com (main). Confirm live URL.
```

### Phase 10 — Growth roadmap (post-launch)
```
1. Fill config.js: AdSense publisher ID + ads.txt line, GA4 ID, YouTube channel ID, WhatsApp
   channel, UPI/BMC/PayPal handles. Click the one-time FormSubmit activation email.
2. Add CNAME (defenceindia.com) + DNS A/AAAA records; rebuild root "/" (workflow auto-detects).
3. Publish 3 articles/week; add exam-notification posts within 24h of each notification
   (highest-intent traffic). Add cut-off predictor and free mock tests (retention).
4. Sign 3 coaching partners for counselling leads (state-wise routing) and 10 directory listings.
5. Launch YouTube: one explainer/week from the top-read article; embed via config.
6. Hindi edition (/hi/) once English traffic > 100k/month; Alpha Defense proves the demand.
7. Community: WhatsApp channel first (India converts on WhatsApp, not email), then Telegram.
```
