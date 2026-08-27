import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

/** WatchTube Remember me — WRITE cookies user and lastVideo. */
public class Cookie1 extends HttpServlet {

    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String login = request.getParameter("login");
        if (login == null || login.isEmpty()) {
            login = "guest";
        }
        String path = request.getContextPath();
        if (path == null || path.isEmpty()) {
            path = "/";
        }

        Cookie user = new Cookie("user", login);
        user.setMaxAge(60 * 60);
        user.setPath(path);
        response.addCookie(user);

        Cookie video = new Cookie("lastVideo", "Java");
        video.setMaxAge(60 * 60);
        video.setPath(path);
        response.addCookie(video);

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<html><body>");
        out.println("<h2>1. WRITE cookie — Continue as " + login + "</h2>");
        out.println("<p>Saved cookie <b>user=" + login + "</b> and <b>lastVideo=Java</b> (YouTube Remember me).</p>");
        out.println("<p>Password is not stored.</p>");
        out.println("<p>A cookie you just wrote is not in this same request. Click READ so the browser sends it back.</p>");
        out.println("<p><a href='Cookie2'>2. READ cookies (Home)</a> | <a href='Cookie3'>List cookies</a> | <a href='CookieDelete'>3. DELETE cookies</a></p>");
        out.println("<p><a href='cookie.html'>Back to WatchTube cookies</a></p>");
        out.println("</body></html>");
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.sendRedirect("cookie.html");
    }
}
