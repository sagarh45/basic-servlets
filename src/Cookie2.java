import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

/** WatchTube Home — READ cookies that Cookie1 wrote. */
public class Cookie2 extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        String user = null;
        String video = null;
        Cookie[] arr = request.getCookies();
        if (arr != null) {
            for (int i = 0; i < arr.length; i++) {
                String n = arr[i].getName();
                if ("user".equals(n)) {
                    user = arr[i].getValue();
                } else if ("lastVideo".equals(n)) {
                    video = arr[i].getValue();
                }
            }
        }
        out.println("<html><body>");
        out.println("<h2>2. READ cookies — Home (last watched)</h2>");
        if (user == null) {
            out.println("<p>No Remember-me cookie. Write one first.</p>");
            out.println("<p><a href='cookie.html'>1. WRITE cookie</a></p>");
        } else {
            out.println("<p>user = " + user + "</p>");
            out.println("<p>lastVideo = " + (video == null ? "(not yet)" : video) + "</p>");
            out.println("<p>Welcome back " + user + " — you did not type the name again.</p>");
            out.println("<p>YouTube-style last watched: Java Servlets.</p>");
        }
        out.println("<p><a href='Cookie3'>List all lab cookies</a> | <a href='CookieDelete'>3. DELETE cookies</a></p>");
        out.println("<p><a href='cookie.html'>Back to WatchTube cookies</a></p>");
        out.println("</body></html>");
    }
}
