import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

/** WatchTube account — READ / list cookies user and lastVideo. */
public class Cookie3 extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        boolean afterDelete = "1".equals(request.getParameter("deleted"));
        boolean hasUser = false;
        boolean hasVideo = false;
        out.println("<html><body>");
        if (afterDelete) {
            out.println("<h2>3. DELETE done — READ remaining cookies</h2>");
        } else {
            out.println("<h2>READ — cookies on this browser</h2>");
        }
        Cookie[] arr = request.getCookies();
        int shown = 0;
        if (arr != null) {
            for (int i = 0; i < arr.length; i++) {
                String n = arr[i].getName();
                if ("JSESSIONID".equalsIgnoreCase(n)) {
                    continue;
                }
                out.println(n + " = " + arr[i].getValue() + "<br>");
                shown++;
                if ("user".equals(n)) {
                    hasUser = true;
                }
                if ("lastVideo".equals(n)) {
                    hasVideo = true;
                }
            }
        }
        if (shown == 0) {
            out.println("<p>No lab cookies (user / lastVideo).</p>");
        }
        if (afterDelete && !hasUser && !hasVideo) {
            out.println("<p><b>Forget me worked.</b> user and lastVideo are gone.</p>");
        }
        out.println("<p><a href='cookie.html'>1. WRITE again</a> | <a href='Cookie2'>2. READ Home</a> | <a href='CookieDelete'>3. DELETE</a></p>");
        out.println("</body></html>");
    }
}
