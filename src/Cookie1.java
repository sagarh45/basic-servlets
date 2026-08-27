import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

public class Cookie1 extends HttpServlet {

    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String login = request.getParameter("login");
        if (login == null || login.isEmpty()) {
            login = "guest";
        }
        Cookie c = new Cookie("user", login);
        c.setMaxAge(60 * 60);
        response.addCookie(c);
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<h2>Continue as " + login + "</h2>");
        out.println("<p>This browser saved your name (cookie user=" + login + "), like YouTube Remember me.</p>");
        out.println("<p>Password is not stored.</p>");
        out.println("<p><a href='Cookie2'>Open Home (last watched)</a> | <a href='CookieDelete'>Forget me on this device</a></p>");
        out.println("<p><a href='capstone.html'>Back</a></p>");
    }
}
