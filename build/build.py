#!/usr/bin/env python3
"""DefenceIndia.com static site generator.
Usage: python3 build/build.py [--root /defenceindia-com/] [--out dist]
Reads build/data/*.json and build/content/**/*.md, writes a complete static site.
"""
import json, os, re, sys, shutil, datetime, html
import markdown

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
ROOT = "/"
OUT = os.path.join(REPO, "dist")
args = sys.argv[1:]
if "--root" in args: ROOT = args[args.index("--root") + 1]
if "--out" in args: OUT = args[args.index("--out") + 1]
if not ROOT.endswith("/"): ROOT += "/"
SITE = "DefenceIndia.com"
BASE = "https://defenceindia.com"
TODAY = datetime.date.today().isoformat()
CONTACT_URL = "https://web.works/contact"

sys.path.insert(0, HERE)
from pages import PAGES  # noqa: E402  (page templates)

def load(name):
    with open(os.path.join(HERE, "data", name), encoding="utf-8") as f: return json.load(f)

EXAMS = load("exams.json"); EQUIP = load("equipment.json"); IND = load("industry.json"); CMP = load("compare.json")

def parse_md(path):
    txt = open(path, encoding="utf-8").read()
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", txt, re.S)
    meta = {}
    for line in m.group(1).splitlines():
        k, _, v = line.partition(":"); meta[k.strip()] = v.strip()
    body = markdown.markdown(m.group(2), extensions=["tables", "sane_lists"])
    meta["html"] = body; meta["slug"] = os.path.splitext(os.path.basename(path))[0]
    meta["tags"] = [t.strip() for t in meta.get("tags", "").split(",") if t.strip()]
    words = len(re.sub("<[^>]+>", " ", body).split()); meta["read"] = max(1, round(words / 220))
    return meta

def load_articles(section):
    d = os.path.join(HERE, "content", section)
    arts = [parse_md(os.path.join(d, f)) for f in os.listdir(d) if f.endswith(".md")]
    for a in arts: a["section"] = section
    return sorted(arts, key=lambda a: a["date"], reverse=True)

NEWS = load_articles("news"); ANALYSIS = load_articles("analysis"); ALL_ARTICLES = sorted(NEWS + ANALYSIS, key=lambda a: a["date"], reverse=True)

# ---------------------------------------------------------------- layout
NAV = [("news/", "News"), ("analysis/", "Analysis"), ("forces/", "Forces"), ("equipment/", "Equipment"), ("careers/", "Careers"), ("industry/", "Industry"), ("videos/", "Videos"), ("support/", "Support")]
TICKER = [(a["title"], f"{a['section']}/{a['slug']}/") for a in ALL_ARTICLES[:8]]

LOGO = '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="#f2801e"/><path d="M24 8l14 7v10c0 9-6 15-14 18-8-3-14-9-14-18V15z" fill="#0b1f3a"/><path d="M24 14l9 4.5V25c0 6-4 10-9 12-5-2-9-6-9-12v-6.5z" fill="#fff"/><circle cx="24" cy="24" r="4" fill="#1a8a4a"/></svg>'

def R(p=""): return ROOT + p

def esc(s): return html.escape(str(s), quote=True)

def ad(kind="leaderboard"):
    return f'<div class="ad {kind}" data-slot="{kind}" aria-label="Advertisement">Advertisement</div>'

