/* Execute Online: print the same HTML the Java servlet would print on
   http://localhost:8080/basic-servlets/...  Idle when Tomcat 8080 is serving. */
(function () {
  function isTomcat() {
    var p = String(location.port || "");
    if (p === "8080") return true;
    var h = location.hostname;
    return (h === "localhost" || h === "127.0.0.1") && (p === "" || p === "80");
  }
  if (isTomcat()) return;
  if (window.__labOnline) return;
  window.__labOnline = true;

  var SERVLET = /^(httpmethods|getpostdiff|lifecycle|configcontext|forward|redirect|target|includefooter|FwdDemo|RedirectOk|cookiedemo|Cookie1|Cookie2|Cookie3|CookieDelete|NotesSessionLogin|NotesSessionWelcome|NotesSessionLogout|CapstoneLogin|CapstoneWelcome|CapstoneLogout|hello|sampleregister|getpost|generic|requestinfo|response|include|attributes|HyperLinkDemo|DoGetDemo|Max|CounterServlet|MyServlet|ServletContextDemo|ConcatServlet|CallServlet|intro)$/i;

  function nameOf(url) {
    var u = String(url || "").split("?")[0];
    var i = u.lastIndexOf("/");
    return (i >= 0 ? u.slice(i + 1) : u).trim();
  }
  function isServlet(url) {
    var n = nameOf(url);
    return n && SERVLET.test(n);
  }
  function qs(url) {
    var q = String(url || "").split("?")[1] || "";
    return new URLSearchParams(q);
  }
  function formData(form) {
    var d = {};
    new FormData(form).forEach(function (v, k) { d[k] = String(v); });
    return d;
  }
  function get(k, def) {
    try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return def; }
  }
  function set(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
  /* Chrome keeps no cookies for a page opened as file://, so document.cookie
     stays empty there and the demo looks dead. Test it once; if it does not
     stick, keep the cookies in localStorage instead. Same behaviour either way. */
  var REAL_COOKIES = (function () {
    try {
      document.cookie = "labtest=1; path=/";
      var ok = /(?:^|; )labtest=1(?:;|$)/.test(document.cookie);
      document.cookie = "labtest=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      return ok;
    } catch (e) { return false; }
  })();

  function jar() { return get("lab-cookie-jar", {}) || {}; }

  /* Every cookie in this browser, as { name: value }. */
  function cookieAll() {
    if (!REAL_COOKIES) return jar();
    var out = {};
    String(document.cookie || "").split(";").forEach(function (part) {
      var s = part.trim();
      if (!s) return;
      var i = s.indexOf("=");
      var n = i < 0 ? s : s.slice(0, i);
      if (n) out[n] = i < 0 ? "" : decodeURIComponent(s.slice(i + 1));
    });
    return out;
  }
  function cookieGet(n) {
    var all = cookieAll();
    return all[n] == null ? "" : all[n];
  }
  function cookieSet(n, v, days) {
    if (!REAL_COOKIES) {
      var j = jar();
      j[n] = String(v);
      set("lab-cookie-jar", j);
      return;
    }
    var e = new Date(Date.now() + (days || 7) * 864e5).toUTCString();
    document.cookie = n + "=" + encodeURIComponent(v) + "; path=/; expires=" + e;
  }
  function cookieDel(n) {
    if (!REAL_COOKIES) {
      var j = jar();
      delete j[n];
      set("lab-cookie-jar", j);
      return;
    }
    document.cookie = n + "=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
    });
  }

  /* Java: request.getParameter() returns null when the field was not sent, and
     printing null puts the word "null" on the page. A box the student cleared
     is still sent, so that gives "" instead. Keep both, they are exam points. */
  function param(data, name) {
    return data[name] == null ? "null" : data[name];
  }

  /* Same HTML Tomcat would send. The result stays on this page, in the
     Output box, so the student never loses the form. */
  function page(mapping, query, inner) {
    var q = query ? ("?" + query) : "";
    var url = "http://localhost:8080/basic-servlets/" + mapping + q;
    var box = document.getElementById("labOut");
    if (!box) {
      box = document.createElement("div");
      box.id = "labOut";
      box.className = "labout";
      var head = document.createElement("h3");
      head.className = "sec";
      head.textContent = "Output";
      var host = document.querySelector(".wrap") || document.body;
      host.appendChild(head);
      host.appendChild(box);
    }
    box.innerHTML =
      "<div class='labout-bar'><b>Address bar</b><code>" + esc(url) + "</code></div>" +
      "<div class='labout-page'>" + inner + "</div>";
    if (box.scrollIntoView) {
      box.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  /* sendRedirect back to a form page: if that page is already open, print the
     result here instead of reloading and losing it. */
  function redirectTo(file, inner) {
    var here = location.pathname.split("/").pop() || "";
    if (here === file) {
      page(file, "", inner);
      return;
    }
    location.href = file;
  }

  /* GET must show its data in the address bar without leaving this page. */
  function markUrl(query) {
    var here = location.pathname.split("/").pop() || "";
    try {
      history.replaceState(null, "", here + (query ? "?" + query : ""));
    } catch (e) { /* file:// blocks replaceState */ }
  }

  function student() {
    return get("lab-student", { name: "Rahul", roll: "101", city: "Solapur", exists: true });
  }
  function saveStudent(r) { set("lab-student", r); }

  function life() {
    var x = get("lab-life", null);
    if (!x) x = { init: 1, service: 0, visitor: "-" };
    x.service += 1;
    set("lab-life", x);
    return x;
  }

  function httpShow(method, msg, rec) {
    var saved = rec && rec.exists
      ? "<p>Saved: " + esc(rec.name) + " / " + esc(rec.roll) + " / " + esc(rec.city) + "</p>"
      : "<p>Saved: none</p>";
    return "<h2>request.getMethod() = " + esc(method) + "</h2>" +
      "<p>" + esc(msg) + "</p>" + saved +
      "<p><a href='httpmethods.html'>Back</a></p>";
  }

  /* Same HTML CapstoneWelcome.java prints: the session on one line, the
     remember cookie on the next, so the two places are visible together. */
  function capstoneWelcome(user, remembered) {
    return "<h1>Welcome " + esc(user) + "</h1>" +
      "<p>Session (on the server) says: <b>" + esc(user) + "</b></p>" +
      (remembered
        ? "<p>remember cookie (in the browser) says: <b>" + esc(remembered) + "</b></p>"
        : "<p>remember cookie (in the browser): not in this request yet." +
          " A cookie you just wrote comes back on the next click." +
          " Open Welcome once more to see it.</p>") +
      "<p>Two different places. Close the browser and the session goes," +
      " but the cookie stays for 7 days. Logout clears both.</p>" +
      "<p><a href='CapstoneLogout'>Logout</a></p>";
  }

  /* Values that really live in WEB-INF/web.xml. Two different parameters that
     look alike: context-param "name" has no city, "collegeName" has it. */
  var CTX_NAME = "Walchand Institute of Technology";
  var CTX_COLLEGE_NAME = "Walchand Institute of Technology, Solapur";
  var CFG_PART1 = "Welcome to";
  var CFG_MY_SERVLET_NAME = "Hello from ServletConfig init-param";

  /* Exactly what IncludeFooterServlet.java prints, on its own or when
     IncludeServlet includes it. */
  function footerPage() {
    return "<hr>" +
      "<div style='background:#eee;padding:10px;text-align:center;'>" +
      "<p><b>Footer included via RequestDispatcher.include()</b></p>" +
      "<p>Walchand Institute of Technology, Solapur | Advanced Java Unit-II</p>" +
      "<p><small>IncludeFooterServlet - included content (URL stays at parent servlet)</small></p>" +
      "</div>";
  }

  /* Exactly what RedirectOk.java prints. */
  function redirectOkPage() {
    return "<h1>Redirect success</h1>" +
      "<p>URL changed (new request). This is sendRedirect.</p>" +
      "<p><a href='index.html#ex-redirect-login'>Index</a></p>";
  }

  /* Exactly what FwdDemo.java prints (CallServlet forwards to it). */
  function fwdDemoPage(login) {
    return "<h1>Welcome " + esc(login) + "</h1>" +
      "<p>URL may still show CallServlet (forward).</p>" +
      "<p><a href='index.html#ex-callservlet'>Index</a></p>";
  }

  function handle(servlet, method, data, url) {
    servlet = nameOf(servlet);
    method = (method || "GET").toUpperCase();
    data = data || {};
    var q = qs(url);
    q.forEach(function (v, k) { if (data[k] == null) data[k] = v; });

    if (/^cookiedemo$/i.test(servlet)) {
      var op = data.op || "read";
      var text = (data.cval || data.login || "").trim();
      var html;
      function cookieKey(v) {
        var s = String(v || "").replace(/[^A-Za-z0-9]/g, "");
        return "u_" + (s || "guest");
      }
      /* Same list the Java listCookies() prints. */
      function listAll() {
        var all = cookieAll();
        var mine = "";
        var other = "";
        var a = 0;
        var b = 0;
        Object.keys(all).forEach(function (k) {
          if (k.toUpperCase() === "JSESSIONID") return;
          if (k.indexOf("u_") === 0) {
            a++;
            mine += a + ". <b>" + esc(k) + "</b> = " + esc(all[k]) + "<br>";
          } else {
            b++;
            other += "<b>" + esc(k) + "</b> = " + esc(all[k]) + "<br>";
          }
        });
        var out = "<b>Names saved in this browser: " + a + "</b><br>";
        out += a === 0 ? "None yet. Type Rahul and click Write cookie.<br>" : mine;
        if (b > 0) out += "<br>Cookies from the other demos: " + b + "<br>" + other;
        return out;
      }
      if (op === "write") {
        var value = text || "Rahul";
        var cname = cookieKey(value);
        var old = cookieAll()[cname] != null;
        cookieSet(cname, value, 7);
        html = old
          ? "WRITE: cookie <b>" + esc(cname) + "</b> was already in this browser."
            + " The same cookie is used again and the value is written on top."
            + " No second cookie is made, and no old name is deleted.<br><br>" + listAll()
          : "WRITE: new cookie <b>" + esc(cname) + "</b> = " + esc(value) + " is created."
            + " Old names stay as they are.<br><br>" + listAll();
      } else if (op === "read" || op === "list") {
        html = listAll();
      } else if (op === "delete") {
        var have = cookieAll();
        var delName = text && have[text] != null ? text : cookieKey(text || "Rahul");
        if (have[delName] == null) {
          html = "DELETE: there is no cookie named <b>" + esc(delName) + "</b> in this browser."
            + " Nothing is deleted. Type a name from the list below.<br><br>" + listAll();
        } else {
          cookieDel(delName);
          html = "DELETE: cookie <b>" + esc(delName) + "</b> is removed with setMaxAge(0)."
            + " Only this one name goes, the others stay.<br><br>" + listAll();
        }
      } else {
        html = "Choose Write, Read, Display all, or Delete.";
      }
      page("cookiedemo", "", "<h2>Cookie demo</h2><p>" + html + "</p>");
      return;
    }

    if (/^httpmethods$/i.test(servlet)) {
      var rec = student();
      if (rec == null) rec = { exists: false };
      if (method === "POST") {
        /* Java assigns the raw parameters, so a missing one is stored as null
           and the Saved line then prints the word null. */
        rec = {
          name: param(data, "name"),
          roll: param(data, "roll"),
          city: param(data, "city"),
          exists: true
        };
        saveStudent(rec);
        page("httpmethods", "", httpShow("POST", "POST saved (body, not URL)", rec));
        return;
      }
      if (method === "PUT") {
        if (rec.exists && rec.roll === param(data, "roll")) {
          rec.city = param(data, "city");
          saveStudent(rec);
          page("httpmethods", "", httpShow("PUT", "PUT updated city to " + rec.city, rec));
        } else {
          page("httpmethods", "", httpShow("PUT", "PUT no matching roll", rec));
        }
        return;
      }
      if (method === "DELETE") {
        var dr = param(data, "roll");
        if (rec.exists && rec.roll === dr) {
          rec.exists = false;
          saveStudent(rec);
          page("httpmethods", "", httpShow("DELETE", "DELETE removed roll " + dr, rec));
        } else {
          page("httpmethods", "", httpShow("DELETE", "DELETE no matching roll", rec));
        }
        return;
      }
      if (method === "OPTIONS") {
        page("httpmethods", "", httpShow("OPTIONS", "OPTIONS Allow header set", rec));
        return;
      }
      if (method === "TRACE") {
        page("httpmethods", "", httpShow("TRACE", "TRACE debug (Tomcat may block this)", rec));
        return;
      }
      var roll = data.roll == null ? "" : data.roll;
      var msg;
      if (!roll) msg = "GET view";
      else if (rec.exists && rec.roll === roll) msg = "GET found roll " + roll;
      else msg = "GET roll not found: " + roll;
      markUrl(roll ? "roll=" + encodeURIComponent(roll) : "");
      page("httpmethods", roll ? "roll=" + encodeURIComponent(roll) : "", httpShow("GET", msg, rec));
      return;
    }

    if (/^getpostdiff$/i.test(servlet)) {
      if (method === "GET") {
        /* Java prints getParameter("q") and then getQueryString(). With no
           query string at all, both of them are null. */
        var sent = data.q != null;
        var qEnc = sent ? "q=" + encodeURIComponent(data.q) : "";
        markUrl(qEnc);
        page("getpostdiff", qEnc,
          "<h2>request.getMethod() = GET</h2>" +
          "<p>GET search q=" + esc(sent ? data.q : "null") +
          " URL=" + esc(sent ? "q=" + data.q : "null") + "</p>" +
          "<p><a href='httpmethods.html#getpost'>Back</a></p>");
      } else {
        /* A POST form sends nothing in the URL, so getQueryString() is null. */
        page("getpostdiff", "",
          "<h2>request.getMethod() = POST</h2>" +
          "<p>POST saved name=" + esc(param(data, "name")) +
          " message=" + esc(param(data, "message")) + " query=null</p>" +
          "<p><a href='httpmethods.html#getpost'>Back</a></p>");
      }
      return;
    }

    if (/^lifecycle$/i.test(servlet)) {
      var L = life();
      /* Java: lastVisitor = request.getParameter("visitor"), so an empty box
         stores "" and a missing parameter prints the word null. */
      if (method === "POST") {
        L.visitor = data.visitor == null ? "null" : data.visitor;
      }
      set("lab-life", L);
      var head = method === "POST" ? ("POST signed " + L.visitor) : "GET open video";
      page("lifecycle", "",
        "<h2>" + esc(head) + "</h2>" +
        "<p>init=" + L.init + " service=" + L.service + " lastVisitor=" + esc(L.visitor) + "</p>" +
        "<p><a href='lifecycle.html'>Back</a></p>");
      return;
    }

    if (/^configcontext$/i.test(servlet)) {
      page("configcontext", "",
        "<h2>" + esc(method) + "</h2>" +
        "<p>collegeName (context) = " + CTX_COLLEGE_NAME + "</p>" +
        "<p>author (config) = Student Name</p>" +
        "<p>student = " + esc(param(data, "student")) + "</p>" +
        "<p>question = " + esc(param(data, "question")) + "</p>" +
        "<p><a href='lifecycle.html#config'>Back</a></p>");
      return;
    }

    if (/^forward$/i.test(servlet)) {
      /* ForwardServlet prints nothing. It sets the message attribute and
         forwards, so TargetServlet prints this. */
      page("forward", "",
        "<h2>TargetServlet</h2>" +
        "<p>FORWARD: Result for " + esc(param(data, "student")) +
        ": PASS (URL still /forward)</p>" +
        "<p><a href='forward.html'>Back</a></p>");
      return;
    }
    if (servlet === "redirect") {
      /* RedirectServlet swaps only a null for Rahul, an empty box stays empty. */
      var rs = data.student == null ? "Rahul" : data.student;
      page("target", "from=RedirectServlet&student=" + encodeURIComponent(rs),
        "<h2>TargetServlet</h2>" +
        "<p>REDIRECT from RedirectServlet student=" + esc(rs) + " (URL changed)</p>" +
        "<p><a href='forward.html'>Back</a></p>");
      return;
    }
    /* Redirect.java prints nothing at all. Right login: sendRedirect to
       /RedirectOk, so RedirectOk's page appears. Wrong login: sendRedirect
       back to the plain form page, with no error text anywhere. */
    if (servlet === "Redirect") {
      if ((data.login || "") === "java" && (data.pwd || "") === "servlet") {
        page("RedirectOk", "", redirectOkPage());
      } else {
        redirectTo("redirect_login.html",
          "<h2>Back at the login form</h2>" +
          "<p>Wrong login, so sendRedirect sent the browser to" +
          " redirect_login.html. Notice the form prints no error message:" +
          " Redirect.java only redirects, it never writes HTML.</p>" +
          "<p>Use java / servlet.</p>");
      }
      return;
    }
    if (servlet === "RedirectOk") {
      page("RedirectOk", "", redirectOkPage());
      return;
    }
    if (servlet === "FwdDemo") {
      page("FwdDemo", "", fwdDemoPage(param(data, "login")));
      return;
    }
    if (/^includefooter$/i.test(servlet)) {
      page("includefooter", "", footerPage());
      return;
    }
    if (/^target$/i.test(servlet)) {
      page("target", "",
        "<h2>TargetServlet</h2><p>Direct access</p><p><a href='forward.html'>Back</a></p>");
      return;
    }

    if (/^Cookie1$/i.test(servlet)) {
      var nm = data.login || "Rahul";
      cookieSet("user", nm, 7);
      cookieSet("lastVideo", "Java", 7);
      page("Cookie1", "",
        "<h2>1. WRITE cookie — Continue as " + esc(nm) + "</h2>" +
        "<p>Saved cookie <b>user=" + esc(nm) + "</b> and <b>lastVideo=Java</b> (YouTube Remember me).</p>" +
        "<p>Password is not stored.</p>" +
        "<p>A cookie you just wrote is not in this same request. Click READ so the browser sends it back.</p>" +
        "<p><a href='Cookie2'>2. READ cookies (Home)</a> | <a href='Cookie3'>List cookies</a> | <a href='CookieDelete'>3. DELETE cookies</a></p>" +
        "<p><a href='cookie.html'>Back to WatchTube cookies</a></p>");
      return;
    }
    if (/^Cookie2$/i.test(servlet)) {
      var u2 = cookieGet("user");
      var v2 = cookieGet("lastVideo");
      var body;
      if (!u2) {
        body = "<p>No Remember-me cookie. Write one first.</p>" +
          "<p><a href='cookie.html'>1. WRITE cookie</a></p>";
      } else {
        body = "<p>user = " + esc(u2) + "</p>" +
          "<p>lastVideo = " + esc(v2 || "(not yet)") + "</p>" +
          "<p>Welcome back " + esc(u2) + " — you did not type the name again.</p>" +
          "<p>YouTube-style last watched: Java Servlets.</p>";
      }
      page("Cookie2", "",
        "<h2>2. READ cookies — Home (last watched)</h2>" + body +
        "<p><a href='Cookie3'>List all lab cookies</a> | <a href='CookieDelete'>3. DELETE cookies</a></p>" +
        "<p><a href='cookie.html'>Back to WatchTube cookies</a></p>");
      return;
    }
    if (/^Cookie3$/i.test(servlet)) {
      var u3 = cookieGet("user");
      var v3 = cookieGet("lastVideo");
      var afterDel = (data.deleted === "1") || /[?&]deleted=1/.test(String(url || ""));
      var l3 = "";
      if (u3) l3 += "user = " + esc(u3) + "<br>";
      if (v3) l3 += "lastVideo = " + esc(v3) + "<br>";
      var title = afterDel ? "3. DELETE done — READ remaining cookies" : "READ — cookies on this browser";
      var proof = (afterDel && !u3 && !v3)
        ? "<p><b>Forget me worked.</b> user and lastVideo are gone.</p>"
        : "";
      page("Cookie3", afterDel ? "deleted=1" : "",
        "<h2>" + title + "</h2>" +
        (l3 || "<p>No lab cookies (user / lastVideo).</p>") + proof +
        "<p><a href='cookie.html'>1. WRITE again</a> | <a href='Cookie2'>2. READ Home</a> | <a href='CookieDelete'>3. DELETE</a></p>");
      return;
    }
    if (/^CookieDelete$/i.test(servlet)) {
      cookieDel("user");
      cookieDel("lastVideo");
      handle("Cookie3", "GET", { deleted: "1" }, "Cookie3?deleted=1");
      return;
    }

    if (/^NotesSessionLogin$/i.test(servlet)) {
      if ((data.login || "") === "java" && (data.pwd || "") === "servlet") {
        sessionStorage.setItem("lab-session", data.login);
        page("NotesSessionWelcome", "",
          "<h1>Welcome " + esc(data.login) + "</h1>" +
          "<p><a href='NotesSessionLogout'>Logout</a></p>" +
          "<p><a href='index.html#ex-session-welcome'>Index</a></p>");
      } else {
        page("NotesSessionLogin", "",
          "<p>Wrong login. Use java / servlet.</p>" +
          "<p><a href='capstone.html'>Back</a></p>");
      }
      return;
    }
    if (/^NotesSessionWelcome$/i.test(servlet)) {
      var u = sessionStorage.getItem("lab-session");
      if (!u) {
        redirectTo("capstone.html",
          "<h2>Welcome is blocked</h2>" +
          "<p>getSession(false) returned null, so sendRedirect sent you back to the login form.</p>");
      } else {
        page("NotesSessionWelcome", "",
          "<h1>Welcome " + esc(u) + "</h1>" +
          "<p><a href='NotesSessionLogout'>Logout</a></p>" +
          "<p><a href='index.html#ex-session-welcome'>Index</a></p>");
      }
      return;
    }
    if (/^NotesSessionLogout$/i.test(servlet)) {
      sessionStorage.removeItem("lab-session");
      redirectTo("capstone.html",
        "<h2>Logout</h2>" +
        "<p>session.invalidate() ran. sendRedirect sent the browser to capstone.html.</p>" +
        "<p>Click Sign in again — Welcome is blocked until you do.</p>");
      return;
    }

    if (/^CapstoneLogin$/i.test(servlet)) {
      if ((data.login || "") === "java" && (data.pwd || "") === "servlet") {
        sessionStorage.setItem("lab-capstone", data.login);
        /* The cookie is written on this response, so this same request cannot
           read it back — exactly like the real Cookie1 / Cookie2 pair. */
        var seen = cookieGet("remember");
        cookieSet("remember", data.login, 7);
        /* forward keeps the URL at /CapstoneLogin and prints CapstoneWelcome */
        page("CapstoneLogin", "", capstoneWelcome(data.login, seen));
      } else {
        /* include() reprints the form page under the error line */
        page("CapstoneLogin", "",
          "<p>Incorrect Login ID / Password</p>" +
          "<p>The login form on this page was included again. Try java / servlet.</p>");
      }
      return;
    }
    if (/^CapstoneWelcome$/i.test(servlet)) {
      var c = sessionStorage.getItem("lab-capstone");
      if (!c) {
        redirectTo("capstone.html",
          "<h2>Welcome is blocked</h2>" +
          "<p>getSession(false) returned null, so sendRedirect sent you back to the login form.</p>");
      } else {
        page("CapstoneWelcome", "", capstoneWelcome(c, cookieGet("remember")));
      }
      return;
    }
    if (/^CapstoneLogout$/i.test(servlet)) {
      sessionStorage.removeItem("lab-capstone");
      cookieDel("remember");
      redirectTo("capstone.html",
        "<h2>Logout</h2>" +
        "<p>Logout cleared both stores: session.invalidate() and cookie remember with setMaxAge(0).</p>" +
        "<p>Open the portal again to log in.</p>");
      return;
    }

    if (/^hello$/i.test(servlet)) {
      page("hello", "",
        "<h1>Welcome to Servlets</h1>" +
        "<p>This page is generated by HelloServlet using doGet().</p>" +
        "<p><a href='index.html#ex-hello'>Back to Index</a></p>");
      return;
    }

    if (/^generic$/i.test(servlet)) {
      page("generic", "",
        "<h2>GenericServlet - service() Method Demo</h2>" +
        "<p>This servlet extends <b>GenericServlet</b> (not HttpServlet).</p>" +
        "<p>We override <b>service()</b> directly instead of doGet()/doPost().</p>" +
        "<p><b>Request method info:</b> GenericServlet uses ServletRequest (no getMethod()).</p>" +
        "<p><b>Remote address:</b> 127.0.0.1</p>" +
        "<p><b>Server name:</b> localhost</p>" +
        "<p><i>Note: HttpServlet extends GenericServlet and splits service() into doGet(), doPost(), etc.</i></p>" +
        "<p><a href='index.html#ex-generic'>Back to Index</a></p>");
      return;
    }

    if (/^requestinfo$/i.test(servlet)) {
      var keys = Object.keys(data);
      var rows = keys.length
        ? keys.map(function (k) { return "<tr><td>" + esc(k) + "</td><td>" + esc(data[k]) + "</td></tr>"; }).join("")
        : "<tr><td colspan='2'>(no parameters - try ?name=Rahul&amp;city=Solapur)</td></tr>";
      /* Java also loops getHeaderNames(). These are the headers a browser
         really sends for this page. */
      var headers = [
        ["host", "localhost:8080"],
        ["connection", "keep-alive"],
        ["user-agent", navigator.userAgent],
        ["accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"],
        ["accept-encoding", "gzip, deflate, br"],
        ["accept-language", "en-US,en;q=0.9"]
      ];
      var hrows = headers.map(function (h) {
        return "<tr><td>" + esc(h[0]) + "</td><td>" + esc(h[1]) + "</td></tr>";
      }).join("");
      page("requestinfo", keys.length ? keys.map(function (k) { return k + "=" + encodeURIComponent(data[k]); }).join("&") : "",
        "<h2>HttpServletRequest Information</h2>" +
        "<h3>Basic Info</h3>" +
        "<table border='1' cellpadding='6'>" +
        "<tr><th>Property</th><th>Value</th></tr>" +
        "<tr><td>HTTP Method</td><td>" + esc(method) + "</td></tr>" +
        "<tr><td>Request URI</td><td>/basic-servlets/requestinfo</td></tr>" +
        "<tr><td>Context Path</td><td>/basic-servlets</td></tr>" +
        "<tr><td>Servlet Path</td><td>/requestinfo</td></tr>" +
        "<tr><td>Query String</td><td>" + esc(keys.length ? keys.map(function (k) { return k + "=" + data[k]; }).join("&") : "(none)") + "</td></tr>" +
        "<tr><td>Protocol</td><td>HTTP/1.1</td></tr>" +
        "<tr><td>Remote Addr</td><td>127.0.0.1</td></tr>" +
        "<tr><td>Remote Host</td><td>127.0.0.1</td></tr>" +
        "</table>" +
        "<h3>Request Parameters</h3>" +
        "<table border='1' cellpadding='6'><tr><th>Name</th><th>Value</th></tr>" + rows + "</table>" +
        "<h3>Request Headers</h3>" +
        "<table border='1' cellpadding='6'><tr><th>Header Name</th><th>Header Value</th></tr>" + hrows + "</table>" +
        "<p><a href='requestinfo?name=Rahul&city=Solapur'>Test with query params</a> | " +
        "<a href='index.html#ex-requestinfo'>Back to Index</a></p>");
      return;
    }

    if (/^response$/i.test(servlet)) {
      if (data.demo === "404") {
        page("response", "demo=404",
          "<h2>404 Not Found Demo</h2>" +
          "<p>response.setStatus(404) was called.</p>" +
          "<p>Check browser DevTools -&gt; Network tab for status code and X-Demo-Header.</p>" +
          "<p><a href='response'>Back</a></p>");
        return;
      }
      if (data.demo === "redirect") {
        handle("hello", "GET", {}, "hello");
        return;
      }
      page("response", "",
        "<h2>HttpServletResponse Demonstration</h2>" +
        "<table border='1' cellpadding='8'>" +
        "<tr><th>Method</th><th>What it does</th><th>Demo</th></tr>" +
        "<tr><td>setContentType()</td><td>Sets MIME type of response</td><td>text/html;charset=UTF-8 (this page)</td></tr>" +
        "<tr><td>setStatus(200)</td><td>Sets HTTP status code</td><td>SC_OK = 200 (this page)</td></tr>" +
        "<tr><td>setHeader()</td><td>Adds/replaces response header</td><td>X-Author, X-Practical sent</td></tr>" +
        "<tr><td>addHeader()</td><td>Adds another header value</td><td>X-Multi-Header: Value-1, Value-2</td></tr>" +
        "<tr><td>setDateHeader()</td><td>Sets date header</td><td>Last-Modified set to now</td></tr>" +
        "<tr><td>sendRedirect()</td><td>302 redirect to new URL</td><td><a href='response?demo=redirect'>Try redirect demo</a></td></tr>" +
        "<tr><td>setStatus(404)</td><td>Custom error status</td><td><a href='response?demo=404'>Try 404 demo</a></td></tr>" +
        "</table>" +
        "<p>Open browser DevTools (F12) -&gt; Network -&gt; click this page -&gt; Headers tab to see response headers.</p>" +
        "<p><a href='index.html#ex-response'>Back to Index</a></p>");
      return;
    }

    if (/^include$/i.test(servlet)) {
      page("include", "",
        "<h2>RequestDispatcher.include() Demo</h2>" +
        "<p>This is the <b>main content</b> from IncludeServlet.</p>" +
        "<p>Notice: browser URL remains <code>/include</code> (not changed).</p>" +
        footerPage() +
        "<p style='color:green;'><b>This line runs AFTER include() - difference from forward!</b></p>" +
        "<p><a href='index.html#ex-include'>Back to Index</a> | " +
        "<a href='forward'>Compare with Forward</a></p>");
      return;
    }

    if (/^attributes$/i.test(servlet)) {
      var setA = data.action === "set";
      /* Context attributes live until the server restarts, so they must
         survive between clicks. Request attributes must not. */
      var ctx = get("lab-context-attr", null);
      if (setA) {
        ctx = {
          visitCount: ctx && ctx.visitCount ? ctx.visitCount + 1 : 1,
          appMessage: "Context attribute - shared across all users/sessions"
        };
        set("lab-context-attr", ctx);
      }
      var sName = setA ? "Rahul Patil" : "null";
      var sRoll = setA ? "CS2024001" : "null";
      var sMsg = setA
        ? "Request attribute set - visible during forward/include only"
        : "null";
      page("attributes", setA ? "action=set" : "",
        "<h2>Request Attribute vs Context Attribute</h2>" +
        "<h3>Request Attributes (request scope - this request only)</h3>" +
        "<table border='1' cellpadding='6'><tr><th>Attribute</th><th>Value</th></tr>" +
        "<tr><td>studentName</td><td>" + esc(sName) + "</td></tr>" +
        "<tr><td>rollNo</td><td>" + esc(sRoll) + "</td></tr>" +
        "<tr><td>message</td><td>" + esc(sMsg) + "</td></tr></table>" +
        "<p><i>Request attributes are used to pass data during forward/include. Lost after response is sent.</i></p>" +
        "<h3>Context Attributes (application scope - entire web app)</h3>" +
        "<table border='1' cellpadding='6'><tr><th>Attribute</th><th>Value</th></tr>" +
        "<tr><td>visitCount</td><td>" + (ctx ? ctx.visitCount : "null") + "</td></tr>" +
        "<tr><td>appMessage</td><td>" + (ctx ? esc(ctx.appMessage) : "null") + "</td></tr></table>" +
        "<p><i>Context attributes persist until server restart. Shared by all users.</i></p>" +
        "<p><a href='attributes?action=set'>Set Attributes</a> | " +
        "<a href='attributes'>Refresh (request attrs will be null after new request)</a> | " +
        "<a href='forward'>See forward using request attributes</a> | " +
        "<a href='index.html#ex-attributes'>Index</a></p>");
      return;
    }

    if (/^HyperLinkDemo$/i.test(servlet)) {
      page("HyperLinkDemo", "",
        "<h1>Hello world! MY first Servlet Program...</h1>" +
        "<p><a href='index.html#ex-hyperlink'>Back</a></p>");
      return;
    }

    if (/^DoGetDemo$/i.test(servlet)) {
      var emailQ = data.email == null ? "" : "email=" + encodeURIComponent(data.email);
      markUrl(emailQ);
      page("DoGetDemo", emailQ,
        "<h2>DoGetDemo (Notes example)</h2>" +
        "my email: " + esc(param(data, "email")) +
        "<p>Look at address bar - GET puts email in URL.</p>" +
        "<p><a href='doget.html'>Try again</a> | <a href='index.html#ex-doget'>Index</a></p>");
      return;
    }

    if (/^Max$/i.test(servlet)) {
      /* Java uses Integer.parseInt, which throws HTTP 500 on an empty box. */
      var raw1 = data.no1;
      var raw2 = data.no2;
      if (raw1 == null || raw2 == null || String(raw1).trim() === "" || String(raw2).trim() === "" ||
          isNaN(Number(raw1)) || isNaN(Number(raw2))) {
        page("Max", "",
          "<h2>HTTP Status 500 - Internal Server Error</h2>" +
          "<p>java.lang.NumberFormatException</p>" +
          "<p>Integer.parseInt(request.getParameter(\"no1\")) cannot read an empty" +
          " or non-numeric box. Type whole numbers in both boxes.</p>" +
          "<p><a href='max.html'>Try again</a></p>");
        return;
      }
      var n1 = parseInt(raw1, 10);
      var n2 = parseInt(raw2, 10);
      var mx = n1 > n2
        ? ("n1=" + n1 + " is max number")
        : n2 > n1 ? ("n2=" + n2 + " is max number") : "Both numbers are equal";
      page("Max", "",
        "<h2>Max (Notes example)</h2>" + mx +
        "<p>URL does not show no1/no2 (POST).</p>" +
        "<p><a href='max.html'>Try again</a> | <a href='index.html#ex-max'>Index</a></p>");
      return;
    }

    if (/^CounterServlet$/i.test(servlet)) {
      var n = (get("lab-counter", 0) || 0) + 1;
      set("lab-counter", n);
      page("CounterServlet", "",
        "<h2>CounterServlet (Notes example)</h2>" +
        "<p>Hit count = " + n + "</p>" +
        "<p>Refresh page - count increases. Check Tomcat console for init once.</p>" +
        "<p><a href='index.html#ex-counter'>Index</a></p>");
      return;
    }

    if (/^MyServlet$/i.test(servlet)) {
      page("MyServlet", "",
        "<h1>" + CFG_MY_SERVLET_NAME + "</h1>" +
        "<p>Value came from web.xml init-param (ServletConfig).</p>" +
        "<p><a href='index.html#ex-myservlet'>Index</a></p>");
      return;
    }

    if (/^ServletContextDemo$/i.test(servlet)) {
      /* context-param "name", not "collegeName" — so no ", Solapur". */
      page("ServletContextDemo", "",
        "<h2>ServletContextDemo (Notes example)</h2>" +
        "College name is=" + CTX_NAME +
        "<p><a href='index.html#ex-servletcontext'>Index</a></p>");
      return;
    }

    if (/^ConcatServlet$/i.test(servlet)) {
      /* init-param part1 + " " + context-param name */
      var both = CFG_PART1 + " " + CTX_NAME;
      page("ConcatServlet", "",
        "<h2>ConcatServlet (Notes example)</h2>" +
        "<p>Result: " + esc(both) + "</p>" +
        "<p>Length: " + both.length + "</p>" +
        "<p><a href='index.html#ex-concat'>Index</a></p>");
      return;
    }

    /* CallServlet prints nothing on success: it forwards to FwdDemo. On a wrong
       password it prints the error and then include()s the whole 1.html page,
       which is why the form appears underneath. */
    if (/^CallServlet$/i.test(servlet)) {
      if ((data.login || "") === "java" && (data.pwd || "") === "servlet") {
        page("CallServlet", "", fwdDemoPage(param(data, "login")));
      } else {
        page("CallServlet", "",
          "<h1>Incorrect Login ID/Password</h1>" +
          "<p>The page 1.html was included below this line by" +
          " RequestDispatcher.include(), so the login form comes back" +
          " while the address bar still shows /CallServlet.</p>" +
          "<p><a href='1.html'>Back to the login form</a></p>");
      }
      return;
    }

    if (/^getpost$/i.test(servlet)) {
      /* One servlet, two doors: doGet and doPost both call showResult(). */
      var gpQuery = "";
      if (method === "GET" && (data.name != null || data.email != null)) {
        gpQuery = "name=" + encodeURIComponent(data.name == null ? "" : data.name) +
          "&email=" + encodeURIComponent(data.email == null ? "" : data.email);
        markUrl(gpQuery);
      }
      var gpForms =
        "<hr>" +
        "<h3>Try again - both forms call same servlet /getpost</h3>" +
        "<form method='get' action='getpost'>" +
        "<h4>1) Form with method=get (calls doGet)</h4>" +
        "Name: <input type='text' name='name' value='Rahul'><br><br>" +
        "Email: <input type='text' name='email' value='a@b.com'><br><br>" +
        "<input type='submit' value='Submit using GET'>" +
        "</form><br>" +
        "<form method='post' action='getpost'>" +
        "<h4>2) Form with method=post (calls doPost)</h4>" +
        "Name: <input type='text' name='name' value='Rahul'><br><br>" +
        "Email: <input type='text' name='email' value='a@b.com'><br><br>" +
        "<input type='submit' value='Submit using POST'>" +
        "</form>";
      page("getpost", gpQuery,
        "<h2>GET and POST in One Servlet</h2>" +
        "<h3>Result</h3>" +
        "<p><b>HTTP Method used:</b> " + esc(method) + "</p>" +
        "<p><b>Name:</b> " + esc(data.name == null ? "(empty)" : data.name) + "</p>" +
        "<p><b>Email:</b> " + esc(data.email == null ? "(empty)" : data.email) + "</p>" +
        (method === "GET"
          ? "<p style='color:green;'><b>GET:</b> data is visible in the address bar (query string).</p>"
          : "<p style='color:blue;'><b>POST:</b> data is NOT visible in the address bar.</p>") +
        gpForms +
        "<p><a href='getpost.html'>Back to Execute page</a> | " +
        "<a href='index.html#ex-getpost'>Index</a></p>");
      return;
    }

    if (/^sampleregister$/i.test(servlet)) {
      /* Java doGet only redirects back to the form, it prints no table. */
      if (method === "GET") {
        redirectTo("sample-registration.html",
          "<h2>Back at the form</h2>" +
          "<p>doGet() only calls sendRedirect(\"sample-registration.html\")," +
          " because this practical accepts POST only — that keeps the password" +
          " out of the address bar. Fill the form and submit it.</p>");
        return;
      }
      var rows2 = Object.keys(data).map(function (k) {
        return "<tr><td>" + esc(k) + "</td><td>" + esc(data[k]) + "</td></tr>";
      }).join("");
      page("sampleregister", "",
        "<h2>request.getMethod() = POST</h2>" +
        "<table border='1' cellpadding='6'>" + rows2 + "</table>" +
        "<p><a href='sample-registration.html'>Back</a></p>");
      return;
    }

    if (/^intro$/i.test(servlet)) {
      page("intro", "",
        "<h1>Servlets: Introduction, Need and Working</h1>" +
        "<h2>1) Introduction</h2>" +
        "<p>A <b>Servlet</b> is a Java class that runs on the server (Tomcat) and handles HTTP requests.</p>" +
        "<p>It generates dynamic response (HTML/JSON/text) for the browser.</p>" +
        "<h2>2) Need of Servlets</h2>" +
        "<ul>" +
        "<li>CGI was slow (new process per request).</li>" +
        "<li>Servlet uses thread per request - faster and scalable.</li>" +
        "<li>Platform independent (Java).</li>" +
        "<li>Good integration with Java EE APIs.</li>" +
        "</ul>" +
        "<h2>3) Working (Request Flow)</h2>" +
        "<ol>" +
        "<li>Browser sends HTTP request to Tomcat.</li>" +
        "<li>Tomcat finds servlet mapping from <code>web.xml</code>.</li>" +
        "<li>Container calls <b>service()</b> then <b>doGet()/doPost()</b>.</li>" +
        "<li>Servlet writes response using PrintWriter.</li>" +
        "<li>Browser shows the output.</li>" +
        "</ol>" +
        "<p><b>This page itself is generated by a Servlet</b> (ServletIntroWorking).</p>" +
        "<p><a href='index.html#ex-intro'>Back to Index</a></p>");
      return;
    }

    page(servlet, "",
      "<h2>" + esc(servlet) + "</h2>" +
      "<p>request.getMethod() = " + esc(method) + "</p>" +
      "<p><a href='programs.html'>Back</a></p>");
  }

  document.addEventListener("submit", function (e) {
    var form = e.target;
    if (!form || !form.getAttribute) return;
    var action = form.getAttribute("action") || "";
    if (!isServlet(action)) return;
    e.preventDefault();
    var data = formData(form);
    if (e.submitter && e.submitter.name) {
      data[e.submitter.name] = e.submitter.value;
    }
    handle(action, form.method || "GET", data, action);
  }, true);

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (href.indexOf("http") === 0 || href.indexOf(".html") !== -1 || href.charAt(0) === "#") return;
    if (!isServlet(href)) return;
    e.preventDefault();
    handle(href, "GET", {}, href);
  }, true);

  window.sendMethod = function (m) { handle("httpmethods", m, {}, "httpmethods"); };
  window.sendPut = function () {
    handle("httpmethods", "PUT", {
      roll: (document.getElementById("putRoll") || {}).value,
      city: (document.getElementById("putCity") || {}).value
    }, "httpmethods?roll=" + encodeURIComponent((document.getElementById("putRoll") || {}).value || "") +
      "&city=" + encodeURIComponent((document.getElementById("putCity") || {}).value || ""));
  };
  window.sendDelete = function () {
    handle("httpmethods", "DELETE", {
      roll: (document.getElementById("delRoll") || {}).value
    }, "httpmethods?roll=" + encodeURIComponent((document.getElementById("delRoll") || {}).value || ""));
  };
})();
