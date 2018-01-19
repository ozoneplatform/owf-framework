<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            margin: 0;
        }

        #contents {
            position: absolute;
            width: 100%;
            height: 100%;

            background: #ddd url('static/themes/a_default.theme/images/bkg_owf.png') no-repeat center;
            background-size: contain, cover;

            text-align: center;
        }

        #login-form {
            display: inline-block;
            position: relative;
            top: 40%;

            margin: auto;
            padding: 1em;

            background: #f4f4f4;

            border: 1px solid #a8a8a8;
            border-radius: 4px;
        }

        .form-row {
            margin: 0.2em;
        }

        .form-actions {
            margin: 0.2em;
        }

        .message {
            margin-bottom: .5em;
            padding: .2em;

            border: 1px solid;
            border-radius: 4px;

            font-style: italic;
        }

        .success {
            background: #bfb;
            border-color: #9f9;
            color: #090;
        }

        .warning {
            background: #ffc;
            border-color: #ff9;
            color: #990;
        }

        .failure {
            background: #fbb;
            border-color: #f99;
            color: #900;
        }

    </style>
</head>
<body>

    <div id="contents">
        <div id="login-form">
            <g:if test="${params.error != null}">
                <div class="message failure">Invalid username or password</div>
            </g:if>
            <g:if test="${params.invalid != null}">
                <div class="message failure">Session invalid - please log in again</div>
            </g:if>
            <g:if test="${params.time != null}">
                <div class="message warning">Session timed out - please log in again</div>
            </g:if>
            <g:if test="${params.out != null}">
                <div class="message success">Logged out</div>
            </g:if>

            <form action="perform_login" method="post">
                <div class="form-row">
                    <label for="username">Username</label>
                    <input id="username" type="text" name="username" required />
                </div>
                <div class="form-row">
                    <label for="password">Password</label>
                    <input id="password" type="password" name="password" required />
                </div>
                <div class="form-actions">
                    <input type="submit" value="Log in"/>
                </div>
            </form>
        </div>
    </div>

</body>
</html>
