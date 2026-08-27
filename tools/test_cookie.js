/* Drives online-lab.js in a fake browser to confirm the cookie demo output.
   Run: node tools/test_cookie.js [blocked|works]
   blocked = document.cookie does not stick (a page opened as file://). */
const fs = require("fs");
const path = require("path");

const mode = process.argv[2] === "works" ? "works" : "blocked";
const src = fs.readFileSync(path.join(__dirname, "..", "online-lab.js"), "utf8");

const store = {};
const out = { html: "" };
let submit = null;

let realCookie = "";
let clickFn = null;
const doc = {
  addEventListener(type, fn) {
    if (type === "submit") submit = fn;
    if (type === "click") clickFn = fn;
  },
  getElementById(id) { return id === "labOut" ? out : null; },
  createElement() { return { style: {}, classList: { add() {} }, appendChild() {} }; },
  querySelector() { return { appendChild() {} }; },
  get cookie() { return realCookie; },
  set cookie(v) {
    if (mode === "blocked") return;
    const [pair] = String(v).split(";");
    const i = pair.indexOf("=");
    const n = pair.slice(0, i).trim();
    const val = pair.slice(i + 1);
    const dead = /expires=Thu, 01 Jan 1970/.test(v);
    const jarNow = new Map(
      realCookie ? realCookie.split("; ").map((s) => {
        const j = s.indexOf("=");
        return [s.slice(0, j), s.slice(j + 1)];
      }) : []
    );
    if (dead) jarNow.delete(n); else jarNow.set(n, val);
    realCookie = [...jarNow].map(([k, x]) => k + "=" + x).join("; ");
  }
};

Object.defineProperty(out, "innerHTML", {
  get() { return out.html; },
  set(v) { out.html = v; }
});
out.scrollIntoView = () => {};

global.window = { __labOnline: false, location: {} };
global.document = doc;
global.location = { port: "443", hostname: "example.vercel.app", pathname: "/cookie.html" };
global.history = { replaceState() {} };
global.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); }
};
const sess = {};
global.sessionStorage = {
  getItem: (k) => (k in sess ? sess[k] : null),
  setItem: (k, v) => { sess[k] = String(v); },
  removeItem: (k) => { delete sess[k]; },
  clear: () => { Object.keys(sess).forEach((k) => delete sess[k]); }
};
delete global.window.__labOnline;

new Function(src)();

function click(op, name) {
  const form = {
    getAttribute: () => "cookiedemo",
    method: "post",
    entries: [["cval", name == null ? "" : name]]
  };
  global.FormData = function () {
    return { forEach: (cb) => form.entries.forEach(([k, v]) => cb(v, k)) };
  };
  submit({
    target: form,
    submitter: { name: "op", value: op },
    preventDefault() {}
  });
  const text = out.html
    .replace(/<div class='labout-bar'>[\s\S]*?<\/div>/, "")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  console.log("\n=== " + op.toUpperCase() + (name ? " " + name : "") + " ===");
  console.log(text);
}

function show(label) {
  const text = out.html
    .replace(/<div class='labout-bar'>[\s\S]*?<\/div>/, "")
    .replace(/<\/(h1|h2|p|div)>/g, "\n")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
  console.log("\n=== " + label + " ===");
  console.log(text);
}

/* Click a servlet link, like <a href="Cookie2">. */
function link(href) {
  const a = { getAttribute: () => href };
  clickFn({ target: { closest: () => a }, preventDefault() {} });
  show("LINK " + href);
}

/* Submit a form whose action is a servlet, with given fields. */
function post(action, fields) {
  const pairs = Object.entries(fields || {});
  global.FormData = function () {
    return { forEach: (cb) => pairs.forEach(([k, v]) => cb(v, k)) };
  };
  submit({
    target: { getAttribute: () => action, method: "post" },
    preventDefault() {}
  });
  show("POST " + action + " " + JSON.stringify(fields || {}));
}

console.log("mode:", mode, "(document.cookie " + (mode === "blocked" ? "blocked, expect localStorage jar" : "working") + ")");

console.log("\n---------- cookie demo (cookiedemo) ----------");
click("write", "Rahul");
click("write", "Sagar");
click("write", "Rahul");
click("list");
click("delete", "Rahul");
click("list");
click("delete", "Amit");

console.log("\n---------- Cookie1 / Cookie2 / Cookie3 / CookieDelete ----------");
post("Cookie1", { login: "Rahul" });
link("Cookie2");
link("Cookie3");
link("CookieDelete");
link("Cookie2");

console.log("\n---------- capstone: remember cookie vs session ----------");
/* redirectTo() prints in place only when we are already on capstone.html */
global.location.pathname = "/capstone.html";
post("CapstoneLogin", { login: "java", pwd: "servlet" });
link("CapstoneWelcome");
console.log("\n[browser tab closed: session gone, cookie stays 7 days]");
global.sessionStorage.clear();
link("CapstoneWelcome");
post("CapstoneLogin", { login: "java", pwd: "servlet" });
link("CapstoneLogout");
link("CapstoneWelcome");
