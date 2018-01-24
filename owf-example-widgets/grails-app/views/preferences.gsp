<!DOCTYPE html>
<html>
<head>
    <owf:stylesheet src="static/css/widgetContents.css"/>
    <owf:stylesheet src="static/css/dragAndDrop.css"/>

    <owf:frameworkJs src="owf-widget.js"/>

    <script type="text/javascript">
        //The location is assumed to be at /<context>/js/eventing/rpc_relay.uncompressed.html if it is not
        //uncomment the line below and set the path correctly
        //OWF.relayFile = Ozone.util.contextPath() + '/js/eventing/rpc_relay.uncompressed.html';

        owfdojo.config.dojoBlankHtmlUrl = '${request.contextPath}/static/vendor/dojo-1.5.0-windowname-only/dojo/resources/blank.html';

        function prefsInit() {
            OWF.Preferences.getUserPreference({
                namespace: 'owf.sample.preferences',
                name: 'test-preference-value',
                onSuccess: function (result) {
                    document.getElementById('testPreference').value = result.value || '';
                },
                onFailure: function (err) { }
            });
        }

        function storePreference() {
            OWF.Preferences.getUserPreference({
                namespace: 'owf.sample.preferences',
                name: 'test-preference-value',
                onSuccess: putPreference,
                onFailure: postPreference
            });
        }

        function deletePreference() {
            OWF.Preferences.deleteUserPreference({
                namespace: 'owf.sample.preferences',
                name: 'test-preference-value',
                onSuccess: function (result) {
                    document.getElementById('testPreference').value = '';
                },
                onFailure: function (err) { }
            });
        }

        var putPreference = function (result) {
            setPreference("PUT");
        };
        var postPreference = function (err) {
            setPreference("POST");
        };
        var setPreference = function (method) {
            OWF.Preferences.setUserPreference({
                namespace: 'owf.sample.preferences',
                name: 'test-preference-value',
                value: document.getElementById('testPreference').value,
                onSuccess: onSetPreferenceSuccess,
                onFailure: onSetPreferenceFailure
            });
        };
        var onSetPreferenceSuccess = function (result) { };
        var onSetPreferenceFailure = function (err) { };

        owfdojo.ready(function () {
            OWF.ready(prefsInit);
        });

    </script>
</head>

<body class="examplesBody">
<div class="innerContent">
    <div class="chanName">
        Enter a value to be stored in "owf.sample.preferences/test-preference-value".
    </div>
    <br/><br/>
    <div class="msgName">
        Preference Value:
        <textarea rows="5" id="testPreference" class="widgetFormInput"></textarea>
    </div>
    <br/>
    <input type="submit" id='submitButton' value="Save" onClick="storePreference();" class="ozoneButton" style="float:left;"/>
    <input type="submit" id='deleteButton' value="Delete" onClick="deletePreference();" class="ozoneButton" style="float:left;"/>
</div>
</body>
</html>
