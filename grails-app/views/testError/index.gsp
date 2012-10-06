<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
	<meta name="index" content="main" />
    <title>Test Error Page</title>
	<script type="text/javascript" src="/owf/js/lang/ozone-lang.js"></script>
	<script type="text/javascript" src="/owf/js-lib/jquery-1.2.6/jquery-1.2.6.js"></script>
	<script type="text/javascript" src="/owf/js/util/error.js"></script>
	<script type="text/javascript" src="/owf/js/dojo-1.5.0-windowname-only/owfdojo.js"></script>
	<script type="text/javascript" src="/owf/js-lib/ext-2.2/adapter/ext/ext-base.js"></script>	
	<script type="text/javascript" src="/owf/js-lib/ext-2.2/ext-all.js"></script>
	<script type="text/javascript" src="/owf/js/config/config.js"></script>
	<script type="text/javascript" src="/owf/js/util/util.js"></script>
	<script type="text/javascript" src="/owf/js/pref/preference.js"></script>
	<script type="text/javascript" src="/owf/js/util/transport.js"></script>
	    <script type="text/javascript">
		function onFailure(error,status){
			Ozone.util.ErrorDlg.show(error);
		};
	    function forceError()
	    {
	    	Ozone.util.Transport.send({url:"/owf/testerror/throwerror/",method:'GET',
	    	    	onSuccess:function(){ alert('SUCCESS');},onFailure:onFailure});
	    }
    </script>
</head>
<body>
<input type='submit' onclick="forceError();" value="Force 500 Error"/><P></P>
</body>