def head(title, desc, path, extra_head="", og_type="website"):
    full = f"{title} | {SITE}" if title != SITE else f"{SITE} — India's Defence News, Careers & Industry Hub"
    return f'''<!DOCTYPE html>
<html lang="en" data-root="{ROOT}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(full)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{BASE}/{path}">
<meta property="og:type" content="{og_type}"><meta property="og:site_name" content="{SITE}">
<meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{BASE}/{path}"><meta property="og:image" content="{BASE}/assets/img/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0b1f3a">
<link rel="icon" href="{R('assets/img/favicon.svg')}" type="image/svg+xml">
<link rel="manifest" href="{R('manifest.webmanifest')}">
<link rel="alternate" type="application/rss+xml" title="{SITE} RSS" href="{R('feed.xml')}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{R('assets/css/style.css')}">
<script>try{{var t=localStorage.getItem("di-theme");if(t)document.documentElement.setAttribute("data-theme",t)}}catch(e){{}}</script>
{extra_head}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="progress"></div>
<div class="topbar">Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership — <a href="{CONTACT_URL}" rel="noopener" target="_blank">web.works/contact</a></div>
<header class="header"><div class="container">
<a class="brand" href="{R()}" aria-label="{SITE} home">{LOGO}<span>Defence<b>India</b>.com</span></a>
<nav class="nav" aria-label="Main">{''.join(f'<a href="{R(p)}">{n}</a>' for p, n in NAV)}<a class="cta" href="{R('counselling/')}">Free Counselling</a></nav>
<div class="hdr-actions"><a class="icon-btn" href="{R('search/')}" aria-label="Search">🔍</a><button class="icon-btn theme-toggle" aria-label="Toggle dark mode">☾</button><button class="icon-btn menu" aria-label="Menu" aria-expanded="false">☰</button></div>
</div>
<nav class="mobile-nav" aria-label="Mobile">{''.join(f'<a href="{R(p)}">{n}</a>' for p, n in NAV)}<a href="{R('india-vs/')}">India vs World</a><a href="{R('advertise/')}">Advertise</a><a class="cta" href="{R('counselling/')}">Free Career Counselling</a></nav>
</header>
<div class="ticker"><div class="container"><span class="tag">LATEST</span><div style="overflow:hidden;flex:1"><div class="ticker-track">{''.join(f'<a href="{R(p)}">{esc(t)}</a>' for t, p in TICKER)}</div></div></div></div>
<main id="main">'''

