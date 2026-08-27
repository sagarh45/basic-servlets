import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

/** Notes sendRedirect target page */
public class RedirectOk extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<html><body>");
        out.println("<h1>Redirect success</h1>");
        out.println("<p>URL changed (new request). This is sendRedirect.</p>");
        out.println("<p><a href='index.html#ex-redirect-login'>Index</a></p>");
        out.println("</body></html>");
    }
}
