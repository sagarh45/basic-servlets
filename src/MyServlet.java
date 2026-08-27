import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

/** Notes example: ServletConfig init-param */
public class MyServlet extends HttpServlet {
    String msg;

    public void init(ServletConfig config) throws ServletException {
        msg = config.getInitParameter("name");
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<html><body>");
        out.println("<h1>" + msg + "</h1>");
        out.println("<p>Value came from web.xml init-param (ServletConfig).</p>");
        out.println("<p><a href='index.html#ex-myservlet'>Index</a></p>");
        out.println("</body></html>");
    }
}
