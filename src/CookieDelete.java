import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

/** WatchTube Forget me — DELETE user and lastVideo, then READ remaining. */
public class CookieDelete extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String path = request.getContextPath();
        if (path == null || path.isEmpty()) {
            path = "/";
        }
        Cookie user = new Cookie("user", "x");
        user.setMaxAge(0);
        user.setPath(path);
        response.addCookie(user);

        Cookie video = new Cookie("lastVideo", "x");
        video.setMaxAge(0);
        video.setPath(path);
        response.addCookie(video);

        response.sendRedirect("Cookie3?deleted=1");
    }
}
