<%@ Page Language="C#" AutoEventWireup="true" %>

<%@ Register Assembly="System.Web.Silverlight" Namespace="System.Web.UI.SilverlightControls" TagPrefix="asp" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" style="height:100%;">
<head runat="server">
    <title>OWFSilverlightDemo</title>
    <link href="css/dragAndDrop.css" rel="stylesheet" type="text/css"/>
    <script type="text/javascript" src="https://localhost:8443/owf/js/config/config.js"></script>
    <script type="text/javascript" language="javascript" src="https://localhost:8443/owf/js-min/owf-widget-min.js"></script>

    <script type="text/javascript">
        //OWF.relayFile = '/silverlight/js/eventing/rpc_relay.uncompressed.html';
        owfdojo.config.dojoBlankHtmlUrl = './js/dojo-1.5.0-windowname-only/dojo/resources/blank.html';
        function subscribe(channel) {
            var cListener = {
                addToChart: function(sender, msg) {
                    var control = document.getElementById("Xaml1");
                    control.Content.Page.UpdateChannelChart(channel, msg);
                },
                subscribe: function() {
                    OWF.Eventing.subscribe(channel, this.addToChart);
                }
            };
            cListener.subscribe();
        }

        function shout(channel, message) {
            OWF.Eventing.publish(channel, message);
        }

        var putChartPreference = function(result) {
            //Preference exists on the server. Let's use PUT.
            setPrefChartVisualization("PUT");
        };

        var postChartPreference = function(err) {
        //Preference does not exist on the server. We need to POST it.
            setPrefChartVisualization("POST");
        };

        var setPrefSuccess = function(result) {
            //alert(result);
        };

        var setPrefFailure = function(result) {
            //alert(result);
        }

        var setPrefChartVisualization = function(method) {
          OWF.Preferences.setUserPreference({namespace:'com.mycompany.SilverlightDemo', name:'chartVisualization',value:this.SilverlightDemoChartName,onSuccess:setPrefSuccess,onFailure:setPrefFailure});
        };

        var setChartVisualization = function(chartname) {
            this.SilverlightDemoChartName = chartname;
            OWF.Preferences.getUserPreference({namespace:'com.mycompany.SilverlightDemo', name:'chartVisualization', onSuccess:putChartPreference, onFailure:postChartPreference});
        };

        var InternalSetChartVisualizationPreference = function(result) {
            if (result != null && result.vallue != null) {
                var control = document.getElementById("Xaml1");
                control.Content.Page.SetChartingType(result.value);
            }
        };

        var NoUserPrefExisted = function(err) {
        //Do nothing, there wasn't a pref
            alert('Error' + err);
        };

        var GetChartingVisualization = function() {
            OWF.Preferences.getUserPreference({namespace:'com.mycompany.SilverlightDemo', name:'chartVisualization', onSuccess:InternalSetChartVisualizationPreference, onFailure:NoUserPrefExisted});
        };
        
        
        
    </script>
</head>
<body style="height:100%;margin:0;">
    <form id="form1" runat="server" style="height:100%;">
        <asp:ScriptManager ID="ScriptManager1" runat="server"></asp:ScriptManager>
        <div  style="height:100%;">
            <asp:Silverlight ID="Xaml1" runat="server" Source="~/ClientBin/OWFSilverlightDemo.xap" 
            MinimumVersion="2.0.31005.0" Width="100%" Height="100%" OnPluginLoaded="GetChartingVisualization"/>
        </div>
    </form>
</body>
</html>