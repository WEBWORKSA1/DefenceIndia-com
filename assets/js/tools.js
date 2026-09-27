/* DefenceIndia.com — interactive tools: eligibility checker, salary calculator, compare, power index, quiz. */
(function () {
  "use strict";
  var ROOT = document.documentElement.getAttribute("data-root") || "/";
  function getJSON(u, cb) { fetch(ROOT + "build/data/" + u).then(function (r) { return r.json(); }).then(cb); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---------- Eligibility checker ---------- */
  var elig = document.querySelector("#eligibility-form");
  if (elig) {
    getJSON("exams.json", function (exams) {
      elig.addEventListener("submit", function (e) {
        e.preventDefault();
        var dob = new Date(elig.dob.value), gender = elig.gender.value, qual = parseInt(elig.qual.value, 10), stream = elig.stream.value;
        if (isNaN(dob)) return;
        var age = (new Date() - dob) / (365.25 * 864e5);
        var out = document.querySelector("#eligibility-result");
        var rows = exams.filter(function (x) { return age >= x.ageMin - 0.01 && age <= x.ageMax + 0.99 && qual >= x.qualLevel; })
          .filter(function (x) { return !(gender === "F" && /^Men$/.test(x.gender)); })
          .filter(function (x) { if (stream === "nonpcm" && /PCM|Maths & Physics|Physics & Maths/.test(x.qual) && x.qualLevel <= 12) return false; return true; })
          .sort(function (a, b) { return a.nextDate > b.nextDate ? 1 : -1; });
        var soon = rows.filter(function (x) { var d = (new Date(x.nextDate) - new Date()) / 864e5; return d > 0 && d < 240; });
        out.innerHTML = '<div class="result"><h4>You are ' + age.toFixed(1) + ' years old — ' + rows.length + ' entries match</h4>' +
          (rows.length ? '<div class="table-wrap"><table class="data"><thead><tr><th>Entry</th><th>Level</th><th>Age band</th><th>Next exam / cycle</th><th></th></tr></thead><tbody>' +
            rows.map(function (x) { return '<tr><td><a href="' + ROOT + 'careers/' + x.slug + '/"><b>' + esc(x.short) + '</b></a><br><small>' + esc(x.service) + '</small></td><td>' + esc(x.level) + '</td><td>' + x.ageMin + '–' + x.ageMax + '</td><td>' + x.nextDate + '<br><small class="countdown" data-countdown="' + x.nextDate + '"></small></td><td><a class="btn btn-primary" style="padding:8px 12px;font-size:.85rem" href="' + ROOT + 'counselling/?exam=' + x.slug + '">Get guidance</a></td></tr>'; }).join("") + '</tbody></table></div>' : '<p>No open entry matches these inputs. Try the Territorial Army (up to 42) or check qualification details.</p>') +
          (soon.length ? '<p class="small muted" style="margin-top:10px">' + soon.length + ' of these have a cycle within the next 8 months — talk to a counsellor now.</p>' : '') + '</div>';
        out.querySelectorAll("[data-countdown]").forEach(function (el) { var d = new Date(el.getAttribute("data-countdown") + "T00:00:00+05:30"); var ms = d - new Date(); el.textContent = ms > 0 ? Math.floor(ms / 864e5) + " days left" : "check update"; });
        var hidden = document.querySelector("#lead-exam"); if (hidden && rows[0]) hidden.value = rows.map(function (x) { return x.short; }).slice(0, 4).join(", ");
        var lead = document.querySelector("#lead-after-elig"); if (lead) lead.style.display = "";
        out.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  /* ---------- Salary calculator (7th CPC pay matrix — indicative) ---------- */
  var sal = document.querySelector("#salary-form");
  if (sal) {
    var ranks = {
      "Agniveer (Year 1)": { basic: 30000, msp: 0, level: "Agnipath package", note: "Rises to ₹33,000 / ₹36,500 / ₹40,000 in years 2-4; 30% goes to Seva Nidhi corpus." },
      "Sepoy / Sailor / Airman (Level 3)": { basic: 21700, msp: 5200, level: "Level 3" },
      "Naik (Level 4)": { basic: 25500, msp: 5200, level: "Level 4" },
      "Havildar (Level 5)": { basic: 29200, msp: 5200, level: "Level 5" },
      "Naib Subedar (Level 6)": { basic: 35400, msp: 5200, level: "Level 6" },
      "Subedar (Level 7)": { basic: 44900, msp: 5200, level: "Level 7" },
      "Subedar Major (Level 8)": { basic: 47600, msp: 5200, level: "Level 8" },
      "Lieutenant / Sub Lt / Flying Officer (Level 10)": { basic: 56100, msp: 15500, level: "Level 10" },
      "Captain / Lt / Flt Lt (Level 10B)": { basic: 61300, msp: 15500, level: "Level 10B" },
      "Major / Lt Cdr / Sqn Ldr (Level 11)": { basic: 69400, msp: 15500, level: "Level 11" },
      "Lt Colonel / Cdr / Wg Cdr (Level 12A)": { basic: 121200, msp: 15500, level: "Level 12A" },
      "Colonel / Captain (IN) / Gp Capt (Level 13)": { basic: 130600, msp: 15500, level: "Level 13" },
      "Brigadier / Cdre / Air Cmde (Level 13A)": { basic: 139600, msp: 15500, level: "Level 13A" },
      "Major General / Rear Adm / AVM (Level 14)": { basic: 144200, msp: 0, level: "Level 14" }
    };
    var sel = sal.querySelector("select[name=rank]"); Object.keys(ranks).forEach(function (k) { var o = document.createElement("option"); o.value = k; o.textContent = k; sel.appendChild(o); });
    sal.addEventListener("submit", function (e) {
      e.preventDefault();
      var r = ranks[sel.value], city = sal.city.value, da = parseFloat(sal.da.value) || 55, field = sal.field.checked;
      var hraPct = { X: 0.30, Y: 0.20, Z: 0.10 }[city];
      var daAmt = Math.round((r.basic + r.msp) * da / 100), hra = Math.round(r.basic * hraPct), ta = city === "X" ? 7200 : 3600;
      var fieldAllow = field ? (r.msp >= 15500 ? 16900 : 6000) : 0;
      var gross = r.basic + r.msp + daAmt + hra + ta + fieldAllow;
      document.querySelector("#salary-result").innerHTML = '<div class="result"><h4>Estimated monthly gross: ₹' + gross.toLocaleString("en-IN") + '</h4>' +
        '<div class="spec"><div>Basic pay (' + r.level + ')</div><div>₹' + r.basic.toLocaleString("en-IN") + '</div><div>Military Service Pay</div><div>₹' + r.msp.toLocaleString("en-IN") + '</div><div>Dearness allowance (' + da + '%)</div><div>₹' + daAmt.toLocaleString("en-IN") + '</div><div>HRA (' + city + ' city, ' + hraPct * 100 + '%)</div><div>₹' + hra.toLocaleString("en-IN") + '</div><div>Transport allowance</div><div>₹' + ta.toLocaleString("en-IN") + '</div><div>Field / high-altitude allowance</div><div>₹' + fieldAllow.toLocaleString("en-IN") + '</div></div>' +
        '<p class="small muted" style="margin-top:10px">' + (r.note || "Excludes flying/submarine/Siachen allowances, uniform allowance and deductions (AGIF, income tax). Indicative only.") + '</p></div>';
    });
  }

  /* ---------- Equipment compare ---------- */
  var cmp = document.querySelector("#compare-tool");
  if (cmp) {
    getJSON("equipment.json", function (eq) {
      var selects = cmp.querySelectorAll("select"), byS = {}; eq.forEach(function (x) { byS[x.slug] = x; });
      selects.forEach(function (s) { eq.forEach(function (x) { var o = document.createElement("option"); o.value = x.slug; o.textContent = x.name + " (" + x.cat + ")"; s.appendChild(o); }); });
      var qs = new URLSearchParams(location.search); if (qs.get("a")) selects[0].value = qs.get("a"); if (qs.get("b")) selects[1].value = qs.get("b");
      if (!qs.get("a")) { selects[0].value = "tejas-mk1a"; selects[1].value = "rafale"; }
      function render() {
        var items = Array.prototype.map.call(selects, function (s) { return byS[s.value]; }).filter(Boolean);
        var keys = {}; items.forEach(function (x) { Object.keys(x.specs).forEach(function (k) { keys[k] = 1; }); });
        var sc = ["speed", "range", "payload", "tech"];
        document.querySelector("#compare-out").innerHTML = '<div class="compare-cols">' + items.map(function (x) {
          return '<div class="card"><div class="thumb ' + cls(x.cat) + '">' + esc(x.name) + '</div><div class="body"><span class="badge">' + esc(x.cat) + '</span><p>' + esc(x.type) + ' · ' + esc(x.origin) + '</p>' +
            sc.map(function (k) { return '<div><small>' + k.charAt(0).toUpperCase() + k.slice(1) + ' index ' + x.score[k] + '</small><div class="bar"><i style="width:' + x.score[k] + '%"></i></div></div>'; }).join("") + '</div></div>';
        }).join("") + '</div><div class="table-wrap" style="margin-top:18px"><table class="data"><thead><tr><th>Specification</th>' + items.map(function (x) { return "<th>" + esc(x.name) + "</th>"; }).join("") + '</tr></thead><tbody>' +
          Object.keys(keys).map(function (k) { return "<tr><td><b>" + esc(k) + "</b></td>" + items.map(function (x) { return "<td>" + esc(x.specs[k] || "—") + "</td>"; }).join("") + "</tr>"; }).join("") + '</tbody></table></div>';
      }
      function cls(c) { return { Aircraft: "air", Helicopters: "air", "Land Systems": "army", Missiles: "missile", Naval: "navy", Drones: "industry" }[c] || ""; }
      selects.forEach(function (s) { s.addEventListener("change", render); }); render();
    });
  }

  /* ---------- Equipment listing filters ---------- */
  var eqGrid = document.querySelector("#equipment-grid");
  if (eqGrid) {
    var cat = document.querySelector("#eq-cat"), q = document.querySelector("#eq-q");
    function filt() { var c = cat.value, s = q.value.toLowerCase(); eqGrid.querySelectorAll(".card").forEach(function (k) { var ok = (!c || k.getAttribute("data-cat") === c) && (!s || k.textContent.toLowerCase().indexOf(s) > -1); k.style.display = ok ? "" : "none"; }); }
    cat.addEventListener("change", filt); q.addEventListener("input", filt);
  }

  /* ---------- Country power comparison ---------- */
  var pw = document.querySelector("#power-tool");
  if (pw) {
    getJSON("compare.json", function (d) {
      var sels = pw.querySelectorAll("select"); Object.keys(d.countries).forEach(function (c) { sels.forEach(function (s) { var o = document.createElement("option"); o.value = c; o.textContent = c; s.appendChild(o); }); });
      sels[0].value = "India"; sels[1].value = "Pakistan"; if (sels[2]) sels[2].value = "China";
      function render() {
        var cs = Array.prototype.map.call(sels, function (s) { return s.value; });
        document.querySelector("#power-out").innerHTML = '<div class="table-wrap"><table class="data"><thead><tr><th>Metric</th>' + cs.map(function (c) { return "<th>" + c + "</th>"; }).join("") + '</tr></thead><tbody>' +
          d.metrics.map(function (m, i) { var vals = cs.map(function (c) { return d.countries[c][i]; }); var best = m.indexOf("rank") > -1 ? Math.min.apply(null, vals) : Math.max.apply(null, vals);
            return "<tr><td><b>" + m + "</b></td>" + vals.map(function (v) { return "<td" + (v === best ? ' style="color:var(--saffron);font-weight:800"' : "") + ">" + v.toLocaleString("en-IN") + "</td>"; }).join("") + "</tr>"; }).join("") + '</tbody></table></div><p class="small muted" style="margin-top:8px">' + d.note + '</p>';
      }
      sels.forEach(function (s) { s.addEventListener("change", render); }); render();
    });
  }

  /* ---------- Quiz ---------- */
  var quiz = document.querySelector("#quiz");
  if (quiz) {
    var Q = [
      ["Which Indian missile is the fastest operational cruise missile in the world?", ["Agni-V", "BrahMos", "Nirbhay", "Akash"], 1],
      ["INS Vikrant was built at which shipyard?", ["Mazagon Dock", "GRSE Kolkata", "Cochin Shipyard", "Hindustan Shipyard"], 2],
      ["The NDA is located at", ["Dehradun", "Ezhimala", "Khadakwasla", "Dundigal"], 2],
      ["Which helicopter is designed to operate at Siachen altitudes with weapons?", ["Apache", "Prachand", "Chinook", "Mi-17"], 1],
      ["Agniveers are enrolled for how many years?", ["2", "4", "7", "10"], 1],
      ["The S-400 system is nicknamed in India as", ["Sudarshan Chakra", "Trishul", "Vajra", "Brahmastra"], 0],
      ["Which agency conducts the CDS examination?", ["SSC", "NTA", "UPSC", "MoD"], 2],
      ["Mission Divyastra (2024) tested which capability?", ["Hypersonic glide", "MIRV on Agni-V", "ASAT", "Submarine-launched cruise missile"], 1],
      ["The Tejas Mk1A's engine is the", ["GE F414", "GE F404", "Kaveri", "AL-31FP"], 1],
      ["ATAGS is a 155 mm gun developed by", ["DRDO ARDE", "HAL", "BEL", "OFB only"], 0]
    ];
    var i = 0, score = 0;
    function show() {
      if (i >= Q.length) { quiz.innerHTML = '<div class="result"><h4>Your score: ' + score + ' / ' + Q.length + '</h4><p>' + (score >= 8 ? "Officer material. Enter the championship below and put your name on the leaderboard." : "Good attempt — read the Equipment and Careers hubs and come back.") + '</p><button class="btn btn-outline" onclick="location.reload()">Retry</button></div>'; var sc = document.querySelector("#quiz-score"); if (sc) sc.value = score + "/" + Q.length; return; }
      var q = Q[i];
      quiz.innerHTML = '<p class="muted small">Question ' + (i + 1) + ' of ' + Q.length + '</p><h3>' + q[0] + '</h3><div class="chips">' + q[1].map(function (o, n) { return '<label><input type="radio" name="q" value="' + n + '"><span>' + o + '</span></label>'; }).join("") + '</div><button class="btn btn-primary" style="margin-top:14px" id="qn">Next</button>';
      quiz.querySelector("#qn").addEventListener("click", function () { var v = quiz.querySelector("input[name=q]:checked"); if (!v) return; if (parseInt(v.value, 10) === q[2]) score++; i++; show(); });
    }
    show();
  }

  /* ---------- Exam calendar sort/filter ---------- */
  var cal = document.querySelector("#exam-calendar");
  if (cal) { var f = document.querySelector("#cal-level"); if (f) f.addEventListener("change", function () { cal.querySelectorAll("tbody tr").forEach(function (r) { r.style.display = !f.value || r.getAttribute("data-level") === f.value ? "" : "none"; }); }); }
})();
