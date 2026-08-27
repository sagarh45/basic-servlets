import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

/** Notes example: max of two numbers using POST */
public class Max extends HttpServlet {
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        int n1 = Integer.parseInt(request.getParameter("no1"));
        int n2 = Integer.parseInt(request.getParameter("no2"));
        out.println("<html><body><h2>Max (Notes example)</h2>");
        if (n1 > n2)
            out.println("n1=" + n1 + " is max number");
        else if (n2 > n1)
            out.println("n2=" + n2 + " is max number");
        else
            out.println("Both numbers are equal");
        out.println("<p>URL does not show no1/no2 (POST).</p>");
        out.println("<p><a href='max.html'>Try again</a> | <a href='index.html#ex-max'>Index</a></p>");
        out.println("</body></html>");
    }
}
