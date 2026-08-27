import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

public class CapstoneLogin extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.sendRedirect("capstone.html");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String login = request.getParameter("login");
        String pwd = request.getParameter("pwd");
        if (login != null && pwd != null && login.equals("java") && pwd.equals("servlet")) {
            HttpSession session = request.getSession(true);
            session.setAttribute("username", login);
            Cookie remember = new Cookie("remember", login);
            remember.setMaxAge(60 * 60 * 24 * 7);
            response.addCookie(remember);
            request.getRequestDispatcher("CapstoneWelcome").forward(request, response);
        } else {
            response.setContentType("text/html");
            PrintWriter out = response.getWriter();
            out.println("<p>Incorrect Login ID / Password</p>");
            RequestDispatcher rd = request.getRequestDispatcher("/capstone.html");
            rd.include(request, response);
        }
    }
}