def foot():
    cols = {
        "Sections": [("news/", "News"), ("analysis/", "Analysis"), ("forces/", "Forces"), ("equipment/", "Equipment Database"), ("equipment/compare/", "Compare Equipment"), ("india-vs/", "India vs World"), ("videos/", "Videos")],
        "Careers": [("careers/", "Careers Hub"), ("careers/eligibility-checker/", "Eligibility Checker"), ("careers/exam-calendar/", "Exam Calendar"), ("careers/salary-calculator/", "Salary Calculator"), ("counselling/", "Free Counselling"), ("news/ssb-interview-5-day-guide/", "SSB Guide")],
        "Industry & Business": [("industry/", "Industry Hub"), ("industry/directory/", "Vendor Directory"), ("industry/procurement-tracker/", "Procurement Tracker"), ("vendor-enquiry/", "Vendor / RFQ Enquiry"), ("advertise/", "Advertise & Sponsor"), ("partner/", "Partnerships")],
        "Community": [("support/", "Support Us"), ("contests/", "Contests & Prizes"), ("join-us/", "Join Our Team / Write for Us"), ("newsletter/", "Newsletter"), ("about/", "About"), ("contact/", "Contact")],
    }
    colhtml = "".join(f'<div><h4>{h}</h4><ul>{"".join(f"<li><a href={chr(34)}{R(p)}{chr(34)}>{n}</a></li>" for p, n in items)}</ul></div>' for h, items in cols.items())
    return f'''</main>
<footer class="footer"><div class="container">
<div class="grid grid-4">
<div><a class="brand" href="{R()}">{LOGO}<span>Defence<b>India</b>.com</span></a><p style="margin-top:12px">Independent news, analysis, careers guidance and industry intelligence on India's armed forces and defence sector.</p>
<div class="social"><a data-link="social.x" href="#">X</a><a data-link="social.instagram" href="#">Instagram</a><a data-link="youtube.channelUrl" href="#">YouTube</a><a data-link="whatsappChannel" href="#">WhatsApp</a><a data-link="telegram" href="#">Telegram</a><a data-link="social.linkedin" href="#">LinkedIn</a></div></div>
{colhtml}
</div>
<div class="legal">
<p><b>Trademark &amp; copyright disclosure:</b> DefenceIndia.com is an independent, privately operated media and information website. It is <b>not</b> affiliated with, endorsed by, or connected to the Ministry of Defence, the Indian Army, Indian Navy, Indian Air Force, Indian Coast Guard, any Central Armed Police Force, the Government of India, or any organisation using a similar name. "Defence India" is used descriptively to denote the subject matter (India's defence sector) and not as a claim to any registered trademark. All official names, insignia, emblems and logos belong to their respective owners and are referenced for identification only. Any resemblance to other brands is unintentional; rights holders may <a href="{CONTACT_URL}" rel="noopener">contact us</a> for prompt review. Article content is © {SITE} unless stated; data tables compile publicly available figures and are indicative.</p>
<p>Information on exams, pay and eligibility is compiled from public notifications and may change — always verify with the official notification. Nothing here is investment, legal or career advice. <a href="{R('disclaimer/')}">Full disclaimer</a> · <a href="{R('privacy/')}">Privacy</a> · <a href="{R('terms/')}">Terms</a> · <a href="{R('editorial-policy/')}">Editorial policy</a> · <a href="{R('sitemap.xml')}">Sitemap</a></p>
<p>© {datetime.date.today().year} {SITE}. All rights reserved. <a href="{CONTACT_URL}" rel="noopener">This website / domain is available for sponsorship, advertising, partnership or acquisition enquiries.</a></p>
</div>
</div></footer>
<a class="wa-float" data-link="whatsappChannel" href="#" rel="noopener" target="_blank">💬 Join WhatsApp</a>
<a class="back-top btn btn-navy" href="#" aria-label="Back to top">↑</a>
<div class="cookie" role="dialog" aria-label="Cookie notice">We use cookies for analytics and personalised ads. <a href="{R('privacy/')}">Privacy policy</a> <button class="btn btn-primary" style="padding:6px 14px">OK</button></div>
<script src="{R('assets/js/config.js')}"></script>
<script src="{R('assets/js/main.js')}"></script>
<script src="{R('assets/js/tools.js')}"></script>
</body></html>'''

def page(path, title, desc, body, extra_head="", og_type="website"):
    if ROOT != "/":
        body = re.sub(r'href="/(?!' + re.escape(ROOT[1:]) + ')', f'href="{ROOT}', body)
        body = re.sub(r"href='/(?!" + re.escape(ROOT[1:]) + ")", f"href='{ROOT}", body)
    out = head(title, desc, path, extra_head, og_type) + body + foot()
    dest = os.path.join(OUT, path, "index.html") if not path.endswith(".html") else os.path.join(OUT, path)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    open(dest, "w", encoding="utf-8").write(out)
    if path != "404.html": URLS.append((path, TODAY))

URLS = []
SEARCH = []

def card(title, url, meta="", text="", thumb="", badge="", feature=False):
    return f'<article class="card{" card-feature" if feature else ""}"><a class="thumb {thumb}" href="{R(url)}">{esc(title)[:60]}</a><div class="body">{f"<span class=badge>{esc(badge)}</span>" if badge else ""}<h3><a href="{R(url)}">{esc(title)}</a></h3>{f"<div class=meta>{meta}</div>" if meta else ""}{f"<p>{esc(text)}</p>" if text else ""}</div></article>'

def article_card(a, feature=False):
    return card(a["title"], f"{a['section']}/{a['slug']}/", f'{a["date"]} · {a["read"]} min read', a["summary"], a.get("thumb", ""), a["category"], feature)

