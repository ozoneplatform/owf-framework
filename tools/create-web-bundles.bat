@echo off
setlocal
rem This script automates the process of re-bundling
rem OWF's javascript and css.  It also bundles 
rem any css themes stored in the external themes
rem directory.  Note that during ths process, the external
rem themes directory is moved temporarily
rem
rem Usage create-web-bundles.bat -o owfLocation -js externalJsPluginLocation [-themes externalThemesLocation]
rem
rem Arguments: 
rem owfLocation - The location of either the OWF war or the extracted 
rem   contents of the OWF war on which to operate
rem externalJsPluginLocation - The location of the external js directory.
rem externalThemesLocation - The location of the external themes directory.


if [%1]==[] goto NO_ARGS

:GET_ARGS

if "%1"=="" goto GOT_ARGS

    if "%1"=="-o" goto SET_OWFLOCATION

    if "%1"=="-themes" goto SET_EXTERNALTHEMESLOCATION

    if "%1"=="-js" goto SET_EXTERNALJSLOCATION

:SET_OWFLOCATION
    shift
    rem Use ~f to get the full pathname
    set owfLocation=%~f1

    goto GOT_ARG

:SET_EXTERNALTHEMESLOCATION
    shift
    set externalThemesLocation=%~f1

    goto GOT_ARG
    
:SET_EXTERNALJSLOCATION
    shift
    set externalJsLocation=%~f1

:GOT_ARG
    shift
    goto GET_ARGS

:GOT_ARGS

rem check owfLocation
if not defined owfLocation goto ERROR_OWFLOCATION
if not exist "%owfLocation%" goto ERROR_OWFLOCATION

rem check externalJsLocation
if not defined externalJsLocation goto ERROR_JSLOCATION
if not exist "%externalJsLocation%" goto ERROR_JSLOCATION

rem test to see if owfLocation is a dir.  See 
rem http://stackoverflow.com/questions/138981/how-do-i-test-if-a-file-is-a-directory-in-a-batch-script
for %%i in ("%owfLocation%") do if exist %%~si\NUL set isDir=true

if "%isDir%"=="true" goto IS_DIR
    rem owfLocation is a file
    set owfDir=%TEMP%\owf-%TIME:~6,5%
    mkdir %owfDir%

    pushd %owfDir%
    jar xf "%owfLocation%"

    popd

    goto OWFLOCATION_DONE

:IS_DIR
    set owfDir=%owfLocation%

:OWFLOCATION_DONE   
)

if not defined externalThemesLocation goto SKIP_EXTERNALTHEMESLOC1
    if not exist "%externalThemesLocation%" goto SKIP_EXTERNALTHEMESLOC1
        rem If externalThemesLocation is set, move the themes there into the bundle
        pushd "%externalThemesLocation%"
        for /D %%d in ("*.theme") do del "%%d\css\*__*" 2> NUL
        popd
        move "%externalThemesLocation%" "%owfDir%\theme-tmp"

:SKIP_EXTERNALTHEMESLOC1

if not defined externalJsLocation goto SKIP_EXTERNALJSLOC1
    if not exist "%externalJsLocation%" goto SKIP_EXTERNALJSLOC1
        rem If externalThemesLocation is set, move the themes there into the bundle
        pushd "%externalJsLocation%"
        del *__*
        popd
        move "%externalJsLocation%" "%owfDir%\js-plugins"

:SKIP_EXTERNALJSLOC1

pushd "%owfDir%\WEB-INF\tools"

rem invoke jar to actually do bundling
java -jar createWebBundles.jar

popd

if not defined externalThemesLocation goto SKIP_EXTERNALTHEMESLOC2
    rem Put external themes back
    move "%owfDir%\theme-tmp" "%externalThemesLocation%" 
:SKIP_EXTERNALTHEMESLOC2

if not defined externalJsLocation goto SKIP_EXTERNALJSLOC2
    rem Put external js files back
    move "%owfDir%\js-plugins" "%externalJsLocation%" 
:SKIP_EXTERNALJSLOC2

if "%owfDir%"=="%owfLocation%" goto DONE
    pushd "%owfDir%"

    jar cf "%owfLocation%" *

    popd
    rmdir /Q /S "%owfDir%"

:DONE

exit /b 0

:ERROR_OWFLOCATION
echo "owfLocation not set correctly"
goto ERROR_QUIT

:ERROR_JSLOCATION
echo "externalJsLocation not set correctly"
goto ERROR_QUIT

:NO_ARGS
echo Missing arguments: '-o owfLocation' is required, '-js externalJsLocation' is required, '-themes externalThemesLocation' is optional

:ERROR_QUIT
exit /b 1
