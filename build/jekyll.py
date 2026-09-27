#!/usr/bin/env python3
"""Convert the generated site into GitHub-Pages-native form (Jekyll layout + includes + pages with
front matter) so a plain 'Deploy from a branch: main' setting serves it with no build workflow.
Usage: python3 build/jekyll.py [--out site]
"""
import os, re, sys, json, shutil

HERE = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.dirname(HERE)
OUT = os.path.join(REPO, "site")
if "--out" in sys.argv: OUT = sys.argv[sys.argv.index("--out") + 1]
TMP = "/tmp/di-jekyll-src"
ROOT = "{{ site.baseurl }}/"

sys.argv = ["build.py", "--root", ROOT, "--out", TMP]
sys.path.insert(0, HERE)
import build  # noqa: E402

def mark(name, fn):
    def w(*a, **k): return f"<!--INC:{name}-->" + fn(*a, **k) + f"<!--/INC:{name}-->"
    return w
build.sidebar_lead = mark("sidebar_lead", build.sidebar_lead); build.sidebar_popular = mark("most_read", build.sidebar_popular)
build.CTX["sidebar_lead"] = build.sidebar_lead; build.CTX["sidebar_popular"] = build.sidebar_popular
build.main()

if os.path.exists(OUT): shutil.rmtree(OUT)
os.makedirs(os.path.join(OUT, "_layouts")); os.makedirs(os.path.join(OUT, "_includes"))

PATTERNS = [
    ("lead_form", r'<form class="form" data-di-form="Career Counselling Lead".*?</form>'),
    ("vendor_form", r'<form class="form" data-di-form="Industry / Vendor Enquiry".*?</form>'),
    ("newsletter_block", r'<section class="section"><div class="container"><div class="form" style="display:grid.*?</section>'),
    ("sidebar_lead", r'<!--INC:sidebar_lead-->(.*?)<!--/INC:sidebar_lead-->'),
    ("most_read", r'<!--INC:most_read-->(.*?)<!--/INC:most_read-->'),
]
captured = {}; layout_written = False
def ystr(s): return json.dumps(s, ensure_ascii=False)

for dp, _, fs in os.walk(TMP):
    for f in fs:
        src = os.path.join(dp, f); rel = os.path.relpath(src, TMP)
        dest = os.path.join(OUT, rel); os.makedirs(os.path.dirname(dest), exist_ok=True)
        if not f.endswith(".html"):
            if f == ".nojekyll" or rel.startswith("data/"): continue
            if f in ("manifest.webmanifest", "sitemap.xml", "feed.xml", "robots.txt"):
                # Liquid-templated so URLs follow site.url + site.baseurl (works on github.io and custom domain)
                txt = open(src, encoding="utf-8").read().replace("https://defenceindia.com", "{{ site.url }}{{ site.baseurl }}")
                open(dest, "w", encoding="utf-8").write("---\n---\n" + txt)
            else: shutil.copy(src, dest)
            continue
        s = open(src, encoding="utf-8").read()
        head, body, foot = re.match(r"^(.*<main id=\"main\">)(.*)(</main>.*)$", s, re.S).groups()
        title = re.search(r"<title>(.*?)</title>", head).group(1)
        desc = re.search(r'<meta name="description" content="(.*?)">', head).group(1)
        extra = re.search(r'(<script type="application/ld\+json">.*?</script>)', head, re.S)
        if not layout_written:
            lay = head.replace(f"<title>{title}</title>", "<title>{{ page.title }}</title>")
            lay = lay.replace(f'content="{desc}"', 'content="{{ page.description }}"')
            lay = re.sub(r'<link rel="canonical" href="[^"]*">', '<link rel="canonical" href="{{ site.url }}{{ site.baseurl }}{{ page.url }}">', lay)
            lay = re.sub(r'<meta property="og:type" content="[^"]*">', '<meta property="og:type" content="{{ page.ogtype | default: \'website\' }}">', lay)
            lay = re.sub(r'<meta property="og:title" content="[^"]*">', '<meta property="og:title" content="{{ page.title }}">', lay)
            lay = re.sub(r'<meta property="og:description" content="[^"]*">', '<meta property="og:description" content="{{ page.description }}">', lay)
            lay = re.sub(r'<meta property="og:url" content="[^"]*">', '<meta property="og:url" content="{{ site.url }}{{ site.baseurl }}{{ page.url }}">', lay)
            lay = re.sub(r'<meta property="og:image" content="[^"]*">', '<meta property="og:image" content="{{ site.url }}{{ site.baseurl }}/assets/img/og.png">', lay)
            if extra: lay = lay.replace(extra.group(1) + "\n", "")
            foot_l = foot.replace(str(__import__("datetime").date.today().year), '{{ site.time | date: "%Y" }}', 1)
            open(os.path.join(OUT, "_layouts", "default.html"), "w", encoding="utf-8").write(lay + "\n{{ content }}\n" + foot_l)
            layout_written = True
        for name, pat in PATTERNS:
            m = re.search(pat, body, re.S)
            if m:
                captured.setdefault(name, m.group(1) if m.groups() else m.group(0))
                body = re.sub(pat, "{%% include %s.html %%}" % name, body, flags=re.S)
        chk = body.replace("{{ site.baseurl }}", "").replace("{% include", "")
        assert "{{" not in chk and "{%" not in chk, rel
        fm = ["---", "layout: default", "title: " + ystr(title), "description: " + ystr(desc)]
        if extra and "NewsArticle" in extra.group(1): fm.append("ogtype: article")
        if f == "404.html": fm.append("permalink: /404.html")
        fm.append("---")
        open(dest, "w", encoding="utf-8").write("\n".join(fm) + "\n" + (extra.group(1) + "\n" if extra else "") + body.strip() + "\n")

for name, html in captured.items():
    open(os.path.join(OUT, "_includes", name + ".html"), "w", encoding="utf-8").write(html)
open(os.path.join(OUT, "_config.yml"), "w").write('''title: DefenceIndia.com
url: https://webworksa1.github.io
# Project-pages path. For a custom domain (CNAME file), set baseurl to "" and url to https://defenceindia.com
baseurl: /DefenceIndia-com
markdown: kramdown
exclude: [build/build.py, build/pages.py, build/make_og.py, build/jekyll.py, build/content, docs, deploy, dist, site, README.md, PUBLISH.md, .gitignore]
''')
print("Jekyll-form site written to", OUT, "| includes:", sorted(captured))