CTX = dict(R=R, esc=esc, ad=ad, card=card, article_card=article_card, EXAMS=EXAMS, EQUIP=EQUIP, IND=IND, CMP=CMP, NEWS=NEWS, ANALYSIS=ANALYSIS, ALL=ALL_ARTICLES, CONTACT_URL=CONTACT_URL, SITE=SITE, ROOT=ROOT)

# ---------------------------------------------------------------- build
def main():
    if os.path.exists(OUT): shutil.rmtree(OUT)
    os.makedirs(OUT)
    shutil.copytree(os.path.join(REPO, "assets"), os.path.join(OUT, "assets"))
    try:
        import make_og; make_og.make(os.path.join(OUT, "assets", "img", "og.png"))
    except Exception as e: print("og.png skipped:", e)
    os.makedirs(os.path.join(OUT, "data"), exist_ok=True)
    for n in ("exams.json", "equipment.json", "industry.json", "compare.json"): shutil.copy(os.path.join(HERE, "data", n), os.path.join(OUT, "data", n))

    for p in PAGES(CTX, page):
        pass

    # Articles
    for a in ALL_ARTICLES:
        related = [b for b in ALL_ARTICLES if b is not a and (set(b["tags"]) & set(a["tags"]) or b["category"] == a["category"])][:3]
        body = f'''<div class="container"><div class="breadcrumb"><a href="{R()}">Home</a> › <a href="{R(a['section'] + '/')}">{a['section'].title()}</a> › {esc(a['category'])}</div>
<div class="layout"><div><article class="article"><span class="eyebrow">{esc(a['category'])}</span><h1>{esc(a['title'])}</h1><div class="meta">By DefenceIndia Desk · {a['date']} · {a['read']} min read · Explainer</div>
{ad('inarticle')}<div class="content">{a['html']}</div>
<div class="share"><a data-share="wa" href="#">WhatsApp</a><a data-share="x" href="#">X</a><a data-share="fb" href="#">Facebook</a><a data-share="li" href="#">LinkedIn</a><a data-share="tg" href="#">Telegram</a><a data-share="copy" href="#">Copy link</a></div>
<p class="small muted" style="margin-top:18px">Tags: {", ".join(esc(t) for t in a['tags'])}. Spotted an error? <a href="{R('contact/')}">Request a correction</a>.</p></article>
{ad('leaderboard')}
<section class="section"><div class="section-head"><h2>Related</h2></div><div class="grid grid-3">{''.join(article_card(b) for b in related)}</div></section></div>
<aside class="sidebar"><div class="sticky">{sidebar_lead()}{ad('rect')}{sidebar_popular()}</div></aside></div></div>'''
        ld = json.dumps({"@context": "https://schema.org", "@type": "NewsArticle", "headline": a["title"], "datePublished": a["date"], "author": {"@type": "Organization", "name": SITE}, "publisher": {"@type": "Organization", "name": SITE}, "description": a["summary"]})
        page(f"{a['section']}/{a['slug']}/", a["title"], a["summary"], body, f'<script type="application/ld+json">{ld}</script>', "article")
        SEARCH.append({"t": a["title"], "u": f"{a['section']}/{a['slug']}/", "c": a["category"], "d": a["summary"], "k": " ".join(a["tags"])})

    for e in EXAMS: SEARCH.append({"t": e["name"], "u": f"careers/{e['slug']}/", "c": "Careers", "d": e["summary"], "k": e["short"] + " " + e["service"]})
    for q in EQUIP: SEARCH.append({"t": q["name"], "u": f"equipment/{q['slug']}/", "c": q["cat"], "d": q["desc"][:160], "k": q["type"] + " " + q["service"]})
    for p, n in [("careers/eligibility-checker/", "Eligibility Checker"), ("careers/exam-calendar/", "Exam Calendar"), ("careers/salary-calculator/", "Defence Salary Calculator"), ("equipment/compare/", "Compare Equipment"), ("india-vs/", "India vs World Power Comparison"), ("industry/directory/", "Defence Vendor Directory"), ("industry/procurement-tracker/", "Procurement Tracker"), ("counselling/", "Free Career Counselling"), ("vendor-enquiry/", "Vendor Enquiry"), ("support/", "Support DefenceIndia"), ("advertise/", "Advertise"), ("contests/", "Contests"), ("join-us/", "Join Us")]:
        SEARCH.append({"t": n, "u": p, "c": "Tool / Page", "d": n, "k": ""})
    json.dump(SEARCH, open(os.path.join(OUT, "search-index.json"), "w", encoding="utf-8"))

    # sitemap, robots, rss, manifest, ads.txt, 404, .nojekyll
    sm = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + "".join(f"<url><loc>{BASE}/{p}</loc><lastmod>{d}</lastmod></url>" for p, d in URLS) + "</urlset>"
    open(os.path.join(OUT, "sitemap.xml"), "w").write(sm)
    open(os.path.join(OUT, "robots.txt"), "w").write(f"User-agent: *\nAllow: /\nSitemap: {BASE}/sitemap.xml\n")
    rss = f'<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>{SITE}</title><link>{BASE}/</link><description>India defence news, careers and industry</description>' + "".join(f"<item><title>{esc(a['title'])}</title><link>{BASE}/{a['section']}/{a['slug']}/</link><description>{esc(a['summary'])}</description><pubDate>{a['date']}</pubDate></item>" for a in ALL_ARTICLES) + "</channel></rss>"
    open(os.path.join(OUT, "feed.xml"), "w", encoding="utf-8").write(rss)
    json.dump({"name": SITE, "short_name": "DefenceIndia", "start_url": ROOT, "display": "standalone", "background_color": "#0b1f3a", "theme_color": "#0b1f3a", "icons": [{"src": R("assets/img/favicon.svg"), "sizes": "any", "type": "image/svg+xml"}]}, open(os.path.join(OUT, "manifest.webmanifest"), "w"))
    open(os.path.join(OUT, "ads.txt"), "w").write("# Replace with your AdSense line once approved, e.g.:\n# google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0\n")
    open(os.path.join(OUT, ".nojekyll"), "w").write("")
    page("404.html", "Page not found", "The page you requested does not exist.", f'<div class="container section center"><h1>404 — Off the map</h1><p class="muted">That page does not exist or has moved.</p><div class="btn-group" style="justify-content:center"><a class="btn btn-primary" href="{R()}">Go home</a><a class="btn btn-outline" href="{R("search/")}">Search the site</a></div></div>')
    print(f"Built {len(URLS)} pages → {OUT} (root={ROOT})")

