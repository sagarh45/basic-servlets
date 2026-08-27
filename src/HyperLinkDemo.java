import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

/** Notes example: HyperLinkDemo / Hello style */
public class HyperLinkDemo extends HttpServlet {
    private String msg = "";

    public void init(ServletConfig config) throws ServletException {
        msg = "Hello world! MY first Servlet Program...";
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<html><body>");
        out.println("<h1>" + msg + "</h1>");
        out.println("<p><a href='index.html#ex-hyperlink'>Back</a></p>");
        out.println("</body></html>");
    }
}
