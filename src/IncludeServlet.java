import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Practical 12: RequestDispatcher Include Demo
 * Main page writes header/body, then includes IncludeFooterServlet.
 * Browser URL stays /include. Code after include() continues to run.
 */
public class IncludeServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        out.println("<!DOCTYPE html>");
        out.println("<html><head><title>Include Demo</title></head><body>");
        out.println("<h2>RequestDispatcher.include() Demo</h2>");
        out.println("<p>This is the <b>main content</b> from IncludeServlet.</p>");
        out.println("<p>Notice: browser URL remains <code>/include</code> (not changed).</p>");

        System.out.println("[IncludeServlet] About to include IncludeFooterServlet...");

        // Include footer servlet - its output is merged into this response
        RequestDispatcher rd = request.getRequestDispatcher("/includefooter");
        rd.include(request, response);

        // Code after include() DOES run (unlike forward)
        out.println("<p style='color:green;'><b>This line runs AFTER include() - difference from forward!</b></p>");
        out.println("<p><a href='index.html#ex-include'>Back to Index</a> | ");
        out.println("<a href='forward'>Compare with Forward</a></p>");
        out.println("</body></html>");

        System.out.println("[IncludeServlet] include() completed, post-include code executed.");
    }
}
