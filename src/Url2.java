import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

public class Url2 extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<h2>Url2</h2>");
        out.println("<p>s_id1=" + request.getParameter("s_id1") + "</p>");
        out.println("<p>s_id2=" + request.getParameter("s_id2") + "</p>");
        out.println("<p><a href='capstone.html'>Back</a></p>");
    }
}
