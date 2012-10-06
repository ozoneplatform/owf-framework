package ozone.owf.filter.servlet;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import org.apache.commons.fileupload.*;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import grails.converters.*;

/*
import java.nio.charset.*;
import java.nio.CharBuffer;
import java.nio.ByteBuffer;
 */
import org.codehaus.groovy.grails.web.json.*;

public class FileServlet extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html");

        String errorMsg = "";
        PrintWriter out = response.getWriter();

        boolean isMultipart = ServletFileUpload.isMultipartContent(request);
        if (isMultipart) {
            try {

                // Create a new file upload handler
                ServletFileUpload upload = new ServletFileUpload();

                // Parse the request
                FileItemIterator iter = upload.getItemIterator(request);
                String failureJsonString = "{\"success\": false,\n" + "\"value\": {}\n}";
                while (iter.hasNext()) {
                    FileItemStream item = iter.next();
                    InputStream stream = item.openStream();
                    if (item.isFormField()) {
                        // Do nothing
                    } else {
                        // Process the input stream
                        String data = convertStreamToString(stream);
                        if (data.length() == 0) {
                            data = failureJsonString;
                        } else {
                            try {
                                Boolean jsonStringIsEmpty = false;
                                JSON json = new JSON();
                                JSONElement je = json.parse(data.replace("<", "&lt;").replace(">", "&gt;"));
                                if (je instanceof JSONObject) {
                                    JSONObject jo = (JSONObject) je;
                                    if (jo.isEmpty()) {
                                        data = failureJsonString;
                                    } else {
                                        data = "{\"success\": true,\n" + "\"value\": " + jo.toString() + "\n}";
                                    }
                                } else {
                                    if (je instanceof JSONArray) {
                                        JSONArray ja = (JSONArray) je;
                                        if (ja.isEmpty()) {
                                            data = failureJsonString;
                                        } else {
                                            data = "{\"success\": true,\n" + "\"value\": " + ja.toString() + "\n}";
                                        }
                                    }
                                }
                            } catch (Exception e) {
                                // Set success to false and value to empty JSON
                                data = failureJsonString;
                            }
                        }
                        out.println(data);
                    }
                }
            } catch (Exception e) {
                errorMsg = e.toString();
                out.println(errorMsg);
            }
        }

        out.flush(); // Commits the response
        out.close();
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        doGet(request, response);
    }

    public String convertStreamToString(InputStream is) {
        /*
         * To convert the InputStream to String we use the BufferedReader.readLine()
         * method. We iterate until the BufferedReader return null which means
         * there's no more data to read. Each line will appended to a StringBuilder
         * and returned as String.
         */
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        StringBuilder sb = new StringBuilder();
        int lineCount = 0;
        boolean hasGuid = false;

        String line = null;
        try {
            while ((line = reader.readLine()) != null) {
                lineCount++;
                // The character string 'guid' must exist in the data.
                // If not found clear return string ('sb') and bail out.
                if (!(line.indexOf("guid") == -1)) { hasGuid = true; }
                sb.append(line + "\n");
            }
            if (!hasGuid) { sb.setLength(0); }
        } catch (IOException e) {
            //e.printStackTrace();
            // clear the StringBuilder object
            sb.setLength(0);
            //sb.delete(0, sb.length()-1); 
        } finally {
            try {
                is.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return sb.toString();
    }
}
