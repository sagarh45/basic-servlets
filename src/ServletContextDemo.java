import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

/** Notes example: ServletContext context-param */
public class ServletContextDemo extends HttpServlet {
    public void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        res.setContentType("text/html");
        PrintWriter out = res.getWriter();
        ServletContext context = getServletContext();
        String college = context.getInitParameter("name");
        out.println("<html><body>");
        out.println("<h2>ServletContextDemo (Notes example)</h2>");
        out.println("College name is=" + college);
        out.println("<p><a href='index.html#ex-servletcontext'>Index</a></p>");
        out.println("</body></html>");
    }
}
