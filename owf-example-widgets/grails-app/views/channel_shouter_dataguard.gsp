<!DOCTYPE html>
<html>
    <head>
        <title>Channel Shouter</title>
        <g:if test="${params.themeName != null && params.themeName != ''}">
            <link rel='stylesheet' type='text/css' href='../../../themes/${params.themeName.encodeAsURL().encodeAsHTML()}.theme/css/${params.themeName.encodeAsURL().encodeAsHTML()}.css' />
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
            shoutInit = owfdojo.hitch(this, function () {

/***************** UNCOMMENT TO AUTO-LAUNCH CHANNEL LISTENER ************************
                OWF.Preferences.findWidgets({
                    searchParams: {
                        widgetName: 'Channel Listener'
                    },
                    onSuccess:function(result) {
                        scope.guid = result[0].id;
                    },
                    onFailure:function(err) {
                    }
                });
*************************************************************************************/

                //add handler to text field for dragging
                owfdojo.connect(document.getElementById('dragSource'), 'onmousedown', this, function(e) {
                    e.preventDefault();
                    var data = document.getElementById('InputChannel').value;
                    if (data != null && data != '') {
                        OWF.DragAndDrop.startDrag({
                            dragDropLabel: Ext.String.htmlEncode(data),
                            dragDropData: data,
                            accessLevel: document.getElementById('AccessLevel').value
                        });
                    }
                });

            });

            shout = owfdojo.hitch(this, function () {
                var channel = document.getElementById('InputChannel').value;
                var message = document.getElementById('InputMessage').value;
                var accessLevel = document.getElementById('AccessLevel').value;

                if (channel != null && channel != '') {

                    OWF.Eventing.publish(channel, message, null, accessLevel);

                    if (scope.guid != null && typeof scope.guid == 'string') {
                        var data = {
                            channel: channel,
                            message: message
                        };
                        var dataString = OWF.Util.toString(data);
/***************** UNCOMMENT TO AUTO-LAUNCH CHANNEL LISTENER ************************
                        OWF.Launcher.launch({
                            guid: scope.guid,
                            launchOnlyIfClosed: true,
                            title: 'Channel Listener Launched',
                            data: dataString
                        }, function(response) {

                            //check if the widgetLaunch call failed
                            if (response && response.error) {
                                //display error message
                            }
                        });
*************************************************************************************/
                    }
                }
            });

            ShouterStrings = {
                channel: 'Channel: ',
                message: 'Message: ',
                broadcast: 'Broadcast',
                accessLevel: 'Access Level:'
            };

            var lang = Ozone.lang.getLanguage();

            if (lang == 'es') {
                ShouterStrings.channel = 'Canal: ';
                ShouterStrings.message = 'Mensaje';
                ShouterStrings.broadcast = 'Difusion';
            }

            owfdojo.ready(function() {
                OWF.ready(shoutInit);
            });
        </script>
     </head>
    <body class="x-panel-body-default">
        <!-- begin changed jee -->
        <div class="innerContent">
            <div class="chanName">
                <script>
                    document.write(ShouterStrings.channel);
                </script>
                <input type="text" id="InputChannel" class="widgetFormInput" size="16"/>
                <span id="dragSource">
                  <img src="../../../images/widget-icons/ChannelShouter.png"  height="16" width="16" style="vertical-align:middle" alt="Enter a Channel Name and then Drag me"/>
                </span>
                <br /><br />
                <script>
                    document.write(ShouterStrings.accessLevel);
                </script>
                <input type="text" id="AccessLevel" class="widgetFormInput" size="16"/>
            </div>
            <br/>
            <br/>
            <div class="msgName">
                <script>
                    document.write(ShouterStrings.message);
                </script>
                <textarea rows="5" id="InputMessage" class="widgetFormInput"></textarea>
            </div>
            <br/>
            <input type="submit" id='submitButton' value="" class="x-btn-default-small x-panel-body-default" onClick="shout();" style="float:left;"/>
            <script>
                document.getElementById('submitButton').value = ShouterStrings.broadcast;
            </script>
        </div>
        <!-- end changed jee -->
    </body>
</html>
