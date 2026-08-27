import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class GetPostDiffServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String q = request.getParameter("q");
        show(request, response, "GET search q=" + q + " URL=" + request.getQueryString());
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String name = request.getParameter("name");
        String message = request.getParameter("message");
        show(request, response, "POST saved name=" + name + " message=" + message
                + " query=" + request.getQueryString());
    }

    private void show(HttpServletRequest request, HttpServletResponse response, String msg)
            throws IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<h2>request.getMethod() = " + request.getMethod() + "</h2>");
        out.println("<p>" + msg + "</p>");
        out.println("<p><a href='httpmethods.html#getpost'>Back</a></p>");
    }
}
