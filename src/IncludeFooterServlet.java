import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Practical 12b: Include Footer Servlet
 * Small servlet included by IncludeServlet using RequestDispatcher.include().
 */
public class IncludeFooterServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        PrintWriter out = response.getWriter();
        out.println("<hr>");
        out.println("<div style='background:#eee;padding:10px;text-align:center;'>");
        out.println("<p><b>Footer included via RequestDispatcher.include()</b></p>");
        out.println("<p>Walchand Institute of Technology, Solapur | Advanced Java Unit-II</p>");
        out.println("<p><small>IncludeFooterServlet - included content (URL stays at parent servlet)</small></p>");
        out.println("</div>");

        System.out.println("[IncludeFooterServlet] Footer content included in parent response.");
    }
}
