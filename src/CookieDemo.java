import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * One-page cookie lab: Write, Read, Display all, Delete selected.
 * Form posts to /cookiedemo. Result is printed in the same page.
 */
public class CookieDemo extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        show(request, response, "Click a button. Write saves the name. Read shows it in the box.");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String op = request.getParameter("op");
        String text = request.getParameter("login");
        if (text == null) {
            text = "";
        }
        text = text.trim();
        String path = request.getContextPath();
        if (path == null || path.isEmpty()) {
            path = "/";
        }

        String msg;
        if ("write".equals(op)) {
            String value = text.isEmpty() ? "Rahul" : text;
            Cookie c = new Cookie("user", value);
            c.setMaxAge(60 * 60);
            c.setPath(path);
            response.addCookie(c);
            msg = "WRITE done. Saved cookie user=" + value
                    + ". Click <b>Read cookie</b> — the box below will show it.";
        } else if ("read".equals(op)) {
            String v = find(request, "user");
            if (v == null) {
                msg = "READ: nothing stored yet. Type a name and click Write cookie.";
            } else {
                msg = "READ (what is stored):<br><b>user = " + v + "</b>";
            }
        } else if ("list".equals(op)) {
            msg = listCookies(request);
        } else if ("delete".equals(op)) {
            String name = pickDeleteName(request, text);
            Cookie del = new Cookie(name, "x");
            del.setMaxAge(0);
            del.setPath(path);
            response.addCookie(del);
            msg = "DELETE sent for cookie <b>" + name + "</b> (setMaxAge 0). "
                    + "Click <b>Display all cookies</b> to confirm it is gone.";
        } else {
            msg = "Choose Write, Read, Display all, or Delete.";
        }
        show(request, response, msg);
    }

    private static String pickDeleteName(HttpServletRequest request, String text) {
        if (!text.isEmpty() && find(request, text) != null) {
            return text;
        }
        if (find(request, "user") != null) {
            return "user";
        }
        return text.isEmpty() ? "user" : text;
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
        StringBuilder sb = new StringBuilder("DISPLAY ALL cookies:<br>");
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
        String login = request.getParameter("login");
        if (login == null || login.isEmpty()) {
            String stored = find(request, "user");
            login = stored != null ? stored : "Rahul";
        }
        out.println("<!DOCTYPE html><html><head><meta charset='UTF-8'>");
        out.println("<title>Cookie demo</title>");
        out.println("<link rel='stylesheet' href='portal.css'>");
        out.println("</head><body><div class='wrap'>");
        out.println("<h1>Cookie demo — Write, Read, Display all, Delete</h1>");
        out.println("<form method='post' action='cookiedemo'>");
        out.println("<p>Name <input name='login' value='" + login + "'></p>");
        out.println("<p>");
        out.println("<button type='submit' name='op' value='write'>Write cookie</button> ");
        out.println("<button type='submit' name='op' value='read'>Read cookie</button> ");
        out.println("<button type='submit' name='op' value='list'>Display all cookies</button> ");
        out.println("<button type='submit' name='op' value='delete'>Delete selected cookie</button>");
        out.println("</p></form>");
        out.println("<div class='card'><h3>Result</h3><p>" + msg + "</p></div>");
        out.println("<p><a href='cookie.html'>Back</a></p>");
        out.println("</div></body></html>");
    }
}
