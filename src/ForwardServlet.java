import java.io.IOException;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class ForwardServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doPost(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String student = request.getParameter("student");
        request.setAttribute("message", "Result for " + student + ": PASS");
        request.setAttribute("source", "ForwardServlet");
        RequestDispatcher rd = request.getRequestDispatcher("/target");
        rd.forward(request, response);
    }
}
