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

  var SERVLET = /^(httpmethods|getpostdiff|lifecycle|configcontext|forward|redirect|target|Cookie1|Cookie2|Cookie3|CookieDelete|NotesSessionLogin|NotesSessionWelcome|NotesSessionLogout|Url1|Url2|Valid|Welcome|CapstoneLogin|CapstoneWelcome|CapstoneLogout|hello|sampleregister|getpost|generic|requestinfo|response|include|attributes|HyperLinkDemo|DoGetDemo|Max|CounterServlet|MyServlet|ServletContextDemo|ConcatServlet|CallServlet|intro)$/i;

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
  function cookieGet(n) {
    var m = document.cookie.match(new RegExp("(?:^|; )" + n + "=([^;]*)"));
    return m ? decodeURIComponent(m[1]) : "";
  }
  function cookieSet(n, v, days) {
    var e = new Date(Date.now() + (days || 7) * 864e5).toUTCString();
    document.cookie = n + "=" + encodeURIComponent(v) + "; path=/; expires=" + e;
  }
  function cookieDel(n) {
    document.cookie = n + "=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
    });
  }

  /* Same HTML Tomcat would send. Address bar shows localhost like the lab PC. */
  function showLocalhost(mapping, query, inner) {
    var q = query ? ("?" + query) : "";
    var url = "http://localhost:8080/basic-servlets/" + mapping + q;
    var html =
      "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>" + esc(mapping) + "</title>" +
      "<style>" +
      "body{margin:0;background:#fff;color:#000;font-family:Arial,Helvetica,sans-serif;}" +
      ".loc{background:#f1f3f4;border-bottom:1px solid #c0c0c0;padding:8px 14px;font:13px Consolas,'Courier New',monospace;}" +
      ".loc b{font-family:Arial;font-size:12px;margin-right:10px;color:#444;}" +
      ".page{padding:18px 22px;}" +
      "a{color:#00e;}" +
      "</style></head><body>" +
      "<div class='loc'><b>Address bar</b>" + esc(url) + "</div>" +
      "<div class='page'>" + inner + "</div>" +
      "<script src='online-lab.js?v=2500'></script>" +
      "</body></html>";
    document.open();
    document.write(html);
    document.close();
  }

  function page(mapping, query, inner) {
    showLocalhost(mapping, query, inner);
  }

  function student() {
    return get("lab-student", { name: "Rahul", roll: "101", city: "Solapur", exists: true });
  }
  function saveStudent(r) { set("lab-student", r); }

  function life() {
    var x = get("lab-life", null);
    if (!x) x = { init: 1, service: 0, visitor: "" };
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

  function handle(servlet, method, data, url) {
    servlet = nameOf(servlet);
    method = (method || "GET").toUpperCase();
    data = data || {};
    var q = qs(url);
    q.forEach(function (v, k) { if (data[k] == null) data[k] = v; });

    if (/^httpmethods$/i.test(servlet)) {
      var rec = student();
      if (rec == null) rec = { exists: false };
      if (method === "POST") {
        rec = { name: data.name || "Rahul", roll: data.roll || "101", city: data.city || "Solapur", exists: true };
        saveStudent(rec);
        page("httpmethods", "", httpShow("POST", "POST saved (body, not URL)", rec));
        return;
      }
      if (method === "PUT") {
        if (rec.exists && rec.roll === (data.roll || rec.roll)) {
          rec.city = data.city || rec.city;
          saveStudent(rec);
          page("httpmethods", "", httpShow("PUT", "PUT updated city to " + rec.city, rec));
        } else {
          page("httpmethods", "", httpShow("PUT", "PUT no matching roll", rec));
        }
        return;
      }
      if (method === "DELETE") {
        var dr = data.roll || rec.roll;
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
      var roll = data.roll || "";
      var msg;
      if (!roll) msg = "GET view";
      else if (rec.exists && rec.roll === roll) msg = "GET found roll " + roll;
      else msg = "GET roll not found: " + roll;
      history.replaceState(null, "", (location.pathname.split("/").pop() || "httpmethods.html") + (roll ? "?roll=" + encodeURIComponent(roll) : ""));
      page("httpmethods", roll ? "roll=" + encodeURIComponent(roll) : "", httpShow("GET", msg, rec));
      return;
    }

    if (/^getpostdiff$/i.test(servlet)) {
      if (method === "GET") {
        var qq = data.q || "";
        history.replaceState(null, "", "getpostdiff.html?q=" + encodeURIComponent(qq));
        page("getpostdiff", "q=" + encodeURIComponent(qq),
          "<h2>request.getMethod() = GET</h2>" +
          "<p>GET search q=" + esc(qq) + " URL=q=" + esc(qq) + "</p>" +
          "<p><a href='httpmethods.html#getpost'>Back</a></p>");
      } else {
        page("getpostdiff", "",
          "<h2>request.getMethod() = POST</h2>" +
          "<p>POST saved name=" + esc(data.name) + " message=" + esc(data.message) + " query=null</p>" +
          "<p><a href='httpmethods.html#getpost'>Back</a></p>");
      }
      return;
    }

    if (/^lifecycle$/i.test(servlet)) {
      var L = life();
      if (method === "POST" && data.visitor) L.visitor = data.visitor;
      set("lab-life", L);
      var head = method === "POST" ? ("POST signed " + (L.visitor || "")) : "GET view book";
      page("lifecycle", "",
        "<h2>" + esc(head) + "</h2>" +
        "<p>init=" + L.init + " service=" + L.service + " lastVisitor=" + esc(L.visitor || "null") + "</p>" +
        "<p><a href='lifecycle.html'>Back</a></p>");
      return;
    }

    if (/^configcontext$/i.test(servlet)) {
      page("configcontext", "",
        "<h2>" + esc(method) + "</h2>" +
        "<p>collegeName (context) = Walchand Institute of Technology, Solapur</p>" +
        "<p>author (config) = Student Name</p>" +
        "<p>student = " + esc(data.student == null ? "null" : data.student) + "</p>" +
        "<p>question = " + esc(data.question == null ? "null" : data.question) + "</p>" +
        "<p><a href='lifecycle.html#config'>Back</a></p>");
      return;
    }

    if (/^forward$/i.test(servlet)) {
      var st = data.student || "Rahul";
      page("forward", "",
        "<h2>TargetServlet</h2>" +
        "<p>FORWARD: Result for " + esc(st) + ": PASS (URL still /forward)</p>" +
        "<p><a href='forward.html'>Back</a></p>");
      return;
    }
    if (/^redirect$/i.test(servlet)) {
      var rs = data.student || "Rahul";
      page("target", "from=RedirectServlet&student=" + encodeURIComponent(rs),
        "<h2>TargetServlet</h2>" +
        "<p>REDIRECT from RedirectServlet student=" + esc(rs) + " (URL changed)</p>" +
        "<p><a href='forward.html'>Back</a></p>");
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
      page("Cookie1", "",
        "<h2>Continue as " + esc(nm) + "</h2>" +
        "<p>This browser saved your name (cookie user=" + esc(nm) + "), like YouTube Remember me.</p>" +
        "<p>Password is not stored.</p>" +
        "<p><a href='Cookie2'>Open Home (last watched)</a> | <a href='CookieDelete'>Forget me on this device</a></p>" +
        "<p><a href='capstone.html'>Back to MyMail project</a></p>");
      return;
    }
    if (/^Cookie2$/i.test(servlet)) {
      var u2 = cookieGet("user");
      var v2 = cookieGet("lastVideo");
      var lines = "";
      if (u2) lines += "user = " + esc(u2) + "<br>";
      if (v2) lines += "lastVideo = " + esc(v2) + "<br>";
      cookieSet("lastVideo", "Java", 7);
      var greet = u2 || "guest";
      page("Cookie2", "",
        "<h2>Home — last watched</h2>" +
        (lines || "<p>No cookies yet. Stay signed in first.</p>") +
        "<p>Welcome back " + esc(greet) + "</p>" +
        "<p>Saved last watched: Java Servlets (cookie lastVideo=Java), like YouTube remembers the last video.</p>" +
        "<p><a href='Cookie3'>Account cookies</a></p>");
      return;
    }
    if (/^Cookie3$/i.test(servlet)) {
      var u3 = cookieGet("user");
      var v3 = cookieGet("lastVideo");
      var l3 = "";
      if (u3) l3 += "user = " + esc(u3) + "<br>";
      if (v3) l3 += "lastVideo = " + esc(v3) + "<br>";
      page("Cookie3", "",
        "<h2>Account — cookies on this browser</h2>" +
        (l3 || "<p>No cookies.</p>") +
        "<p><a href='CookieDelete'>Forget me on this device</a> | <a href='index.html'>Index</a></p>");
      return;
    }
    if (/^CookieDelete$/i.test(servlet)) {
      cookieDel("user");
      page("CookieDelete", "",
        "<h2>Forgot you on this device</h2>" +
        "<p>Cookie user was deleted (setMaxAge(0)), like YouTube Sign out of this browser.</p>" +
        "<p>lastVideo may still be here until you clear site data.</p>" +
        "<p><a href='Cookie3'>Check account cookies</a> | <a href='index.html'>Index</a></p>");
      return;
    }

    if (/^NotesSessionLogin$/i.test(servlet)) {
      if ((data.login || "") === "java" && (data.pwd || "") === "servlet") {
        sessionStorage.setItem("lab-session", data.login);
        page("NotesSessionWelcome", "",
          "<h1>Welcome " + esc(data.login) + "</h1>" +
          "<p><a href='NotesSessionLogout'>Logout</a></p>" +
          "<p><a href='index.html'>Index</a></p>");
      } else {
        page("NotesSessionLogin", "",
          "<p>Wrong login. Use java / servlet.</p>" +
          "<p><a href='capstone.html'>Back to MyMail project</a></p>");
      }
      return;
    }
    if (/^NotesSessionWelcome$/i.test(servlet)) {
      var u = sessionStorage.getItem("lab-session");
      if (!u) {
        location.href = "capstone.html";
      } else {
        page("NotesSessionWelcome", "",
          "<h1>Welcome " + esc(u) + "</h1>" +
          "<p><a href='NotesSessionLogout'>Logout</a></p>" +
          "<p><a href='capstone.html'>Back to MyMail project</a></p>");
      }
      return;
    }
    if (/^NotesSessionLogout$/i.test(servlet)) {
      sessionStorage.removeItem("lab-session");
      location.href = "capstone.html";
      return;
    }

    if (/^Url1$/i.test(servlet)) {
      var a = data.s_id1 || "054", b = data.s_id2 || "055";
      var link = "Url2?s_id1=" + encodeURIComponent(a) + "&amp;s_id2=" + encodeURIComponent(b);
      page("Url1", "",
        "<h2>Url1</h2>" +
        "<p><a href='" + link.replace(/&amp;/g, "&") + "'>next page</a></p>" +
        "<p><a href='capstone.html'>Back to MyMail project</a></p>");
      return;
    }
    if (/^Url2$/i.test(servlet)) {
      page("Url2", "s_id1=" + encodeURIComponent(data.s_id1 || "") + "&s_id2=" + encodeURIComponent(data.s_id2 || ""),
        "<h2>Url2</h2>" +
        "<p>s_id1=" + esc(data.s_id1) + "</p>" +
        "<p>s_id2=" + esc(data.s_id2) + "</p>" +
        "<p><a href='capstone.html'>Back to MyMail project</a></p>");
      return;
    }

    if (/^Valid$/i.test(servlet) || /^Welcome$/i.test(servlet)) {
      if ((data.login || "") === "java" && (data.pwd || "") === "servlet") {
        page("Valid", "",
          "<h1>id:" + esc(data.session_id || "054") + "</h1>" +
          "<h3>Welcome " + esc(data.login) + "</h3>" +
          "<p><a href='capstone.html'>Back to MyMail project</a></p>");
      } else {
        page("Valid", "",
          "<h1>Incorrect LoginId/Password</h1>" +
          "<p><a href='capstone.html'>Back to MyMail project</a></p>");
      }
      return;
    }

    if (/^CapstoneLogin$/i.test(servlet)) {
      if ((data.login || "") === "java" && (data.pwd || "") === "servlet") {
        sessionStorage.setItem("lab-capstone", data.login);
        cookieSet("remember", data.login, 7);
        page("CapstoneLogin", "",
          "<h1>Welcome " + esc(data.login) + "</h1>" +
          "<p>Login success using <b>forward</b>.</p>" +
          "<p>Username stored in <b>HttpSession</b>.</p>" +
          "<p>Cookie <b>remember</b> also created for next visit.</p>" +
          "<p><a href='CapstoneLogout'>Logout</a></p>" +
          "<p><a href='capstone.html'>Back to MyMail project</a></p>");
      } else {
        page("CapstoneLogin", "",
          "<p>Incorrect Login ID / Password</p>" +
          "<form method='post' action='CapstoneLogin'>" +
          "Login: <input name='login' value='java'> " +
          "Password: <input type='password' name='pwd'> " +
          "<input type='submit' value='Open MyMail portal (POST)'></form>" +
          "<p><a href='capstone.html'>Back to MyMail project</a></p>");
      }
      return;
    }
    if (/^CapstoneWelcome$/i.test(servlet)) {
      var c = sessionStorage.getItem("lab-capstone");
      if (!c) {
        location.href = "capstone.html";
      } else {
        page("CapstoneWelcome", "",
          "<h1>Welcome " + esc(c) + "</h1>" +
          "<p>Login success using <b>forward</b>.</p>" +
          "<p><a href='CapstoneLogout'>Logout</a></p>");
      }
      return;
    }
    if (/^CapstoneLogout$/i.test(servlet)) {
      sessionStorage.removeItem("lab-capstone");
      cookieDel("remember");
      location.href = "capstone.html?back=ch-capstone";
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
        "</table>" +
        "<h3>Request Parameters</h3>" +
        "<table border='1' cellpadding='6'><tr><th>Name</th><th>Value</th></tr>" + rows + "</table>" +
        "<p><a href='requestinfo?name=Rahul&city=Solapur'>Test with query params</a> | <a href='requestinfo.html'>Back</a></p>");
      return;
    }

    if (/^response$/i.test(servlet)) {
      if (data.demo === "404") {
        page("response", "demo=404",
          "<h2>404 Not Found Demo</h2>" +
          "<p>response.setStatus(404) was called.</p>" +
          "<p><a href='response.html'>Back</a></p>");
        return;
      }
      if (data.demo === "redirect") {
        handle("hello", "GET", {}, "hello");
        return;
      }
      page("response", "",
        "<h2>HttpServletResponse Demonstration</h2>" +
        "<p>setContentType = text/html</p>" +
        "<p>setStatus(200) SC_OK</p>" +
        "<p><a href='response?demo=404'>Try 404 demo</a> | <a href='response.html'>Back</a></p>");
      return;
    }

    if (/^include$/i.test(servlet)) {
      page("include", "",
        "<h2>RequestDispatcher.include() Demo</h2>" +
        "<p>This is the <b>main content</b> from IncludeServlet.</p>" +
        "<p>Notice: browser URL remains <code>/include</code> (not changed).</p>" +
        "<hr><div style='background:#eee;padding:10px;text-align:center;'>" +
        "<p><b>Footer included via RequestDispatcher.include()</b></p>" +
        "<p>Walchand Institute of Technology, Solapur | Advanced Java Unit-II</p>" +
        "<p><small>IncludeFooterServlet - included content (URL stays at parent servlet)</small></p></div>" +
        "<p style='color:green;'><b>This line runs AFTER include() - difference from forward!</b></p>" +
        "<p><a href='forward.html'>Back</a></p>");
      return;
    }

    if (/^attributes$/i.test(servlet)) {
      var setA = data.action === "set";
      page("attributes", setA ? "action=set" : "",
        "<h2>Request Attribute vs Context Attribute</h2>" +
        "<h3>Request Attributes (request scope - this request only)</h3>" +
        "<table border='1' cellpadding='6'><tr><th>Attribute</th><th>Value</th></tr>" +
        "<tr><td>studentName</td><td>" + (setA ? "Rahul" : "null") + "</td></tr>" +
        "<tr><td>rollNo</td><td>" + (setA ? "101" : "null") + "</td></tr>" +
        "<tr><td>message</td><td>" + (setA ? "PASS" : "null") + "</td></tr></table>" +
        "<p><i>Request attributes are used to pass data during forward/include. Lost after response is sent.</i></p>" +
        "<h3>Context Attributes (application scope - entire web app)</h3>" +
        "<table border='1' cellpadding='6'><tr><th>Attribute</th><th>Value</th></tr>" +
        "<tr><td>visitCount</td><td>1</td></tr>" +
        "<tr><td>appMessage</td><td>Shared by all users</td></tr></table>" +
        "<p><a href='attributes?action=set'>Set Attributes</a> | <a href='attributes.html'>Back</a></p>");
      return;
    }

    if (/^HyperLinkDemo$/i.test(servlet)) {
      page("HyperLinkDemo", "",
        "<h1>Hello world! MY first Servlet Program...</h1>" +
        "<p><a href='index.html#ex-hyperlink'>Back</a></p>");
      return;
    }

    if (/^DoGetDemo$/i.test(servlet)) {
      page("DoGetDemo", data.email ? "email=" + encodeURIComponent(data.email) : "",
        "<h2>DoGetDemo (Notes example)</h2>" +
        "my email: " + esc(data.email || "") +
        "<p>Look at address bar - GET puts email in URL.</p>" +
        "<p><a href='doget.html'>Try again</a> | <a href='index.html#ex-doget'>Index</a></p>");
      return;
    }

    if (/^Max$/i.test(servlet)) {
      var n1 = Number(data.no1 || data.n1 || 0);
      var n2 = Number(data.no2 || data.n2 || 0);
      var mx = n1 > n2 ? ("n1=" + n1 + " is max number") : n2 > n1 ? ("n2=" + n2 + " is max number") : "Both numbers are equal";
      page("Max", "",
        "<h2>Max (Notes example)</h2>" + mx +
        "<p>URL does not show no1/no2 (POST).</p>" +
        "<p><a href='max.html'>Try again</a></p>");
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
        "<h1>Hello from ServletConfig init-param</h1>" +
        "<p>Value came from web.xml init-param (ServletConfig).</p>" +
        "<p><a href='index.html#ex-myservlet'>Index</a></p>");
      return;
    }

    if (/^ServletContextDemo$/i.test(servlet)) {
      page("ServletContextDemo", "",
        "<h2>ServletContextDemo (Notes example)</h2>" +
        "College name is=Walchand Institute of Technology, Solapur" +
        "<p><a href='servletcontext.html'>Back</a></p>");
      return;
    }

    if (/^ConcatServlet$/i.test(servlet) || /^CallServlet$/i.test(servlet)) {
      var both = "Welcome to Walchand Institute of Technology";
      page(servlet, "",
        "<h2>ConcatServlet (Notes example)</h2>" +
        "<p>Result: " + both + "</p>" +
        "<p>Length: " + both.length + "</p>" +
        "<p><a href='index.html#ex-concat'>Index</a></p>");
      return;
    }

    if (/^getpost$/i.test(servlet)) {
      page("getpost", method === "GET" && data.name ? "name=" + encodeURIComponent(data.name) : "",
        "<h2>request.getMethod() = " + esc(method) + "</h2>" +
        "<p>name=" + esc(data.name || "") + "</p>" +
        "<p><a href='getpost.html'>Back</a></p>");
      return;
    }

    if (/^sampleregister$/i.test(servlet)) {
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
        "<h2>Servlet working</h2>" +
        "<p>Browser → Tomcat → web.xml → doGet → HTML</p>" +
        "<p><a href='intro.html'>Back</a></p>");
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
    handle(action, form.method || "GET", formData(form), action);
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
