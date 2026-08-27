import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

/** Notes example: init once, service many */
public class CounterServlet extends HttpServlet {
    int count = 0; // DEMO ONLY - shared by all users

    public void init() throws ServletException {
        System.out.println("[CounterServlet] init once");
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        count++;
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<html><body>");
        out.println("<h2>CounterServlet (Notes example)</h2>");
        out.println("<p>Hit count = " + count + "</p>");
        out.println("<p>Refresh page - count increases. Check Tomcat console for init once.</p>");
        out.println("<p><a href='index.html#ex-counter'>Index</a></p>");
        out.println("</body></html>");
    }

    public void destroy() {
        System.out.println("[CounterServlet] destroy once");
    }
}
