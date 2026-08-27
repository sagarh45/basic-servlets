import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * GET and POST both in one servlet.
 * doGet()  -> handles method="get" form
 * doPost() -> handles method="post" form
 * web.xml url-pattern: /getpost
 */
public class GetPostDemoServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Same code path: show result of GET submission
        showResult(request, response, "GET");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Same code path: show result of POST submission
        showResult(request, response, "POST");
    }

    /**
     * Common method used by both doGet and doPost.
     */
    private void showResult(HttpServletRequest request, HttpServletResponse response, String method)
            throws IOException {

        String name = request.getParameter("name");
        String email = request.getParameter("email");

        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        out.println("<!DOCTYPE html>");
        out.println("<html><head><meta charset='UTF-8'><title>GET and POST Demo</title></head><body>");
        out.println("<h2>GET and POST in One Servlet</h2>");

        out.println("<h3>Result</h3>");
        out.println("<p><b>HTTP Method used:</b> " + method + "</p>");
        out.println("<p><b>Name:</b> " + (name == null ? "(empty)" : name) + "</p>");
        out.println("<p><b>Email:</b> " + (email == null ? "(empty)" : email) + "</p>");

        if ("GET".equals(method)) {
            out.println("<p style='color:green;'><b>GET:</b> data is visible in the address bar (query string).</p>");
        } else {
            out.println("<p style='color:blue;'><b>POST:</b> data is NOT visible in the address bar.</p>");
        }

        out.println("<hr>");
        out.println("<h3>Try again - both forms call same servlet /getpost</h3>");

        // GET form
        out.println("<form method='get' action='getpost'>");
        out.println("<h4>1) Form with method=get (calls doGet)</h4>");
        out.println("Name: <input type='text' name='name' value='Rahul'><br><br>");
        out.println("Email: <input type='text' name='email' value='a@b.com'><br><br>");
        out.println("<input type='submit' value='Submit using GET'>");
        out.println("</form>");

        out.println("<br>");

        // POST form
        out.println("<form method='post' action='getpost'>");
        out.println("<h4>2) Form with method=post (calls doPost)</h4>");
        out.println("Name: <input type='text' name='name' value='Rahul'><br><br>");
        out.println("Email: <input type='text' name='email' value='a@b.com'><br><br>");
        out.println("<input type='submit' value='Submit using POST'>");
        out.println("</form>");

        out.println("<p><a href='getpost.html'>Back to Execute page</a> | <a href='index.html#ex-getpost'>Index</a></p>");
        out.println("</body></html>");

        System.out.println("[GetPostDemoServlet] method=" + method + ", name=" + name + ", email=" + email);
    }
}
