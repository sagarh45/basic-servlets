import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

/** Notes example: validate then forward or include */
public class CallServlet extends HttpServlet {
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        String login = request.getParameter("login");
        String pwd = request.getParameter("pwd");
        RequestDispatcher rd;
        if (login != null && pwd != null && login.equals("java") && pwd.equals("servlet")) {
            rd = request.getRequestDispatcher("FwdDemo");
            rd.forward(request, response);
        } else {
            out.println("<h1>Incorrect Login ID/Password</h1>");
            rd = request.getRequestDispatcher("/1.html");
            rd.include(request, response);
        }
    }
}
