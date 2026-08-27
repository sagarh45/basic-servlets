import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Each Write adds a new cookie. Rahul then Sagar both stay.
 * Cookie name is u_Rahul, u_Sagar so names do not overwrite each other.
 */
public class CookieDemo extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        show(request, response, "Type Rahul, Write. Type Sagar, Write. Read / Display all shows both.");
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
            put(response, path, name, value, 60 * 60);
            msg = "WRITE saved <b>user = " + value + "</b>. Names stored now:<br>"
                    + listCookies(request, name, value);
        } else if ("read".equals(op) || "list".equals(op)) {
            msg = listCookies(request, null, null);
        } else if ("delete".equals(op)) {
            String name = pickDeleteName(request, text);
            put(response, path, name, "x", 0);
            msg = "DELETE cookie <b>" + name + "</b>. Click Display all. "
                    + "Type the name (Rahul) or cookie id (u_Rahul) to delete that one.";
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

    private static String listCookies(HttpServletRequest request, String extraName, String extraValue) {
        Cookie[] arr = request.getCookies();
        StringBuilder sb = new StringBuilder("All names stored in this browser:<br>");
        int n = 0;
        boolean sawExtra = false;
        if (arr != null) {
            for (int i = 0; i < arr.length; i++) {
                String name = arr[i].getName();
                if ("JSESSIONID".equalsIgnoreCase(name)) {
                    continue;
                }
                if (extraName != null && extraName.equals(name)) {
                    sawExtra = true;
                    sb.append("user = ").append(extraValue).append("<br>");
                } else if (name.startsWith("u_")) {
                    sb.append("user = ").append(arr[i].getValue()).append("<br>");
                } else {
                    sb.append("<b>").append(name).append("</b> = ").append(arr[i].getValue()).append("<br>");
                }
                n++;
            }
        }
        if (extraName != null && !sawExtra) {
            sb.append("user = ").append(extraValue).append("<br>");
            n++;
        }
        if (n == 0) {
            sb.append("None yet. Write Rahul, then Write Sagar.");
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
