<!DOCTYPE html>
<html>
    <head>
        <title>Widget Access</title>
        <g:if test="${params.themeName != null && params.themeName != ''}">
            <link rel='stylesheet' type='text/css' href='../../../themes/${params.themeName.encodeAsHTML()}.theme/css/${params.themeName.encodeAsHTML()}.css' />
        </g:if>
        <g:else>
            <link href="../../../js-lib/ext-4.0.7/resources/css/ext-all.css" rel="stylesheet" type="text/css">
            <link href="../../../css/dragAndDrop.css" rel="stylesheet" type="text/css">
        </g:else>
        
        <script type="text/javascript" src="../../../js-lib/ext-4.0.7/ext-all-debug.js"></script>
        <p:javascript src="owf-widget" pathToRoot="../../../" />
        <script type="text/javascript">

             //The location is assumed to be at /<context>/js/eventing/rpc_relay.uncompressed.html if it is not set
             //OWF.relayFile = Ozone.util.contextPath() + '/js/eventing/rpc_relay.uncompressed.html';

            owfdojo.config.dojoBlankHtmlUrl =  '../../../js-lib/dojo-1.5.0-windowname-only/dojo/resources/blank.html';

            var scope = this;
            init = owfdojo.hitch(this, function () {
                OWF.Preferences.getUserPreference({namespace:'owf.sample.preferences',
                        name:'widget-max-access-level',
                        onSuccess:function(result) {
                            document.getElementById('SystemHigh').value = result.value || '';
                        },
                        onFailure:function(err) { 
                            document.getElementById('SystemHigh').value = '';
                        } 
                });
            });

            owfdojo.ready(function() {
                OWF.ready(init);
            });
            
            function setSystemHigh() {
                OWF.Preferences.setUserPreference({namespace:'owf.sample.preferences',
                                                        name:'widget-max-access-level',
                                                        value:document.getElementById('SystemHigh').value});
            }
        </script>
     </head>
    <body class="x-panel-body-default" style="padding:3px;border:none;">
    	<div style="text-align: center;">
	        <script>
	            document.write("Server Access Level:");
	        </script>
	        <br /><br />
			<select id="SystemHigh" class="widgetFormInput" onchange="setSystemHigh()">
			  <option value="1">1</option>
			  <option value="2">2</option>
			  <option value="3">3</option>
			  <option value="4">4</option>
			  <option value="5">5</option>
			  <option value="6">6</option>
			</select> 				
    	</div>
    </body>
</html>
