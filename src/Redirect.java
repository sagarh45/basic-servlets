import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

/** Notes example: sendRedirect (PRG style) */
public class Redirect extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String login = request.getParameter("login");
        String pwd = request.getParameter("pwd");
        if ("java".equals(login) && "servlet".equals(pwd)) {
            response.sendRedirect(request.getContextPath() + "/RedirectOk");
        } else {
            response.sendRedirect(request.getContextPath() + "/redirect_login.html");
        }
    }
}
