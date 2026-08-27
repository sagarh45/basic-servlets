import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Practical 10: Request Information Servlet
 * Displays HTTP method, URI, query string, headers, and parameters.
 * Try: /requestinfo?name=Rahul&city=Solapur
 */
public class RequestInfoServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        out.println("<!DOCTYPE html><html><head><title>Request Info</title></head><body>");
        out.println("<h2>HttpServletRequest Information</h2>");

        // Basic request info
        out.println("<h3>Basic Info</h3>");
        out.println("<table border='1' cellpadding='6'>");
        out.println("<tr><th>Property</th><th>Value</th></tr>");
        out.println("<tr><td>HTTP Method</td><td>" + request.getMethod() + "</td></tr>");
        out.println("<tr><td>Request URI</td><td>" + request.getRequestURI() + "</td></tr>");
        out.println("<tr><td>Context Path</td><td>" + request.getContextPath() + "</td></tr>");
        out.println("<tr><td>Servlet Path</td><td>" + request.getServletPath() + "</td></tr>");
        out.println("<tr><td>Query String</td><td>" + (request.getQueryString() != null ? request.getQueryString() : "(none)") + "</td></tr>");
        out.println("<tr><td>Protocol</td><td>" + request.getProtocol() + "</td></tr>");
        out.println("<tr><td>Remote Addr</td><td>" + request.getRemoteAddr() + "</td></tr>");
        out.println("<tr><td>Remote Host</td><td>" + request.getRemoteHost() + "</td></tr>");
        out.println("</table>");

        // Request parameters
        out.println("<h3>Request Parameters</h3>");
        out.println("<table border='1' cellpadding='6'>");
        out.println("<tr><th>Name</th><th>Value</th></tr>");
        Enumeration<String> paramNames = request.getParameterNames();
        boolean hasParams = false;
        while (paramNames.hasMoreElements()) {
            hasParams = true;
            String name = paramNames.nextElement();
            out.println("<tr><td>" + name + "</td><td>" + request.getParameter(name) + "</td></tr>");
        }
        if (!hasParams) {
            out.println("<tr><td colspan='2'>(no parameters - try ?name=Rahul&amp;city=Solapur)</td></tr>");
        }
        out.println("</table>");

        // Request headers
        out.println("<h3>Request Headers</h3>");
        out.println("<table border='1' cellpadding='6'>");
        out.println("<tr><th>Header Name</th><th>Header Value</th></tr>");
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            out.println("<tr><td>" + headerName + "</td><td>" + request.getHeader(headerName) + "</td></tr>");
        }
        out.println("</table>");

        out.println("<p><a href='requestinfo?name=Rahul&city=Solapur'>Test with query params</a> | ");
        out.println("<a href='index.html#ex-requestinfo'>Back to Index</a></p>");
        out.println("</body></html>");

        System.out.println("[RequestInfoServlet] Displayed request info for " + request.getMethod() + " " + request.getRequestURI());
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}
