import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

public class NotesSessionWelcome extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("username") == null) {
            response.sendRedirect("capstone.html");
            return;
        }
        String user = (String) session.getAttribute("username");
        out.println("<html><body>");
        out.println("<h1>Welcome " + user + "</h1>");
        out.println("<p><a href='NotesSessionLogout'>Logout</a></p>");
        out.println("<p><a href='index.html#ex-session-welcome'>Index</a></p>");
        out.println("</body></html>");
    }
}
