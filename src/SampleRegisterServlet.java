import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/** Sample registration form — POST only so password stays out of the URL. */
public class SampleRegisterServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html; charset=UTF-8");
        PrintWriter out = response.getWriter();
        out.println("<!DOCTYPE html>");
        out.println("<html><head><meta charset='UTF-8'><title>Registration</title></head><body>");
        out.println("<h2>request.getMethod() = " + request.getMethod() + "</h2>");
        out.println("<table border='1' cellpadding='6'>");
        Enumeration<String> names = request.getParameterNames();
        while (names.hasMoreElements()) {
            String n = names.nextElement();
            out.println("<tr><td>" + n + "</td><td>" + nullToEmpty(request.getParameter(n)) + "</td></tr>");
        }
        out.println("</table>");
        out.println("<p><a href='sample-registration.html'>Back</a></p>");
        out.println("</body></html>");
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.sendRedirect("sample-registration.html");
    }

    private static String nullToEmpty(String s) {
        return s == null ? "" : s;
    }
}
