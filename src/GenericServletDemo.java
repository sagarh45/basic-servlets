import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.GenericServlet;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;

/**
 * Practical 9: GenericServlet Demo
 * Extends GenericServlet and overrides service() to handle ALL HTTP methods.
 * HttpServlet extends GenericServlet and adds doGet(), doPost(), etc.
 */
public class GenericServletDemo extends GenericServlet {

    private static final long serialVersionUID = 1L;

    @Override
    public void service(ServletRequest request, ServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html;charset=UTF-8");

        PrintWriter out = response.getWriter();
        out.println("<!DOCTYPE html>");
        out.println("<html><head><title>GenericServlet Demo</title></head><body>");
        out.println("<h2>GenericServlet - service() Method Demo</h2>");
        out.println("<p>This servlet extends <b>GenericServlet</b> (not HttpServlet).</p>");
        out.println("<p>We override <b>service()</b> directly instead of doGet()/doPost().</p>");
        out.println("<p><b>Request method info:</b> GenericServlet uses ServletRequest (no getMethod()).</p>");
        out.println("<p><b>Remote address:</b> " + request.getRemoteAddr() + "</p>");
        out.println("<p><b>Server name:</b> " + request.getServerName() + "</p>");
        out.println("<p><i>Note: HttpServlet extends GenericServlet and splits service() into doGet(), doPost(), etc.</i></p>");
        out.println("<p><a href='index.html#ex-generic'>Back to Index</a></p>");
        out.println("</body></html>");

        System.out.println("[GenericServletDemo] service() executed - GenericServlet handles all methods here.");
    }
}
