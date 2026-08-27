import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

public class Valid extends HttpServlet {
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        String login = request.getParameter("login");
        String pwd = request.getParameter("pwd");
        if (login != null && pwd != null && login.equals("java") && pwd.equals("servlet")) {
            RequestDispatcher rd = request.getRequestDispatcher("Welcome");
            rd.forward(request, response);
        } else {
            out.println("<h1>Incorrect LoginId/Password</h1>");
            request.getRequestDispatcher("/capstone.html").include(request, response);
        }
    }
}
