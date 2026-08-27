import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

public class CookieDelete extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        Cookie del = new Cookie("user", "");
        del.setMaxAge(0);
        response.addCookie(del);
        PrintWriter out = response.getWriter();
        out.println("<html><body>");
        out.println("<h2>Forgot you on this device</h2>");
        out.println("<p>Cookie user was deleted (setMaxAge(0)), like YouTube Sign out of this browser.</p>");
        out.println("<p>lastVideo may still be here until you clear site data.</p>");
        out.println("<p><a href='Cookie3'>Check account cookies</a> | <a href='index.html#ex-cookiedelete'>Index</a></p>");
        out.println("</body></html>");
    }
}
