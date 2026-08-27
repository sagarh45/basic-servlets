import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

public class CapstoneWelcome extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        show(request, response);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        show(request, response);
    }

    private void show(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("username") == null) {
            response.sendRedirect("capstone.html");
            return;
        }
        String remembered = cookieValue(request, "remember");
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<h1>Welcome " + session.getAttribute("username") + "</h1>");
        out.println("<p>Session (on the server) says: <b>"
                + session.getAttribute("username") + "</b></p>");
        if (remembered == null) {
            out.println("<p>remember cookie (in the browser): not in this request yet."
                    + " A cookie you just wrote comes back on the next click."
                    + " Open Welcome once more to see it.</p>");
        } else {
            out.println("<p>remember cookie (in the browser) says: <b>" + remembered + "</b></p>");
        }
        out.println("<p>Two different places. Close the browser and the session goes,"
                + " but the cookie stays for 7 days. Logout clears both.</p>");
        out.println("<p><a href='CapstoneLogout'>Logout</a></p>");
    }

    /** Value of one cookie, or null if the browser did not send it. */
    private static String cookieValue(HttpServletRequest request, String name) {
        Cookie[] arr = request.getCookies();
        if (arr == null) {
            return null;
        }
        for (int i = 0; i < arr.length; i++) {
            if (name.equals(arr[i].getName())) {
                return arr[i].getValue();
            }
        }
        return null;
    }
}
