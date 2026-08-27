import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

/** Notes example: welcome after forward */
public class FwdDemo extends HttpServlet {
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        String username = request.getParameter("login");
        out.println("<html><body>");
        out.println("<h1>Welcome " + username + "</h1>");
        out.println("<p>URL may still show CallServlet (forward).</p>");
        out.println("<p><a href='index.html#ex-callservlet'>Index</a></p>");
        out.println("</body></html>");
    }
}
