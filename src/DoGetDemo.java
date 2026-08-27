import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

/** Notes example: read email with GET */
public class DoGetDemo extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String email = request.getParameter("email");
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<html><body>");
        out.println("<h2>DoGetDemo (Notes example)</h2>");
        out.println("my email: " + email);
        out.println("<p>Look at address bar - GET puts email in URL.</p>");
        out.println("<p><a href='doget.html'>Try again</a> | <a href='index.html#ex-doget'>Index</a></p>");
        out.println("</body></html>");
    }
}
