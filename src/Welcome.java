import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

public class Welcome extends HttpServlet {
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        String session = request.getParameter("session_id");
        String username = request.getParameter("login");
        out.println("<html><body>");
        out.println("<h1>id:" + session + "</h1>");
        out.println("<h3>Welcome " + username + "</h3>");
        out.println("<p><a href='index.html#ex-hidden'>Index</a></p>");
        out.println("</body></html>");
    }
}
