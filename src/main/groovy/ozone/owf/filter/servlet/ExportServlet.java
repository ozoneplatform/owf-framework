package ozone.owf.filter.servlet;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.List;

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
