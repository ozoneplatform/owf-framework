<!DOCTYPE html>
<%@ page isErrorPage="true"%>
<%@ page import="org.apache.commons.lang.StringEscapeUtils" %>
<%
	boolean isWindowname = "true".equalsIgnoreCase((String) pageContext
			.getSession().getAttribute("windowname"));
	String msg = "An error has occurred on the server";
	ErrorData ed = null;
	try {
		ed = pageContext.getErrorData();
	} catch (NullPointerException ne) {
		// If the error page was accessed directly, a NullPointerException
		// is thrown at (PageContext.java:514).
		// Catch and ignore it... it effectively means we can't use the ErrorData
	}

	// Display error details for the user
	if (ed != null) {
		String emsg = ed.getThrowable().getMessage();

		if (emsg != null)
			msg += ": " + emsg;
		else
			msg += ".";
	}

    String jsMsg = StringEscapeUtils.escapeHtml(StringEscapeUtils.escapeJavaScript(msg));
    msg = StringEscapeUtils.escapeHtml(msg);

	if (isWindowname) {
%>
<html>
<script type="text/javascript">
window.name = '{ status: 500, data: "<%= jsMsg %>" }';
</script>
<body>
<h3>window.name Transport</h3>
Value in window.name is
<span style="font-weight: bold"><%= msg %></span>
<br />
HTTP Status Code is
<span style="font-weight: bold">500</span>
</body>
</html>
<%
	} else {
        out.println(msg);
	}
%>
