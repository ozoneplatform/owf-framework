<%@ page contentType="text/html;charset=UTF-8" %>

<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

    <title>Color Client</title>

    <owf:stylesheet src="static/css/dragAndDrop.css"/>

    <owf:frameworkJs src="owf-widget.js"/>

    <script type='text/javascript'>
        function getColorList() {
            OWF.getOpenedWidgets(function (widgetList) {
                var widgetId;
                if (widgetList != null) {
                    for (var i = 0; i < widgetList.length; i++) {
                        if (widgetList[i].id != null && widgetList[i].name.match(/^.*Color Server.*$/) != null) {
                            widgetId = widgetList[i].id;
                            break;
                        }
                    }
                    var errorDiv = document.getElementById("errors");
                    if (widgetId != null) {
                        errorDiv.style.display = "none";
                        OWF.RPC.getWidgetProxy(widgetId, function (widget) {
                            widget.getColors(function (result) {
                                var selColors = owfdojo.byId('colors');
                                if (selColors) {
                                    owfdojo.forEach(selColors.options, function (data) {
                                        selColors.remove(selColors.length - 1);
                                    });
                                    owfdojo.forEach(result, function (data) {
                                        var option = owfdojo.create('option');
                                        option.text = data;
                                        option.value = data
                                        if (owfdojo.isFF) {
                                            selColors.add(option, null);
                                        } else {
                                            selColors.add(option);
                                        }
                                    });
                                }
                            });
                        });
                    } else {
                        errorDiv.style.display = "block";
                    }
                }
            });
        }

        function changeColor(color) {
            OWF.getOpenedWidgets(function (widgetList) {
                var widgetId;
                if (widgetList != null) {
                    for (var i = 0; i < widgetList.length; i++) {
                        if (widgetList[i].id != null && widgetList[i].name.match(/^.*Color Server.*$/) != null) {
                            widgetId = widgetList[i].id;
                            break;
                        }
                    }
                    var errorDiv = document.getElementById("errors");
                    if (widgetId != null) {
                        errorDiv.style.display = "none";
                        OWF.RPC.getWidgetProxy(widgetId, function (widget) {
                            widget.changeColor(color);
                        });
                    } else {
                        errorDiv.style.display = "block";
                    }
                }
            });
        }
    </script>
</head>

<body style="background-color: white;">
    <h1>Color Client</h1>
    <button type="button" onclick="getColorList()">List Colors</button>
    <select id="colors" onclick="changeColor(this.value)"></select>
    <div></div>
    <div id="errors" style="color:red;font-weight:bold;display:none;">Missing Color Server!</div>
</body>

</html>
