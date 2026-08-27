import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Practical 11: HttpServletResponse Demo
 * Demonstrates setContentType(), setStatus(), setHeader(), addHeader().
 */
public class ResponseDemoServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String demo = request.getParameter("demo");

        if ("404".equals(demo)) {
            // Demo: send 404 status with custom message
            response.setContentType("text/html;charset=UTF-8");
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.setHeader("X-Demo-Header", "Custom404Demo");
            PrintWriter out = response.getWriter();
            out.println("<!DOCTYPE html><html><body>");
            out.println("<h2>404 Not Found Demo</h2>");
            out.println("<p>response.setStatus(404) was called.</p>");
            out.println("<p>Check browser DevTools -> Network tab for status code and X-Demo-Header.</p>");
            out.println("<p><a href='response'>Back</a></p></body></html>");
            System.out.println("[ResponseDemoServlet] Sent 404 status demo.");
            return;
        }

        if ("redirect".equals(demo)) {
            // Demo: redirect with custom header (header sent before redirect)
            response.setHeader("X-Before-Redirect", "This header is set before redirect");
            response.sendRedirect("hello");
            System.out.println("[ResponseDemoServlet] Redirect demo to /hello");
            return;
        }

        // Default demo page
        response.setContentType("text/html;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);
        response.setHeader("X-Author", "WIT Advanced Java");
        response.setHeader("X-Practical", "ResponseDemoServlet");
        response.addHeader("X-Multi-Header", "Value-1");
        response.addHeader("X-Multi-Header", "Value-2");
        response.setDateHeader("Last-Modified", System.currentTimeMillis());

        PrintWriter out = response.getWriter();
        out.println("<!DOCTYPE html><html><head><title>Response Demo</title></head><body>");
        out.println("<h2>HttpServletResponse Demonstration</h2>");
        out.println("<table border='1' cellpadding='8'>");
        out.println("<tr><th>Method</th><th>What it does</th><th>Demo</th></tr>");
        out.println("<tr><td>setContentType()</td><td>Sets MIME type of response</td><td>text/html;charset=UTF-8 (this page)</td></tr>");
        out.println("<tr><td>setStatus(200)</td><td>Sets HTTP status code</td><td>SC_OK = 200 (this page)</td></tr>");
        out.println("<tr><td>setHeader()</td><td>Adds/replaces response header</td><td>X-Author, X-Practical sent</td></tr>");
        out.println("<tr><td>addHeader()</td><td>Adds another header value</td><td>X-Multi-Header: Value-1, Value-2</td></tr>");
        out.println("<tr><td>setDateHeader()</td><td>Sets date header</td><td>Last-Modified set to now</td></tr>");
        out.println("<tr><td>sendRedirect()</td><td>302 redirect to new URL</td><td><a href='response?demo=redirect'>Try redirect demo</a></td></tr>");
        out.println("<tr><td>setStatus(404)</td><td>Custom error status</td><td><a href='response?demo=404'>Try 404 demo</a></td></tr>");
        out.println("</table>");
        out.println("<p>Open browser DevTools (F12) -> Network -> click this page -> Headers tab to see response headers.</p>");
        out.println("<p><a href='index.html#ex-response'>Back to Index</a></p>");
        out.println("</body></html>");

        System.out.println("[ResponseDemoServlet] Default response demo displayed.");
    }
}
