import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

/** Notes example: concat Config string + Context string */
public class ConcatServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        String part1 = getServletConfig().getInitParameter("part1");
        String part2 = getServletContext().getInitParameter("name");
        String both = String.valueOf(part1) + " " + String.valueOf(part2);
        out.println("<html><body>");
        out.println("<h2>ConcatServlet (Notes example)</h2>");
        out.println("<p>Result: " + both + "</p>");
        out.println("<p>Length: " + both.length() + "</p>");
        out.println("<p><a href='index.html#ex-concat'>Index</a></p>");
        out.println("</body></html>");
    }
}
