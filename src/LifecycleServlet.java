import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class LifecycleServlet extends HttpServlet {

    static int initCount = 0;
    static int serviceCount = 0;
    static String lastVisitor = "-";

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        initCount++;
        System.out.println("init count=" + initCount);
    }

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        serviceCount++;
        super.service(request, response);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        show(response, "GET open video");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        lastVisitor = request.getParameter("visitor");
        show(response, "POST signed " + lastVisitor);
    }

    @Override
    public void destroy() {
        System.out.println("destroy");
        super.destroy();
    }

    private void show(HttpServletResponse response, String msg) throws IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<h2>" + msg + "</h2>");
        out.println("<p>init=" + initCount + " service=" + serviceCount
                + " lastVisitor=" + lastVisitor + "</p>");
        out.println("<p><a href='lifecycle.html'>Back</a></p>");
    }
}
