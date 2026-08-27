import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

public class Cookie2 extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        String display = "guest";
        out.println("<html><body><h2>Home — last watched</h2>");
        Cookie[] arr = request.getCookies();
        if (arr != null) {
            for(int i = 0; i < arr.length; i++) {
                if ("user".equals(arr[i].getName())) {
                    display = arr[i].getValue();
                }
                out.println(arr[i].getName() + " = " + arr[i].getValue() + "<br>");
            }
        } else {
            out.println("<p>No cookies yet. Stay signed in first.</p>");
        }
        out.println("<p>Welcome back " + display + "</p>");
        Cookie c2 = new Cookie("lastVideo", "Java");
        response.addCookie(c2);
        out.println("<p>Saved last watched: Java Servlets (cookie lastVideo=Java), like YouTube remembers the last video.</p>");
        out.println("<p><a href='Cookie3'>Account cookies</a></p>");
        out.println("</body></html>");
    }
}
