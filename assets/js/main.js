/* DefenceIndia.com — core behaviour: nav, theme, search, forms, ads, analytics, ticker, misc. */
(function () {
  "use strict";
  var C = window.DI_CONFIG || {};
  var root = document.documentElement;
  var ROOT = root.getAttribute("data-root") || "/";

  /* ---------- Contact address (never rendered in source) ---------- */
  function addr() { try { return atob(C.k).split("").reverse().join(""); } catch (e) { return ""; } }
  document.querySelectorAll("[data-mail]").forEach(function (a) {
    a.addEventListener("click", function (ev) {
      ev.preventDefault();
      var s = a.getAttribute("data-subject") || "Enquiry via DefenceIndia.com";
      window.location.href = "mailto:" + addr() + "?subject=" + encodeURIComponent(s);
    });
  });

  /* ---------- Theme ---------- */
  function setTheme(t) { root.setAttribute("data-theme", t); try { localStorage.setItem("di-theme", t); } catch (e) {} updateThemeBtn(); }
  function currentTheme() {
    var t = root.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function updateThemeBtn() { document.querySelectorAll(".theme-toggle").forEach(function (b) { b.textContent = currentTheme() === "dark" ? "☀" : "☾"; b.setAttribute("aria-label", "Toggle dark mode"); }); }
  try { var saved = localStorage.getItem("di-theme"); if (saved) root.setAttribute("data-theme", saved); } catch (e) {}
  updateThemeBtn();
  document.querySelectorAll(".theme-toggle").forEach(function (b) { b.addEventListener("click", function () { setTheme(currentTheme() === "dark" ? "light" : "dark"); }); });

  /* ---------- Mobile nav ---------- */
  var menuBtn = document.querySelector(".icon-btn.menu"), mob = document.querySelector(".mobile-nav");
  if (menuBtn && mob) menuBtn.addEventListener("click", function () { var o = mob.classList.toggle("open"); menuBtn.setAttribute("aria-expanded", o); });

  /* ---------- Active nav ---------- */
  var path = location.pathname;
  document.querySelectorAll(".nav a, .mobile-nav a").forEach(function (a) {
    var h = a.getAttribute("href"); if (!h) return;
    var p = h.replace(/index\.html$/, "");
    if (p !== ROOT && path.indexOf(p) === 0) a.classList.add("active");
  });

  /* ---------- Reading progress ---------- */
  var prog = document.querySelector(".progress");
  if (prog) window.addEventListener("scroll", function () { var h = document.documentElement; var pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100; prog.style.width = pct + "%"; }, { passive: true });

  /* ---------- Back to top ---------- */
  var bt = document.querySelector(".back-top");
  if (bt) { window.addEventListener("scroll", function () { bt.classList.toggle("show", window.scrollY > 600); }, { passive: true }); bt.addEventListener("click", function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }); }

  /* ---------- Cookie notice ---------- */
  var ck = document.querySelector(".cookie");
  if (ck) { try { if (!localStorage.getItem("di-cookie")) ck.classList.add("show"); } catch (e) { ck.classList.add("show"); }
    var okb = ck.querySelector("button"); if (okb) okb.addEventListener("click", function () { ck.classList.remove("show"); try { localStorage.setItem("di-cookie", "1"); } catch (e) {} }); }

  /* ---------- Ticker duplicate for seamless loop ---------- */
  var tt = document.querySelector(".ticker-track"); if (tt) tt.innerHTML += tt.innerHTML;

  /* ---------- Dates / countdowns ---------- */
  document.querySelectorAll("[data-countdown]").forEach(function (el) {
    var d = new Date(el.getAttribute("data-countdown") + "T00:00:00+05:30");
    function tick() { var ms = d - new Date(); if (ms <= 0) { el.textContent = "Closed / Check update"; return; }
      var days = Math.floor(ms / 864e5), hrs = Math.floor(ms % 864e5 / 36e5); el.textContent = days + "d " + hrs + "h left"; }
    tick(); setInterval(tick, 60000);
  });

  /* ---------- Community links from config ---------- */
  document.querySelectorAll("[data-link]").forEach(function (a) {
    var key = a.getAttribute("data-link"), v = key.split(".").reduce(function (o, k) { return o ? o[k] : null; }, C);
    if (v) a.href = v; else a.style.display = "none";
  });
  document.querySelectorAll("[data-config]").forEach(function (el) {
    var v = el.getAttribute("data-config").split(".").reduce(function (o, k) { return o ? o[k] : null; }, C);
    if (v) el.textContent = v;
  });

  /* ---------- AdSense / GA4 loaders (config-gated) ---------- */
  if (C.adsense && C.adsense.enabled && /^ca-pub-\d{10,}$/.test(C.adsense.client)) {
    var s = document.createElement("script"); s.async = true; s.crossOrigin = "anonymous";
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + C.adsense.client; document.head.appendChild(s);
    document.querySelectorAll(".ad[data-slot]").forEach(function (ad) {
      var slot = C.adsense.slots[ad.getAttribute("data-slot")]; if (!slot) return;
      ad.innerHTML = '<ins class="adsbygoogle" style="display:block" data-ad-client="' + C.adsense.client + '" data-ad-slot="' + slot + '" data-ad-format="auto" data-full-width-responsive="true"></ins>';
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    });
  }
  if (C.ga4 && /^G-[A-Z0-9]+$/.test(C.ga4)) {
    var g = document.createElement("script"); g.async = true; g.src = "https://www.googletagmanager.com/gtag/js?id=" + C.ga4; document.head.appendChild(g);
    window.dataLayer = window.dataLayer || []; function gtag() { dataLayer.push(arguments); } window.gtag = gtag; gtag("js", new Date()); gtag("config", C.ga4);
  }

  /* ---------- YouTube embeds from config ---------- */
  var yt = document.querySelector("[data-youtube-channel]");
  if (yt) {
    if (C.youtube && C.youtube.channelId && /^UC/.test(C.youtube.channelId)) {
      yt.innerHTML = '<iframe loading="lazy" src="https://www.youtube.com/embed/videoseries?list=UU' + C.youtube.channelId.slice(2) + '" title="Latest videos" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    } else {
      yt.innerHTML = '<div style="display:grid;place-items:center;height:100%;color:#fff;padding:20px;text-align:center"><div><b>Channel launching soon.</b><br><small>Set <code>youtube.channelId</code> in config.js to auto-embed latest uploads.</small></div></div>';
    }
  }
  var ytf = document.querySelector("[data-youtube-featured]");
  if (ytf && C.youtube && C.youtube.featured && C.youtube.featured.length) {
    ytf.innerHTML = C.youtube.featured.map(function (id) { return '<div class="video"><iframe loading="lazy" src="https://www.youtube.com/embed/' + id + '" allowfullscreen title="Video"></iframe></div>'; }).join("");
  }

  /* ---------- Forms (all deliver to the configured inbox; address never in markup) ---------- */
  function track(name) { if (window.gtag) gtag("event", name); }
  document.querySelectorAll("form[data-di-form]").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var status = form.querySelector(".form-status"); var btn = form.querySelector("button[type=submit]");
      if (form.querySelector(".hp") && form.querySelector(".hp").value) return; /* honeypot */
      var req = form.querySelectorAll("[required]"), ok = true;
      req.forEach(function (f) { if (!f.value || (f.type === "checkbox" && !f.checked)) { ok = false; f.style.outline = "2px solid #c0392b"; } else f.style.outline = ""; });
      if (!ok) { status.className = "form-status err"; status.textContent = "Please fill all required fields."; return; }
      var data = {}; new FormData(form).forEach(function (v, k) { data[k] = data[k] ? data[k] + ", " + v : v; });
      data._subject = "[DefenceIndia.com] " + (form.getAttribute("data-di-form") || "Form") + " — " + (data.name || data.company || "");
      data._template = "table"; data._captcha = "false"; data.page = location.href; delete data._hp;
      btn.disabled = true; btn.textContent = "Sending…";
      fetch(C.formEndpoint + addr(), { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().catch(function () { return { success: "true" }; }); })
        .then(function () {
          status.className = "form-status ok"; status.textContent = form.getAttribute("data-success") || "Thank you — we received your submission and will respond shortly.";
          form.reset(); track("lead_" + (form.getAttribute("data-di-form") || "form").toLowerCase().replace(/\W+/g, "_"));
          var next = form.getAttribute("data-next"); if (next) setTimeout(function () { location.href = next; }, 1200);
        })
        .catch(function () {
          /* Fallback: open mail client with the payload so no lead is lost. */
          var body = Object.keys(data).filter(function (k) { return k[0] !== "_"; }).map(function (k) { return k + ": " + data[k]; }).join("\n");
          window.location.href = "mailto:" + addr() + "?subject=" + encodeURIComponent(data._subject) + "&body=" + encodeURIComponent(body);
          status.className = "form-status ok"; status.textContent = "Opening your email app to send this enquiry.";
        })
        .finally(function () { btn.disabled = false; btn.textContent = btn.getAttribute("data-label") || "Submit"; });
    });
  });

  /* ---------- Multi-step lead form ---------- */
  document.querySelectorAll("[data-step-form]").forEach(function (form) {
    var steps = form.querySelectorAll(".step"), bars = form.querySelectorAll(".steps span"), i = 0;
    function show() { steps.forEach(function (s, n) { s.style.display = n === i ? "" : "none"; }); bars.forEach(function (b, n) { b.classList.toggle("on", n <= i); }); }
    form.querySelectorAll("[data-next-step]").forEach(function (b) { b.addEventListener("click", function () {
      var ok = true; steps[i].querySelectorAll("[required]").forEach(function (f) { if (!f.value) { ok = false; f.style.outline = "2px solid #c0392b"; } else f.style.outline = ""; });
      if (ok && i < steps.length - 1) { i++; show(); } }); });
    form.querySelectorAll("[data-prev-step]").forEach(function (b) { b.addEventListener("click", function () { if (i > 0) { i--; show(); } }); });
    show();
  });

  /* ---------- Site search (client-side index) ---------- */
  var sIn = document.querySelector("#site-search"), sOut = document.querySelector("#search-results");
  if (sIn && sOut) {
    var idx = null;
    function load(cb) { if (idx) return cb(idx); fetch(ROOT + "search-index.json").then(function (r) { return r.json(); }).then(function (j) { idx = j; cb(idx); }); }
    function run() { var q = sIn.value.trim().toLowerCase(); if (q.length < 2) { sOut.innerHTML = ""; return; }
      load(function (items) { var terms = q.split(/\s+/); var res = items.map(function (it) { var hay = (it.t + " " + it.d + " " + (it.k || "")).toLowerCase(); var score = 0; terms.forEach(function (t) { if (it.t.toLowerCase().indexOf(t) > -1) score += 3; if (hay.indexOf(t) > -1) score += 1; }); return [score, it]; }).filter(function (x) { return x[0] > 0; }).sort(function (a, b) { return b[0] - a[0]; }).slice(0, 25);
        sOut.innerHTML = res.length ? res.map(function (x) { return '<a href="' + ROOT + x[1].u + '"><b>' + x[1].t + '</b><small>' + x[1].c + ' — ' + x[1].d + '</small></a>'; }).join("") : '<p class="muted">No results. Try another keyword.</p>'; }); }
    sIn.addEventListener("input", run);
    var qp = new URLSearchParams(location.search).get("q"); if (qp) { sIn.value = qp; run(); }
  }
  document.querySelectorAll("form[data-search]").forEach(function (f) { f.addEventListener("submit", function (e) { e.preventDefault(); location.href = ROOT + "search/?q=" + encodeURIComponent(f.querySelector("input").value); }); });

  /* ---------- Share links ---------- */
  document.querySelectorAll("[data-share]").forEach(function (a) {
    var u = encodeURIComponent(location.href), t = encodeURIComponent(document.title), k = a.getAttribute("data-share");
    var map = { x: "https://twitter.com/intent/tweet?url=" + u + "&text=" + t, wa: "https://api.whatsapp.com/send?text=" + t + "%20" + u, fb: "https://www.facebook.com/sharer/sharer.php?u=" + u, li: "https://www.linkedin.com/sharing/share-offsite/?url=" + u, tg: "https://t.me/share/url?url=" + u + "&text=" + t };
    if (map[k]) { a.href = map[k]; a.target = "_blank"; a.rel = "noopener"; }
    if (k === "copy") a.addEventListener("click", function (e) { e.preventDefault(); navigator.clipboard && navigator.clipboard.writeText(location.href); a.textContent = "Copied!"; });
  });

  /* ---------- Generic table filter ---------- */
  document.querySelectorAll("[data-filter-table]").forEach(function (inp) {
    var t = document.querySelector(inp.getAttribute("data-filter-table"));
    inp.addEventListener("input", function () { var q = inp.value.toLowerCase(); t.querySelectorAll("tbody tr").forEach(function (r) { r.style.display = r.textContent.toLowerCase().indexOf(q) > -1 ? "" : "none"; }); });
  });
})();
