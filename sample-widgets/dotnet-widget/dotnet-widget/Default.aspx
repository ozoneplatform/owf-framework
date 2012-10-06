<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="dotnet_widget._Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title></title>
    <link href="css/dragAndDrop.css" rel="stylesheet" type="text/css"/>
    <script type="text/javascript" src="https://localhost:8443/owf/js-min/owf-widget-min.js"></script>

    <script language="JavaScript" type="text/javascript">
        //The location is assumed to be at /<context>/js/eventing/rpc_relay.uncompressed.html if it is not set
        //OWF.relayFile = '/dotnet/js/eventing/rpc_relay.uncompressed.html';

        owfdojo.config.dojoBlankHtmlUrl = './js/dojo-1.5.0-windowname-only/dojo/resources/blank.html';
        function appInit() {
            OWF.Preferences.getUserPreference({namespace:'com.mycompany.dotnet-widget', name:'channels',
                onSuccess:function(result) {
                    if (result != null && result.value != null) {
                        var val = OWF.Util.parseJson(result.value);
                        document.getElementById('channelNameTextBox').value = val.lastChannel;
                    }
                } , onFailure:onGetFailure});


            }

            var onGetFailure = function(err) {
                alert('Failed to get prefs ' + err);
            };
            
        function addChannel_onclick() {
            var channelName = document.getElementById('channelNameTextBox').value;
            var channelValue = "{ lastChannel: \""+channelName+"\" }";
            OWF.Preferences.setUserPreference({namespace:'com.mycompany.dotnet-widget', name:'channels', value:channelValue});
            OWF.Eventing.subscribe(document.getElementById('channelNameTextBox').value,
                function(sender, msg) {
                    dotnet_widget.ChannelService.ChannelListener(sender, msg);
            });
        }


        owfdojo.addOnLoad(function() {
            OWF.ready(function() {
              appInit();
            });
        });

    </script>
</head>
<body>
    <form id="form1" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server">
        <Services>
            <asp:ServiceReference Path="~/ChannelService.asmx" />
        </Services>
    </asp:ScriptManager>
    
    <asp:UpdatePanel ID="UpdatePanel1" runat="server">
        <ContentTemplate>
            <asp:TextBox ID="channelNameTextBox" runat="server"></asp:TextBox>
            <asp:Button ID="addChannelButton" runat="server" 
              Text="Add Channel" OnClientClick="addChannel_onclick()" 
                onclick="addChannelButton_Click" />
            <br />
            <asp:Label ID="subscribedChannelLabel" runat="server" Text="Subscribed Channels: None"></asp:Label>
            <br />
            
            <asp:Timer ID="updateTimer" runat="server" Interval="5000" 
                ontick="updateTimer_Tick" Enabled="false">
            </asp:Timer>
            
            <br />
            
            <asp:Label runat="server" ID="numberMessagesLabel" Text="Number of Messages: 0"></asp:Label>
            <br />
            <asp:TextBox ID="searchTextBox" runat="server"></asp:TextBox>
            <asp:Button ID="searchButton" runat="server" onclick="searchButton_Click" 
                Text="Search"  />
            <asp:GridView ID="GridView2" runat="server" AutoGenerateColumns="False">
                <Columns>
                    <asp:BoundField DataField="Timestamp" HeaderText="Time" />
                    <asp:BoundField DataField="Source" HeaderText="Sender" />
                    <asp:BoundField DataField="Data" HeaderText="Value" />
                </Columns>
            </asp:GridView>
        </ContentTemplate>
    </asp:UpdatePanel>
    </form>
</body>
</html>
