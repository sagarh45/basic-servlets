import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

public class Cookie3 extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<html><body><h2>Account — cookies on this browser</h2>");
        Cookie[] arr = request.getCookies();
        if (arr != null) {
            for(int i = 0; i < arr.length; i++) {
                out.println(arr[i].getName() + " = " + arr[i].getValue() + "<br>");
            }
        } else {
            out.println("<p>No cookies.</p>");
        }
        out.println("<p><a href='CookieDelete'>Forget me on this device</a> | <a href='index.html#ex-cookie3'>Index</a></p>");
        out.println("</body></html>");
    }
}
