import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class HttpMethodsServlet extends HttpServlet {

    static String name = "Rahul";
    static String roll = "101";
    static String city = "Solapur";
    static boolean exists = true;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String r = request.getParameter("roll");
        String msg;
        if (r == null || r.isEmpty()) {
            msg = "GET view";
        } else if (exists && roll.equals(r)) {
            msg = "GET found roll " + r;
        } else {
            msg = "GET roll not found: " + r;
        }
        show(request, response, msg);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        name = request.getParameter("name");
        roll = request.getParameter("roll");
        city = request.getParameter("city");
        exists = true;
        show(request, response, "POST saved (body, not URL)");
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String r = request.getParameter("roll");
        String c = request.getParameter("city");
        if (exists && roll.equals(r)) {
            city = c;
            show(request, response, "PUT updated city to " + city);
        } else {
            show(request, response, "PUT no matching roll");
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String r = request.getParameter("roll");
        if (exists && roll.equals(r)) {
            exists = false;
            show(request, response, "DELETE removed roll " + r);
        } else {
            show(request, response, "DELETE no matching roll");
        }
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Allow", "GET, POST, PUT, DELETE, TRACE, OPTIONS");
        show(request, response, "OPTIONS Allow header set");
    }

    @Override
    protected void doTrace(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        show(request, response, "TRACE debug (Tomcat may block this)");
    }

    private void show(HttpServletRequest request, HttpServletResponse response, String msg)
            throws IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<h2>request.getMethod() = " + request.getMethod() + "</h2>");
        out.println("<p>" + msg + "</p>");
        if (exists) {
            out.println("<p>Saved: " + name + " / " + roll + " / " + city + "</p>");
        } else {
            out.println("<p>Saved: none</p>");
        }
        out.println("<p><a href='httpmethods.html'>Back</a></p>");
    }
}
