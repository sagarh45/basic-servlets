import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

public class Url1 extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String id1 = request.getParameter("s_id1");
        String id2 = request.getParameter("s_id2");
        if (id1 == null) {
            id1 = "054";
        }
        if (id2 == null) {
            id2 = "055";
        }
        String url = response.encodeURL("Url2?s_id1=" + id1 + "&s_id2=" + id2);
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<h2>Url1</h2>");
        out.println("<p><a href='" + url + "'>next page</a></p>");
        out.println("<p><a href='capstone.html'>Back</a></p>");
    }
}
