import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Practical 13: Request Attribute and Context Attribute Demo
 * setAttribute/getAttribute on request (request scope) and ServletContext (application scope).
 */
public class AttributeDemoServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String action = request.getParameter("action");
        ServletContext context = getServletContext();

        if ("set".equals(action)) {
            // Request attribute - lives only for this request (useful for forward/include)
            request.setAttribute("studentName", "Rahul Patil");
            request.setAttribute("rollNo", "CS2024001");
            request.setAttribute("message", "Request attribute set - visible during forward/include only");

            // Context attribute - lives for entire application (all users share)
            context.setAttribute("visitCount",
                    context.getAttribute("visitCount") == null ? 1
                            : (Integer) context.getAttribute("visitCount") + 1);
            context.setAttribute("appMessage", "Context attribute - shared across all users/sessions");

            System.out.println("[AttributeDemoServlet] Attributes set on request and context.");
        }

        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        out.println("<!DOCTYPE html><html><head><title>Attribute Demo</title></head><body>");
        out.println("<h2>Request Attribute vs Context Attribute</h2>");

        out.println("<h3>Request Attributes (request scope - this request only)</h3>");
        out.println("<table border='1' cellpadding='6'>");
        out.println("<tr><th>Attribute</th><th>Value</th></tr>");
        out.println("<tr><td>studentName</td><td>" + request.getAttribute("studentName") + "</td></tr>");
        out.println("<tr><td>rollNo</td><td>" + request.getAttribute("rollNo") + "</td></tr>");
        out.println("<tr><td>message</td><td>" + request.getAttribute("message") + "</td></tr>");
        out.println("</table>");
        out.println("<p><i>Request attributes are used to pass data during forward/include. Lost after response is sent.</i></p>");

        out.println("<h3>Context Attributes (application scope - entire web app)</h3>");
        out.println("<table border='1' cellpadding='6'>");
        out.println("<tr><th>Attribute</th><th>Value</th></tr>");
        out.println("<tr><td>visitCount</td><td>" + context.getAttribute("visitCount") + "</td></tr>");
        out.println("<tr><td>appMessage</td><td>" + context.getAttribute("appMessage") + "</td></tr>");
        out.println("</table>");
        out.println("<p><i>Context attributes persist until server restart. Shared by all users.</i></p>");

        out.println("<p>");
        out.println("<a href='attributes?action=set'>Set Attributes</a> | ");
        out.println("<a href='attributes'>Refresh (request attrs will be null after new request)</a> | ");
        out.println("<a href='forward'>See forward using request attributes</a> | ");
        out.println("<a href='index.html#ex-attributes'>Index</a>");
        out.println("</p>");
        out.println("</body></html>");
    }
}
