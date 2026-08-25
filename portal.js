(function () {
  var KEY_THEME = "unit2-theme";
  var KEY_DONE = "unit2-done";
  var KEY_LAST = "unit2-last";

  var CHAPTERS = [
    { id: "ch-intro", n: "01", title: "Servlets Introduction", href: "topics/01-intro/theory.html" },
    { id: "ch-http", n: "02", title: "HTTP Methods", href: "httpmethods.html?back=ch-http" },
    { id: "ch-getpost", n: "03", title: "GET vs POST", href: "getpostdiff.html?back=ch-getpost" },
    { id: "ch-lifecycle", n: "04", title: "Servlet Lifecycle", href: "lifecycle.html?back=ch-lifecycle" },
    { id: "ch-config", n: "05", title: "Config and Context", href: "configcontext.html?back=ch-config" },
    { id: "ch-fwd", n: "06", title: "Forward and Redirect", href: "forward.html?back=ch-fwd" },
    { id: "ch-cookies", n: "07", title: "Cookies", href: "cookie.html?back=ch-cookies" },
    { id: "ch-session", n: "08", title: "HttpSession", href: "session_notes_login.html?back=ch-session" },
    { id: "ch-url", n: "09", title: "URL Rewriting", href: "url.html?back=ch-url" },
    { id: "ch-hidden", n: "10", title: "Hidden Form Field", href: "hidden_login.html?back=ch-hidden" },
    { id: "ch-capstone", n: "11", title: "Capstone Portal", href: "capstone.html?back=ch-capstone" }
  ];

  function base() {
    var p = location.pathname.replace(/\\/g, "/");
    if (p.indexOf("/topics/") !== -1) return "../../";
    if (p.indexOf("/source/") !== -1) return "../";
    return "";
  }

  function loadDone() {
    try { return JSON.parse(localStorage.getItem(KEY_DONE) || "{}"); }
    catch (e) { return {}; }
  }
  function saveDone(m) { localStorage.setItem(KEY_DONE, JSON.stringify(m)); }

  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem(KEY_THEME, t);
    var b = document.getElementById("themeBtn");
    if (b) b.textContent = t === "dark" ? "Light" : "Dark";
  }

  function doneCount() {
    var m = loadDone();
    return CHAPTERS.filter(function (c) { return m[c.id]; }).length;
  }

  function currentTab() {
    var p = location.pathname.replace(/\\/g, "/").toLowerCase();
    if (p.indexOf("practicals") !== -1) return "ica";
    if (p.indexOf("programs") !== -1) return "programs";
    if (p.indexOf("/topics/") !== -1 || /\/theory\.html$/.test(p)) return "theory";
    if (p.indexOf("/source/") !== -1) return "programs";
    if (p.indexOf("quiz") !== -1) return "quiz";
    if (p.indexOf("setup") !== -1) return "home";
    if (p.indexOf("index.html") !== -1 || /\/basic-servlets\/?$/.test(p)) return "home";
    return "programs";
  }

  function tabsHtml(b, active) {
    function a(id, href, label) {
      return '<a href="' + b + href + '"' + (active === id ? ' class="on"' : "") + ">" + label + "</a>";
    }
    return '<nav class="tabs" aria-label="Main">' +
      a("home", "index.html", "Home") +
      a("theory", "theory.html", "Theory") +
      a("programs", "programs.html", "Programs") +
      a("ica", "practicals.html", "ICA Practicals") +
      "</nav>";
  }

  function injectChrome() {
    var b = base();
    var active = currentTab();
    var existing = document.querySelector(".sitebar");
    if (existing) {
      if (!existing.querySelector(".tabs")) {
        var brand = existing.querySelector(".brand");
        var nav = document.createElement("div");
        nav.innerHTML = tabsHtml(b, active);
        if (brand && brand.nextSibling) existing.insertBefore(nav.firstChild, brand.nextSibling);
        else existing.insertBefore(nav.firstChild, existing.firstChild);
      } else {
        existing.querySelectorAll(".tabs a").forEach(function (x) {
          var href = (x.getAttribute("href") || "").toLowerCase();
          var on = (active === "theory" && href.indexOf("theory.html") !== -1) ||
            (active === "programs" && href.indexOf("programs.html") !== -1) ||
            (active === "ica" && href.indexOf("practicals.html") !== -1) ||
            (active === "home" && href.indexOf("index.html") !== -1);
          x.classList.toggle("on", on);
        });
      }
      return;
    }
    var bar = document.createElement("header");
    bar.className = "sitebar";
    bar.innerHTML =
      '<a class="brand" href="' + b + 'index.html">' +
        '<span class="mark">II</span> Unit-II Lab' +
      "</a>" +
      tabsHtml(b, active) +
      '<div class="grow"></div>' +
      '<span class="hint">Press <span class="kbd">Ctrl</span> <span class="kbd">K</span></span>' +
      '<button class="iconbtn" type="button" id="paletteBtn" title="Jump">Jump</button>' +
      '<button class="iconbtn" type="button" id="themeBtn">Dark</button>';
    document.body.insertBefore(bar, document.body.firstChild);

    var rb = document.createElement("div");
    rb.className = "read-bar";
    rb.id = "readBar";
    document.body.appendChild(rb);
  }

  function wireTheme() {
    var saved = localStorage.getItem(KEY_THEME) || "light";
    applyTheme(saved);
    var btn = document.getElementById("themeBtn");
    if (btn) {
      btn.addEventListener("click", function () {
        applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
      });
    }
  }

  function copyButtons() {
    document.querySelectorAll("pre.syntax, pre.code").forEach(function (pre) {
      if (pre.querySelector(".copy-btn")) return;
      pre.style.position = "relative";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.textContent = "Copy";
      btn.addEventListener("click", function () {
        var t = pre.innerText.replace(/\s*Copy\s*$/, "");
        navigator.clipboard.writeText(t).then(function () {
          btn.textContent = "Copied";
          setTimeout(function () { btn.textContent = "Copy"; }, 1200);
        });
      });
      pre.appendChild(btn);
    });
  }

  function trackVisit() {
    var p = location.pathname.replace(/\\/g, "/").toLowerCase();
    var map = [
      ["01-intro", "ch-intro"],
      ["02-http", "ch-http"],
      ["httpmethods", "ch-http"],
      ["sample-registration", "ch-http"],
      ["03-getpost", "ch-getpost"],
      ["getpostdiff", "ch-getpost"],
      ["04-lifecycle", "ch-lifecycle"],
      ["lifecycle", "ch-lifecycle"],
      ["05-config", "ch-config"],
      ["configcontext", "ch-config"],
      ["06-forward", "ch-fwd"],
      ["forward.html", "ch-fwd"],
      ["redirect", "ch-fwd"],
      ["07-cookies", "ch-cookies"],
      ["cookie", "ch-cookies"],
      ["08-httpsession", "ch-session"],
      ["session_", "ch-session"],
      ["09-urlrewrite", "ch-url"],
      ["url.html", "ch-url"],
      ["url2", "ch-url"],
      ["10-hidden", "ch-hidden"],
      ["hidden_", "ch-hidden"],
      ["11-capstone", "ch-capstone"],
      ["capstone", "ch-capstone"]
    ];
    var id = null;
    for (var i = 0; i < map.length; i++) {
      if (p.indexOf(map[i][0]) !== -1) { id = map[i][1]; break; }
    }
    if (id) {
      localStorage.setItem(KEY_LAST, id);
      var m = loadDone();
      m[id + ":seen"] = true;
      saveDone(m);
    }
  }

  function readingBar() {
    var bar = document.getElementById("readBar");
    if (!bar) return;
    function upd() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max <= 0 ? 0 : (h.scrollTop / max) * 100) + "%";
    }
    window.addEventListener("scroll", upd, { passive: true });
    upd();
  }

  function palette() {
    if (document.querySelector(".palette-bg")) return;
    var b = base();
    var bg = document.createElement("div");
    bg.className = "palette-bg";
    bg.innerHTML =
      '<div class="palette" role="dialog" aria-label="Jump to chapter">' +
        '<input type="search" id="paletteQ" placeholder="Jump to chapter, setup, quiz…" autocomplete="off">' +
        '<div class="palette-list" id="paletteList"></div>' +
      "</div>";
    document.body.appendChild(bg);

    var items = CHAPTERS.map(function (c) {
      return { t: c.n + "  " + c.title, h: b + c.href };
    });
    items.push({ t: "Home", h: b + "index.html" });
    items.push({ t: "Theory — complete visual notes", h: b + "theory.html" });
    items.push({ t: "Programs — execute online", h: b + "programs.html" });
    items.push({ t: "ICA Practicals — 4 lab-manual practicals", h: b + "practicals.html" });
    items.push({ t: "Complete web.xml (commented)", h: b + "webxml.html" });
    items.push({ t: "Lab Setup", h: b + "setup.html" });
    items.push({ t: "Self-check Quiz", h: b + "quiz.html" });
    items.push({ t: "Sample registration form", h: b + "sample-registration.html" });

    var q = document.getElementById("paletteQ");
    var list = document.getElementById("paletteList");

    function render(filter) {
      var f = (filter || "").toLowerCase();
      list.innerHTML = "";
      items.filter(function (it) { return it.t.toLowerCase().indexOf(f) !== -1; })
        .forEach(function (it, i) {
          var a = document.createElement("a");
          a.href = it.h;
          a.textContent = it.t;
          if (i === 0) a.className = "active";
          list.appendChild(a);
        });
    }

    function open() {
      bg.classList.add("open");
      q.value = "";
      render("");
      setTimeout(function () { q.focus(); }, 0);
    }
    function close() { bg.classList.remove("open"); }

    render("");
    q.addEventListener("input", function () { render(q.value); });
    q.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        var a = list.querySelector("a");
        if (a) location.href = a.href;
      }
      if (e.key === "Escape") close();
    });
    bg.addEventListener("click", function (e) { if (e.target === bg) close(); });

    var openBtn = document.getElementById("paletteBtn");
    if (openBtn) openBtn.addEventListener("click", open);

    document.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (bg.classList.contains("open")) close(); else open();
      }
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        var tag = (e.target && e.target.tagName) || "";
        if (tag !== "INPUT" && tag !== "TEXTAREA") {
          var homeQ = document.getElementById("q");
          if (homeQ) { e.preventDefault(); homeQ.focus(); }
          else { e.preventDefault(); open(); }
        }
      }
    });
  }

  function enhanceIndex() {
    var grid = document.getElementById("chapters");
    if (!grid) return;
    var done = loadDone();
    var last = localStorage.getItem(KEY_LAST);

    function paint() {
      done = loadDone();
      var n = 0;
      document.querySelectorAll(".ch-card").forEach(function (card) {
        var id = card.getAttribute("data-id");
        var on = !!done[id];
        card.classList.toggle("done", on);
        var mk = card.querySelector(".mark-done");
        if (mk) {
          mk.classList.toggle("on", on);
          mk.textContent = on ? "Completed ✓" : "Mark completed";
        }
        if (on) n++;
      });
      document.querySelectorAll(".path a").forEach(function (a) {
        a.classList.toggle("done", !!done[a.getAttribute("data-id")]);
      });
      var el = document.getElementById("statDone");
      if (el) el.textContent = n + "/11";
      var bar = document.getElementById("statPct");
      if (bar) bar.textContent = Math.round((n / 11) * 100) + "%";
    }

    grid.addEventListener("click", function (e) {
      var btn = e.target.closest(".mark-done");
      if (!btn) return;
      var card = btn.closest(".ch-card");
      var id = card.getAttribute("data-id");
      var m = loadDone();
      if (m[id]) delete m[id]; else m[id] = true;
      saveDone(m);
      paint();
    });

    var resume = document.getElementById("resumeLink");
    if (resume && last) {
      var ch = CHAPTERS.filter(function (c) { return c.id === last; })[0];
      if (ch) {
        resume.href = ch.href;
        resume.textContent = "Resume " + ch.n + " · " + ch.title;
      }
    }

    var q = document.getElementById("q");
    var filter = "all";
    function applyFilter() {
      var term = (q && q.value || "").toLowerCase();
      document.querySelectorAll(".ch-card").forEach(function (card) {
        var hay = (card.getAttribute("data-tags") + " " + card.innerText).toLowerCase();
        var kind = card.getAttribute("data-kind");
        var okKind = filter === "all" || kind === filter || (filter === "lab" && kind === "lab") ||
          (filter === "project" && kind === "project") || (filter === "theory" && kind === "theory");
        card.classList.toggle("hidden", !(okKind && hay.indexOf(term) !== -1));
      });
    }
    if (q) q.addEventListener("input", applyFilter);
    document.querySelectorAll(".filters button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        filter = btn.getAttribute("data-filter");
        document.querySelectorAll(".filters button").forEach(function (x) { x.classList.toggle("on", x === btn); });
        applyFilter();
      });
    });

    paint();
  }

  function quizPage() {
    var root = document.getElementById("quizRoot");
    if (!root) return;
    var qs = [
      { q: "Where does servlet code run?", a: ["In the browser JavaScript engine", "On the server inside Tomcat", "Inside web.xml only", "On the student's laptop JDK only"], c: 1, why: "The browser only sends HTTP and shows HTML. Tomcat runs the Java class." },
      { q: "Tomcat 11.0.24 programs in this lab must import:", a: ["javax.servlet.*", "jakarta.servlet.*", "java.servlet.*", "org.apache.jsp.*"], c: 1, why: "Tomcat 11 is Jakarta EE 11 / Servlet 6.1." },
      { q: "A login form with a password should use:", a: ["GET so the password is in the address bar for debugging", "POST so the password stays in the request body", "TRACE", "OPTIONS"], c: 1, why: "GET puts query data in the URL. Never put passwords there." },
      { q: "init() of a servlet runs:", a: ["On every browser refresh", "Once when the servlet is loaded", "Only after destroy()", "Once per open tab"], c: 1, why: "Lifecycle: load → init once → service/doGet many times → destroy once." },
      { q: "ServletContext is shared by:", a: ["Only one servlet", "All servlets in this web application", "All webapps on the machine", "Only the browser"], c: 1, why: "Context-param values (college, department) are app-wide. Config is per servlet." },
      { q: "After RequestDispatcher.forward, the browser address bar:", a: ["Always changes to the target servlet URL", "Stays on the original URL", "Clears to localhost:8080", "Shows the password"], c: 1, why: "Forward is server-side. Redirect (302) is the one that changes the URL." },
      { q: "A cookie is stored:", a: ["Only in HttpSession on the server", "In the browser, sent back on later requests", "Inside web.xml", "In PrintWriter"], c: 1, why: "Cookie = client-side name/value. Session = server-side map + session id." },
      { q: "HttpSession.setAttribute stores data:", a: ["In the address bar", "On the server, keyed by session id", "In a hidden field only", "In web.xml context-param"], c: 1, why: "Welcome pages read the name from session, not from a cookie (cookie is optional remember)." },
      { q: "URL rewriting is used when:", a: ["You want prettier CSS", "Cookies may be disabled, so the session id is put in the link", "You must hide the password", "destroy() failed"], c: 1, why: "encodeURL / extra path info carries jsessionid if the browser will not store a cookie." },
      { q: "A hidden form field:", a: ["Can never be seen by the user", "Is not in the address bar, but is visible in View Source", "Is stored by Tomcat like HttpSession", "Replaces web.xml"], c: 1, why: "type=hidden is still HTML. Students can see it in page source." },
      { q: "Capstone success path uses:", a: ["GET login + redirect to Google", "POST + session + remember cookie + forward to Welcome", "Only cookies, no session", "TRACE then DELETE"], c: 1, why: "That is the mini-project: join POST, session, cookie, forward, include, invalidate." },
      { q: "Logout should:", a: ["Only hide the Welcome HTML with CSS", "session.invalidate() and delete the remember cookie", "Call destroy() on every servlet", "Restart Tomcat"], c: 1, why: "invalidate() drops server session data. setMaxAge(0) drops the cookie." }
    ];
    var score = 0, answered = 0;
    qs.forEach(function (item, i) {
      var card = document.createElement("div");
      card.className = "quiz-card";
      var h = document.createElement("h3");
      h.textContent = (i + 1) + ". " + item.q;
      card.appendChild(h);
      item.a.forEach(function (lab, j) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "opt";
        btn.textContent = lab;
        btn.addEventListener("click", function () {
          if (card.getAttribute("data-lock")) return;
          card.setAttribute("data-lock", "1");
          answered++;
          var ok = j === item.c;
          if (ok) score++;
          card.querySelectorAll(".opt").forEach(function (o, k) {
            if (k === item.c) o.classList.add("good");
            if (k === j && !ok) o.classList.add("bad");
          });
          var why = document.createElement("p");
          why.className = "why";
          why.innerHTML = "<b>" + (ok ? "Correct." : "Not quite.") + "</b> " + item.why;
          card.appendChild(why);
          document.getElementById("scoreVal").textContent = score + " / " + answered;
        });
        card.appendChild(btn);
      });
      root.appendChild(card);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    injectChrome();
    wireTheme();
    copyButtons();
    trackVisit();
    readingBar();
    palette();
    enhanceIndex();
    quizPage();
    var lab = document.createElement("script");
    lab.src = base() + "online-lab.js?v=2500";
    document.head.appendChild(lab);
  });
})();
