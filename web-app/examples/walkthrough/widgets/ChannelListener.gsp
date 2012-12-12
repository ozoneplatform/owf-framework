<!DOCTYPE html>
<html>
	<head>
	<title>Channel Listener</title>

	<g:if test="${params.themeName != null && params.themeName != ''}">
		<link rel='stylesheet' type='text/css' href='../../../themes/${params.themeName.encodeAsHTML()}.theme/css/${params.themeName.encodeAsHTML()}.css' />
	</g:if>
	<g:else>
		<link href="../../../js-lib/ext-4.0.7/resources/css/ext-all.css" rel="stylesheet" type="text/css">
		<link href="../../../css/dragAndDrop.css" rel="stylesheet" type="text/css">
	</g:else>

	<script type="text/javascript" src="../../../js-lib/ext-4.0.7/ext-all-debug.js"></script>
	<p:javascript src="owf-widget" pathToRoot="../../../" />

	<!-- The widget itself  -->
	<script type="text/javascript" src="ChannelListenerPanel.js"></script>
	<script type="text/javascript">
         //The location is assumed to be at /<context>/js/eventing/rpc_relay.uncompressed.html if it is not set
         //OWF.relayFile = Ozone.util.contextPath() + '/js/eventing/rpc_relay.uncompressed.html';

		owfdojo.config.dojoBlankHtmlUrl = '../../../js-lib/dojo-1.5.0-windowname-only/dojo/resources/blank.html';

		if (Ext.isIE) {
			Ext.BLANK_IMAGE_URL = '../../../themes/common/images/s.gif';
		}

		//hack to fix bug with FF
		//http://www.sencha.com/forum/showthread.php?132187-Issue-with-the-computed-style-on-hidden-elements-using-Firefox-and-Ext-JS-4&p=607608
		if ( Ext.supports.tests != null && Ext.isGecko ) {
			var tests = Ext.supports.tests;
			for (var i = 0 ; i < tests.length ; i++) {
				if (tests[i].identity == 'RightMargin') {
					tests[i].fn = function(doc, div) {
						var view = doc.body.defaultView;
						return !(view && view.getComputedStyle(div.firstChild.firstChild, null).marginRight != '0px');
					};
				}
				else if (tests[i].identity == 'TransparentColor') {
					tests[i].fn = function(doc, div, view) {
						view = doc.body.defaultView;
						return !(view && view.getComputedStyle(div.lastChild, null).backgroundColor != 'transparent');
					}
				}
			}
		}

		Ext.onReady(function() {
			OWF.ready(function(){
				//init quicktips
				Ext.tip.QuickTipManager.init();

                var viewport = Ext.widget('Ozone.components.ChannelListenerPanel');
			});
		});
	</script>
	</head>
	<body>
	</body>
</html>