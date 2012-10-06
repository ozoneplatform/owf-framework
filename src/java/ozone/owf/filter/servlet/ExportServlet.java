package ozone.owf.filter.servlet;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.util.*;
import org.apache.commons.fileupload.*;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;

public class ExportServlet extends HttpServlet { 
	public void doGet(HttpServletRequest request, HttpServletResponse response) 
		throws ServletException, IOException { 
		response.setContentType("application/x-unknown");
		response.setHeader("Content-Disposition", "attachment; filename=dashboard.json");

		String errorMsg = "";
		PrintWriter out = response.getWriter(); 

		boolean isMultipart = ServletFileUpload.isMultipartContent(request);
		if(isMultipart){
		    try{
		        FileItemFactory factory = new DiskFileItemFactory();
		        ServletFileUpload upload = new ServletFileUpload(factory);
		        List<FileItem> items = upload.parseRequest(request);
		        Iterator<FileItem> iter = items.iterator();
		        
		        while(iter.hasNext()){
		            FileItem item = (FileItem)iter.next();
		            if(item.isFormField()){
		                String name = item.getFieldName();
		                if(name.equals("json")) {
		            		out.println(item.getString());
		                }
		            } 
		        }
		    }catch(Exception e){
		    	System.out.println(e.toString());
		    }
		}

		out.flush(); // Commits the response
		out.close();
	} 
	
	public void doPost(HttpServletRequest request, HttpServletResponse response) 
		throws ServletException, IOException { 
		
		doGet(request, response);		
	} 
}
