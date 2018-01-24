<%@ page contentType="text/html;charset=UTF-8" %>

<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

    <title>Color Server</title>

    <owf:stylesheet src="static/css/dragAndDrop.css"/>

    <owf:frameworkJs src="owf-widget.js"/>

    <script type='text/javascript'>
        function getColors() {
            return ['Red', 'Blue', 'Yellow'];
        }

        function changeColor(color) {
            var b = owfdojo.body();
            b.style.backgroundColor = color;
            return true;
        }

        OWF.ready(function () {
            OWF.RPC.registerFunctions([
                {
                    name: 'getColors',
                    fn: getColors
                }, {
                    name: 'changeColor',
                    fn: changeColor
                }
            ]);
        });
    </script>
</head>

<body style="background-color: white;">
    <h1>Color Server</h1>
</body>

</html>
