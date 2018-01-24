<!DOCTYPE html>
<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
  <title>Denied</title>

  <owfImport:cssLibrary lib="ext" version="3.2.1" resource="resources/css/ext-all"/>
  <style type="text/css">
      body {
          background-image: url(images/logout/wfBigBG.jpg);
      }
  </style>

  <owfImport:jsLibrary lib="ext" version="3.2.1" resource="adapter/ext/ext-base"/>
  <owfImport:jsLibrary lib="ext" version="3.2.1" resource="ext-all"/>


  <script type="text/javascript">
    Ext.BLANK_IMAGE_URL = '<owfImport:fileLibrary lib="ext" version="3.2.1" resource="resources/images/default/s.gif" />';

    Ext.onReady(function() {
        var contextPath = '${request.contextPath}';

      //check current location to see if we failed from /owf/admin if so try to redirect to main OWF
      if (window.location.href.match(new RegExp('^.*' + contextPath + '\/admin[\/\?]?.*$'))) {
        Ext.MessageBox.alert('Authorization Error',
                'You are not authorized to access this page. You will be redirected to your default dashboard.',
                function redirectToOzone() {
                  window.location.href = contextPath;
                });
      }
      else {
        //failed while accessing something else just show a error dialog
        Ext.MessageBox.show({
            title: 'Authorization Error',
            modal: true,
            closable: false,
            msg: 'You are not authorized to access this page.'
        });
      }
    });
  </script>

</head>
<body>
</body>

</html>
