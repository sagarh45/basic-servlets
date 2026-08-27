import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class TargetServlet extends HttpServlet {

    // Redirect creates a new GET, so doGet is required here.
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        show(request, response);
    }

    // Forward keeps POST, so doPost is required here.
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        show(request, response);
    }

    private void show(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        String msg = (String) request.getAttribute("message");
        String from = request.getParameter("from");
        out.println("<h2>TargetServlet</h2>");
        if (msg != null) {
            out.println("<p>FORWARD: " + msg + " (URL still /forward)</p>");
        } else if (from != null) {
            out.println("<p>REDIRECT from " + from + " student="
                    + request.getParameter("student") + " (URL changed)</p>");
        } else {
            out.println("<p>Direct access</p>");
        }
        out.println("<p><a href='forward.html'>Back</a></p>");
    }
}
