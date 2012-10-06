<!DOCTYPE html>
<html>
<script id="owfTransport" type="text/javascript">
  window.name = '{ status:${status.encodeAsJavaScript()}, data: ${value.encodeAsJavaScript()} }';
</script>
	<body>
	    <h3>window.name Transport</h3>
		Value in window.name is <span style="font-weight:bold">${value?.encodeAsHTML()}</span><br/>
		HTTP Status Code is <span style="font-weight:bold">${status.encodeAsHTML()}</span>
	</body>
</html>
