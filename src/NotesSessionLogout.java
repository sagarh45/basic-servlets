import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

public class NotesSessionLogout extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        response.sendRedirect("capstone.html");
    }
}
