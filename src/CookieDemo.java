import java.io.IOException;
import java.io.PrintWriter;
import java.util.LinkedHashMap;
import java.util.Map;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Each Write adds a new cookie. Rahul then Sagar both stay.
 * Cookie name is u_Rahul, u_Sagar so names do not overwrite each other.
 *
 * A cookie is known by its NAME only:
 *   new name  -> a new cookie is created, old ones stay
 *   same name -> the same cookie is reused, value is written again,
 *                no second copy is made and nothing is deleted
 */
public class CookieDemo extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        show(request, response, "Type Rahul, Write. Type Sagar, Write. Both stay,"
                + " because the cookie names u_Rahul and u_Sagar are different.<br><br>"
                + listCookies(request, null, null, null));
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String op = request.getParameter("op");
        String text = request.getParameter("cval");
        if (text == null) {
            text = request.getParameter("login");
        }
        if (text == null) {
            text = "";
        }
        text = text.trim();
        String path = cookiePath(request);

        String msg;
        if ("write".equals(op)) {
            String value = text.isEmpty() ? "Rahul" : text;
            String name = key(value);
            boolean old = find(request, name) != null;
            put(response, path, name, value, 60 * 60);
            if (old) {
                msg = "WRITE: cookie <b>" + name + "</b> was already in this browser."
                        + " The same cookie is used again and the value is written on top."
                        + " No second cookie is made, and no old name is deleted.<br><br>"
                        + listCookies(request, name, value, null);
            } else {
                msg = "WRITE: new cookie <b>" + name + "</b> = " + value + " is created."
                        + " Old names stay as they are.<br><br>"
                        + listCookies(request, name, value, null);
            }
        } else if ("read".equals(op) || "list".equals(op)) {
            msg = listCookies(request, null, null, null);
        } else if ("delete".equals(op)) {
            String name = pickDeleteName(request, text);
            if (find(request, name) == null) {
                msg = "DELETE: there is no cookie named <b>" + name + "</b> in this browser."
                        + " Nothing is deleted. Type a name from the list below.<br><br>"
                        + listCookies(request, null, null, null);
            } else {
                put(response, path, name, "x", 0);
                msg = "DELETE: cookie <b>" + name + "</b> is removed with setMaxAge(0)."
                        + " Only this one name goes, the others stay.<br><br>"
                        + listCookies(request, null, null, name);
            }
        } else {
            msg = "Choose Write, Read, Display all, or Delete.";
        }
        show(request, response, msg);
    }

    static String key(String value) {
        String s = value.replaceAll("[^A-Za-z0-9]", "");
        if (s.isEmpty()) {
            s = "guest";
        }
        return "u_" + s;
    }

    private static String cookiePath(HttpServletRequest request) {
        String path = request.getContextPath();
        return (path == null || path.isEmpty()) ? "/" : path;
    }

    private static void put(HttpServletResponse response, String path, String name, String value, int maxAge) {
        Cookie c = new Cookie(name, value);
        c.setMaxAge(maxAge);
        c.setPath(path);
        response.addCookie(c);
    }

    private static String pickDeleteName(HttpServletRequest request, String text) {
        if (text.isEmpty()) {
            return "u_Rahul";
        }
        if (find(request, text) != null) {
            return text;
        }
        String k = key(text);
        if (find(request, k) != null) {
            return k;
        }
        return k;
    }

    private static String find(HttpServletRequest request, String name) {
        Cookie[] arr = request.getCookies();
        if (arr == null) {
            return null;
        }
        for (int i = 0; i < arr.length; i++) {
            if (name.equals(arr[i].getName())) {
                return arr[i].getValue();
            }
        }
        return null;
    }

    /**
     * addName / addValue = cookie just written (the browser sends it only on the
     * next request, so we show it now). delName = cookie just deleted.
     */
    private static String listCookies(HttpServletRequest request,
            String addName, String addValue, String delName) {
        Map<String, String> box = new LinkedHashMap<String, String>();
        Cookie[] arr = request.getCookies();
        if (arr != null) {
            for (int i = 0; i < arr.length; i++) {
                String name = arr[i].getName();
                if ("JSESSIONID".equalsIgnoreCase(name)) {
                    continue;
                }
                box.put(name, arr[i].getValue());
            }
        }
        if (delName != null) {
            box.remove(delName);
        }
        if (addName != null) {
            box.put(addName, addValue);
        }

        StringBuilder mine = new StringBuilder();
        StringBuilder other = new StringBuilder();
        int a = 0;
        int b = 0;
        for (Map.Entry<String, String> e : box.entrySet()) {
            if (e.getKey().startsWith("u_")) {
                a++;
                mine.append(a).append(". <b>").append(e.getKey()).append("</b> = ")
                        .append(e.getValue()).append("<br>");
            } else {
                b++;
                other.append("<b>").append(e.getKey()).append("</b> = ")
                        .append(e.getValue()).append("<br>");
            }
        }

        StringBuilder sb = new StringBuilder();
        sb.append("<b>Names saved in this browser: ").append(a).append("</b><br>");
        if (a == 0) {
            sb.append("None yet. Type Rahul and click Write cookie.<br>");
        } else {
            sb.append(mine);
        }
        if (b > 0) {
            sb.append("<br>Cookies from the other demos: ").append(b).append("<br>").append(other);
        }
        return sb.toString();
    }

    private void show(HttpServletRequest request, HttpServletResponse response, String msg)
            throws IOException {
        response.setContentType("text/html; charset=UTF-8");
        PrintWriter out = response.getWriter();
        out.println("<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Cookie demo</title>");
        out.println("<link rel='stylesheet' href='portal.css'></head><body><div class='wrap'>");
        out.println("<h1>Cookie demo</h1>");
        out.println("<form method='post' action='cookiedemo' autocomplete='off'>");
        out.println("<p>Name <input name='cval' placeholder='Rahul' autocomplete='off'></p>");
        out.println("<p>");
        out.println("<button type='submit' name='op' value='write'>Write cookie</button> ");
        out.println("<button type='submit' name='op' value='read'>Read cookie</button> ");
        out.println("<button type='submit' name='op' value='list'>Display all cookies</button> ");
        out.println("<button type='submit' name='op' value='delete'>Delete selected cookie</button>");
        out.println("</p></form>");
        out.println("<div class='card'><h3>Result</h3><p>" + msg + "</p></div>");
        out.println("<p><a href='cookie.html'>Back</a></p></div></body></html>");
    }
}
