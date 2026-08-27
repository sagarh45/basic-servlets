import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class ConfigContextServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        show(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        show(request, response);
    }

    private void show(HttpServletRequest request, HttpServletResponse response) throws IOException {
        ServletConfig config = getServletConfig();
        ServletContext context = getServletContext();
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<h2>" + request.getMethod() + "</h2>");
        out.println("<p>collegeName (context) = " + context.getInitParameter("collegeName") + "</p>");
        out.println("<p>author (config) = " + config.getInitParameter("author") + "</p>");
        out.println("<p>student = " + request.getParameter("student") + "</p>");
        out.println("<p>question = " + request.getParameter("question") + "</p>");
        out.println("<p><a href='lifecycle.html#config'>Back</a></p>");
    }
}
