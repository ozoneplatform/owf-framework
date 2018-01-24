<!DOCTYPE html>
<html>
<head>
	<title>Logout</title>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

	<style type="text/css">
            
html {
    overflow: hidden;
}

html, body {
	margin:0;
	padding:0;
	border:0;
	outline:0;
	font-weight:inherit;
	font-style:inherit;
	font-size:100%;
	font-family:inherit;
	vertical-align:baseline;
        height: 100%;
        width: 100%;
}

:focus {
	outline:0;
}

ul {
	list-style:none;
	font-size:1.1em;
	padding:0 0 18px 40px;
}

/* browser default font-size is 16px which is too big so we make it 16px x 62.5% = 10px */
body {
	font:normal 400 62.5%/1.0 Arial,Verdana,Helvetica,sans-serif;
	min-width:960px;
	background:#000;
	color:#333;
}

/* CONTENT --------------------------------- */
#content {
	padding:0;
	margin:0;
        position: fixed;
        left: 50%;
        top: 50%;
        height: 250px;
        width: 450px;
        overflow: auto;
        margin-top: -125px;
        margin-left: -225px;
}

/* MESSAGES --------------------------------- */
.info, .success {
	clear:both;
	margin:18px 0;
	padding:20px 20px 20px 100px;
	font-size:10px;
        background-color: white;
}

.success {
	border:2px solid #000;
	/*background:#dfa url(../images/confirm.gif) no-repeat 20px 18px;*/
	color:#000000;
}

#content .errors h2, #content .success h2 {
	font-family:Arial,Verdana,Helvetica,sans-serif;
	font-size:18px;
	line-height:48px;
	font-weight:400;
	margin:0 18px 0 0;
	padding:0;
}

#content .success h2 {
	color:#000 !important;
        font-weight: bold;
}

/* begin new styles  -----------------------------------------------------------------------------------------------*/

#background.mozilla {
        background-image: url('themes/a_default.theme/images/stripes_rpt.png'),-moz-radial-gradient(white, #e6e7e8);
        background-position: center center,center center;
        background-repeat: repeat,no-repeat,no-repeat;
}

#background.chrome {
        background-image: url('themes/a_default.theme/images/stripes_rpt.png'),-webkit-radial-gradient(white, #e6e7e8);
        background-position: center center,center center;
        background-repeat: repeat,no-repeat,no-repeat;
}

#background.ie {
        background-color: #f6f6f7;
}

#background.ie #mainpanel {
        background: url('themes/a_default.theme/images/stripes_rpt.png') repeat center center;
        height: 100%;
        width: 100%;
}

	
	</style>
</head>

<%
        String ua = request.getHeader( "User-Agent" );
        boolean isFirefox = ( ua != null && ua.indexOf( "Firefox/" ) != -1 );
        boolean isIE = ( ua != null && ua.indexOf( "MSIE" ) != -1 );
        response.setHeader( "Vary", "User-Agent" );
    %>


    
		<div id="content">


		<div id="msg" class="success">
			<h2>Logout successful</h2>

			<p>You have successfully logged out. Please enter your User ID and Password to login again.</p>
			<p>For security reasons, exit your web browser.</p>
			
			
			
		</div>
		</div>
    
	

</body>
</html>
