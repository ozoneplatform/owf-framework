package ozone.owf.filter.servlet;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;

public class SessionServlet extends HttpServlet { 
	public void doGet(HttpServletRequest request, HttpServletResponse response) 
		throws ServletException, IOException { 
		
		response.setContentType("text/html"); 

		PrintWriter out = response.getWriter(); 
		
		String paramName = request.getParameter("param");
		
        //Obtain the session object, create a new session if doesn't exist
        HttpSession session = request.getSession(true);
        
		String paramValue = (String) session.getAttribute(paramName);
        if (paramValue == null) paramValue = "";
        
        out.print(paramValue);

		out.flush(); // Commits the response
		out.close();
	} 	
	
	public void doPost(HttpServletRequest request, HttpServletResponse response) 
		throws ServletException, IOException { 
		
		String paramName = request.getParameter("key");
		String paramValue = request.getParameter("value");
		
		if (paramName != null && paramValue != null) {
	        //Obtain the session object, create a new session if doesn't exist
	        HttpSession session = request.getSession(true);
	        session.setAttribute(paramName, paramValue);
		}
	}
	
	public void doDelete(HttpServletRequest request, HttpServletResponse response) 
		throws ServletException, IOException { 
		
		String paramName = request.getParameter("key");
		
        //Obtain the session object
        HttpSession session = request.getSession();
        
		// If paramName isn't null, delete session attribute.  Otherwise, invalidate session.
		if (paramName != null) {
	        session.removeAttribute(paramName);
		} else {
			session.invalidate();
		}
	}
}
