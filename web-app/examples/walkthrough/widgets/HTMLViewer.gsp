<html>
	<head>
	<title>HTML Viewer</title>

	<g:if test="${params.themeName != null && params.themeName != ''}">
		<link rel='stylesheet' type='text/css' href='../../../themes/${params.themeName.encodeAsHTML()}.theme/css/${params.themeName.encodeAsHTML()}.css' />
	</g:if>
	<g:else>
		<link href="../../../js-lib/ext-4.0.7/resources/css/ext-all.css" rel="stylesheet" type="text/css">
		<link href="../../../css/dragAndDrop.css" rel="stylesheet" type="text/css">
	</g:else>
	
	<style type="text/css">
		.x-body {
			background: white;
			color: black;
		}
		
		.content {
			background: transparent;
			border: none;
		}
				
		.no-content {
			text-align: center;
			padding-top: 20px;
			font-size: 2em;
			font-weight: bold;
			color: #999999;
		}
		
		.tab-panel .x-panel-body-default {
			background: transparent;
			border: none;
		}
		
		.widget-tab-bar,
		.x-tab-bar-body {
			overflow: hidden !important;
			height: 28px;
			filter: progid:DXImageTransform.Microsoft.gradient(gradientType=0, startColorstr='#FFCCCFD1', endColorstr='#FF9DA4A9');
			background-image: -webkit-linear-gradient(#CCCFD1, #9DA4A9) !important;
			background-image: -moz-linear-gradient(#CCCFD1, #9DA4A9) !important;
			background-color: #9DA4A9;
			border-color: white;
			border: none;
			padding-bottom: 0px;
			padding-top: 2px;
			padding-left: 2px;
			padding-right: 0px;
		}
		
		.x-border-box .x-tab-bar-top .x-tab-bar-body-default-plain, 
		.x-border-box .x-tab-default-top {
			height: 28px;
		}
		
		.x-tab-default {
			filter: progid:DXImageTransform.Microsoft.gradient(gradientType=0, startColorstr='#FFCCCFD1', endColorstr='#FF9DA4A9');
			background-image: -webkit-linear-gradient(#CCCFD1, #9DA4A9) !important;
			background-image: -moz-linear-gradient(#CCCFD1, #9DA4A9) !important;
			background-color: #9DA4A9;
			border-color: white;
			border-style: solid solid none solid;
			border-width: 1px;
			-webkit-box-shadow: none;
			-moz-box-shadow: none;
			box-shadow: none;
			height: 28px;
		}
		
		.x-tab-inner {
			color: white;
		}
		
		.x-tab-default-top em {
			padding-top: 3px;
		}
		
		.x-tab-default-active {
			filter: none !important;
			background-image: none !important;
			background-color: white !important;
			border-color: #666 !important;
		}
		
		.x-tab-active button .x-tab-inner {
			color: black;
		}
		
		.company-profile {
			margin: 10px;
		}
		
		.company {
			font-size: 18px;
			margin-bottom: 5px;
		}
		
	</style>
	<g:if test="${params.themeName == 'accessibility-bow'}">
	<style type="text/css">
		.widget-tab-bar,
		.x-tab-bar-body {
			filter: progid:DXImageTransform.Microsoft.gradient(gradientType=0, startColorstr='#FFF3F4F4', endColorstr='#FFE6E7E8');
			background-image: -webkit-linear-gradient(#F3F4F4, #E6E7E8);
			background-image: -moz-linear-gradient(#F3F4F4, #E6E7E8);
			background-color: #E6E7E8;
		}
		
		.x-tab {
			filter: progid:DXImageTransform.Microsoft.gradient(gradientType=0, startColorstr='#FFDDDDDD', endColorstr='#FFA5A5A5');
			background-image: -webkit-linear-gradient(#DDD, #A5A5A5) !important;
			background-image: -moz-linear-gradient(#DDD, #A5A5A5) !important;
			background-color: #A5A5A5;
			border-color: #2A2A2A;
		}
		
		.x-tab-inner {
			color: #2A2A2A !important;
		}
		
		.x-tab-default-active {
			filter: progid:DXImageTransform.Microsoft.gradient(gradientType=0, startColorstr='#FFDDDDDD', endColorstr='#FFFFFFFF');
			background-image: -webkit-linear-gradient(#DDD, white) !important;
			background-image: -moz-linear-gradient(#DDD, white) !important;
			background-color: white;
			border-color: #70B0BA;
		}
	</style>
	</g:if>
	<g:if test="${params.themeName == 'accessibility-wob'}">
	<style type="text/css">
		.x-body {
			background: #151515;
			color: white;
		}
		
		.widget-tab-bar,
		.x-tab-bar-body {
			background-color: #151515;
			filter: progid:DXImageTransform.Microsoft.gradient(gradientType=0, startColorstr='#FF4F4F4F', endColorstr='#FF424242');
			background-image: -webkit-linear-gradient(#4F4F4F, #424242);
			background-image: -moz-linear-gradient(#4F4F4F, #424242);
		}
		
		.x-tab {
			filter: progid:DXImageTransform.Microsoft.gradient(gradientType=0, startColorstr='#FF3E4547', endColorstr='#FF556063');
			background-image: -webkit-linear-gradient(#3E4547, #556063) !important;
			background-image: -moz-linear-gradient(#3E4547, #556063) !important;
			background-color: #556063;
			border-color: #336C7C;		
		}
		
		.x-tab-inner {
			color: white;
		}
		
		.x-tab-default-active {
			filter: progid:DXImageTransform.Microsoft.gradient(gradientType=0, startColorstr='#FF474F51', endColorstr='#FF151515') !important;
			background-image: -webkit-linear-gradient(#474F51, #151515) !important;
			background-image: -moz-linear-gradient(#474F51, #151515) !important;
			background-color: #151515 !important;
			border-color: #336C7C;
		}
		
		.x-tab-active button .x-tab-inner {
			color: white;
		}
		
		.no-content {
			text-align: center;
			padding-top: 20px;
			font-size: 2em;
			font-weight: bold;
			color: #666;
		}
	</style>
	</g:if>
	<g:if test="${params.themeName == 'large-text'}">
	<style type="text/css">
		.widget-tab-bar,
		.x-tab-bar-body,
		.x-tab-default,
		.x-border-box .x-tab-bar-top .x-tab-bar-body-default-plain, 
		.x-border-box .x-tab-default-top {
			height: 45px;
		}

		.x-tab button {
			height: 28px;
		}
		
		.x-tab-inner {
			font-size: 22px;
		}
	</style>
	</g:if>

	<script type="text/javascript" src="../../../js-lib/ext-4.0.7/ext-all-debug.js"></script>
    <p:javascript src="owf-widget" pathToRoot="../../../" />
    <script type="text/javascript">
        //The location is assumed to be at /<context>/js/eventing/rpc_relay.uncompressed.html if it is not set
        //OWF.relayFile = Ozone.util.contextPath() + '/js/eventing/rpc_relay.uncompressed.html';

        owfdojo.config.dojoBlankHtmlUrl = '../../../js-lib/dojo-1.5.0-windowname-only/dojo/resources/blank.html';

        owfdojo.addOnLoad(function () {
            OWF.ready(function () {
                // Generate panel id. Make this random to avoid any potential conflicts.
                var randomId = "HTMLViewer_" + guid.util.guid();
                 
                OWF.Intents.receive(
                    {
                        action:'View',
                        dataType:'text/html'
                    },
                    function (sender, intent, data) {
                        var array = data.data;
                        var tabs = [];
                        for (var i = 0; i < array.length; i++) {
                        	var item = array[i];
                        	var tab = {
					            itemId   : item.id,
					            title: item.title || item.id // If no title is specified, use the id
                        	};
                        	
                        	// User can pass a URL or an HTML string
                        	if (item.url) {
                        		tab.url = item.url;
                        		tab.html = "<iframe src='" + item.url + "' width='100%' height='100%'></iframe>";
                    		}
                        	if (item.html) tab.html = item.html;
                        	tabs.push(tab);
                        }
                        
                        if (tabs.length > 0) {
                        	var tabPanel = Ext.getCmp(randomId);
                        	
                        	if (tabPanel) {
                        		// Add new tabs
                        		for (var j = 0; j < tabs.length; j++) {
                        			var tab = tabs[j];
                        			if (!tabPanel.getComponent(tab.itemId)) {
                        				tabPanel.add(tab);
                        			}
                        		}
                    		} else {
                				owfdojo.byId('content').innerHTML = '';
						        new Ext.Viewport({
									items: [{
										xtype: 'tabpanel',
										id: randomId,
										cls: "tab-panel",
									    items: tabs,
									    minTabWidth: 100,
										renderTo: 'content',
									    plain: true,
									    tabBar: {
									    	cls: "widget-tab-bar"
									    },
									    defaults: {
									    	closable: true
									    }
								    }]
								});
							}
						}
                    }
                );
                OWF.notifyWidgetReady();
            });
        });
    </script>
</head>
<body>
	<div id="content" class="content"><div class="no-content">No content to display</div></div>
</body>
</html>