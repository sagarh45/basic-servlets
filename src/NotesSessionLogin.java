import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

public class NotesSessionLogin extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String login = request.getParameter("login");
        String pwd = request.getParameter("pwd");
        if (login != null && pwd != null && login.equals("java") && pwd.equals("servlet")) {
            HttpSession session = request.getSession(true);
            session.setAttribute("username", login);
            response.sendRedirect("NotesSessionWelcome");
            return;
        }
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<p>Wrong login. Use java / servlet.</p>");
        out.println("<p><a href='capstone.html'>Back</a></p>");
    }
}