def sidebar_lead():
    return f'''<div class="widget" style="border-color:var(--saffron)"><h3>Free Defence Career Counselling</h3><p class="small muted">Not sure which entry fits you? A mentor will call you back within 24 hours.</p><a class="btn btn-primary btn-block" href="{R('counselling/')}">Request a callback</a></div>
<div class="widget"><h3>Daily Defence Brief</h3><p class="small muted">Top stories, exam alerts and contracts — free, every morning.</p><form data-di-form="Newsletter" data-success="Subscribed! Check your inbox."><div class="field"><input type="email" name="email" placeholder="Your email" required aria-label="Email"></div><input class="hp" name="_hp" tabindex="-1" autocomplete="off"><button class="btn btn-navy btn-block" type="submit" data-label="Subscribe">Subscribe</button><div class="form-status"></div></form></div>'''

def sidebar_popular():
    return '<div class="widget"><h3>Most read</h3>' + "".join(f'<div class="list-row"><span class="num">{i+1}</span><div><a href="{R(a["section"] + "/" + a["slug"] + "/")}">{esc(a["title"])}</a><div class="meta">{a["category"]}</div></div></div>' for i, a in enumerate(ALL_ARTICLES[:5])) + "</div>"

CTX["sidebar_lead"] = sidebar_lead; CTX["sidebar_popular"] = sidebar_popular

if __name__ == "__main__":
    main()
