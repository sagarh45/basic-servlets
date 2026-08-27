import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/** One page: Write two cookies, Read both, Display all, Delete selected. */
public class CookieDemo extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        show(request, response, "Type a name. Write stores two cookies in the browser. Read shows both.");
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
            put(response, path, "user", value, 60 * 60);
            put(response, path, "lastVideo", "Java", 60 * 60);
            msg = "WRITE: both cookies are in the browser now.<br>"
                    + "<b>user = " + value + "</b><br><b>lastVideo = Java</b><br>"
                    + "Click <b>Read cookie</b> to see them in the box.";
        } else if ("read".equals(op)) {
            String user = find(request, "user");
            String video = find(request, "lastVideo");
            if (user == null && video == null) {
                msg = "READ: no lab cookies. Click Write cookie first.";
            } else {
                msg = "READ (from this browser):<br>"
                        + "<b>user = " + (user == null ? "(missing)" : user) + "</b><br>"
                        + "<b>lastVideo = " + (video == null ? "(missing)" : video) + "</b>";
            }
        } else if ("list".equals(op)) {
            msg = listCookies(request);
        } else if ("delete".equals(op)) {
            String name = pickDeleteName(request, text);
            put(response, path, name, "x", 0);
            msg = "DELETE cookie <b>" + name + "</b>. Click Display all to check. "
                    + "Type <code>user</code> or <code>lastVideo</code> to delete the other one.";
        } else {
            msg = "Choose Write, Read, Display all, or Delete.";
        }
        show(request, response, msg);
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
        if ("user".equals(text) || "lastVideo".equals(text)) {
            return text;
        }
        if (!text.isEmpty() && find(request, text) != null) {
            return text;
        }
        return "user";
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

    private static String listCookies(HttpServletRequest request) {
        Cookie[] arr = request.getCookies();
        StringBuilder sb = new StringBuilder("DISPLAY ALL cookies in this browser:<br>");
        int n = 0;
        if (arr != null) {
            for (int i = 0; i < arr.length; i++) {
                String name = arr[i].getName();
                if ("JSESSIONID".equalsIgnoreCase(name)) {
                    continue;
                }
                sb.append("<b>").append(name).append("</b> = ").append(arr[i].getValue()).append("<br>");
                n++;
            }
        }
        if (n == 0) {
            sb.append("No lab cookies. Click Write cookie first.");
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
