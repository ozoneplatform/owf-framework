:: create-certificates.bat

::  This script is provided as a utility to help OWF and Marketplace users
:: create simple, self signed server certificates and optionally user
:: PKI certificates.
::
:: Please use this script in conjunction with the User Admin Guide and the
:: Quick Start Guide.
::

@echo off & setLocal EnableDelayedExpansion

:: the variables may be modified if desired.
set DEFAULT_USER_PASSWORD=password
set DEFAULT_KEYSTORE_PASSWORD=changeit
set DEFAULT_COUNTRY_CODE=US


echo Welcome to the OWF and Marketplace Self-Signed Certificate Creation Script.
echo.
echo In order to use this script, you must have openssl on your path.  To test this,
echo open a command prompt and type 'openssl'.  If it errors out, install openssl.
echo You also have to have keytool.  To test if you have keytool, open a cmd
echo prompt and type keytool.
echo.
echo This script is provided as a utility to help OWF and Marketplace users
echo create simple, self signed server certificates and optionally user
echo PKI certificates.
echo.
echo Please use this script in conjunction with the User Admin Guide and the
echo Quick Start Guide.
echo.
echo Be aware that self-signed certificates do not constitute a good quality
echo production security system, and any self-signed certificate will trigger
echo warnings and potentially security problems.  It is recommended
echo that prior to considering a security system production quality all
echo certificates be signed by a recognized certificate authority, such
echo as Verisign or an internally trusted agent.
echo.
set /p t=Press enter to continue....

: menu
echo.
echo --------------------------------------------------------------------------
echo.
echo MENU
echo.
echo 1.  EASY: Create self-signed certificate authority key and certificate, server certificate, and user certificates.
echo 2.  Create only a self-signed certificate authority key and certificate.
echo 3.  Create only a server certificate.  You must already have certificate authority key and crt files.
echo 4.  Create only PKI user certificates.  You must already have certificate authority key and crt files.
echo 5.  Exit.
echo.
echo --------------------------------------------------------------------------
echo.
echo.
set /p menuChoice=Your choice:
echo.
echo --------------------------------------------------------------------------
echo.

goto %menuChoice%


:: SUBROUTINES

:CREATE_SELF_SIGNING_CERT_AUTHORITY
:: This subroutine expects four variables to be set:
:: RETURN:  The label to return to
:: cakeyname=%hostname%-ca.key  The name of the certificate authority key file to create
:: cacertname=%hostname%-ca.crt The name of the certificate authority certificate request to create
:: hostname= the name of the certificate authority.  Example localhost
::
:: This subroutine creates two files--cakeyname, the cert authority's key
:: and cacertname, certificate authority cert request

:: generate the user's config file
set configFile=%hostname%.config
echo dir=. >> %configFile%
echo [ req ] >> %configFile%
echo output_password=pass:%DEFAULT_KEYSTORE_PASSWORD% >> %configFile%
echo distinguished_name = req_distinguished_name >> %configFile%
echo prompt=no >> %configFile%
echo req_extensions=v3_req >> %configFile%
echo x509_extensions= v3_ca >> %configFile%
echo [ req_distinguished_name ]  >> %configFile%
echo organizationName=%hostname% >> %configFile%
echo organizationalUnitName=%hostname% >> %configFile%
echo emailAddress=%hostname% >> %configFile%
echo localityName=%hostname% >> %configFile%
echo stateOrProvinceName=%hostname% >> %configFile%
echo commonName=%hostname% >> %configFile%
echo countryName=%DEFAULT_COUNTRY_CODE% >> %configFile%
echo [ v3_req ] >> %configFile%
echo basicConstraints=CA:FALSE >> %configFile%
echo keyUsage=nonRepudiation,digitalSignature,keyEncipherment >> %configFile%
echo [ v3_ca ] >> %configFile%
echo subjectKeyIdentifier=hash >> %configFile%
echo authorityKeyIdentifier=keyid:always,issuer:always >> %configFile%
echo basicConstraints=critical,CA:true >> %configFile%

:: generate ca key
openssl genrsa -des3 -out %cakeyname% -passout pass:%DEFAULT_KEYSTORE_PASSWORD% 4096

:: generate ca cert request with default password
openssl req -new -x509 -days 365 -key %cakeyname% -passin pass:%DEFAULT_KEYSTORE_PASSWORD% -out %cacertname% -config %configFile%

:: remove config file, we don't need it anymore
del %configFile%

echo Created %cakeyname% and %cacertname%
echo.
goto %RETURN%




:CREATE_SERVER_CERTIFICATE
:: This subroutine expects five variables to be set:
:: RETURN:  The label to return to
:: cakeyname=%hostname%-ca.key  The name of the certificate authority key file to create
:: cacertname=%hostname%-ca.crt The name of the certificate authority certificate to create
:: hostname= the name of the certificate authority.  Example localhost
:: hostkeystorename: hostname.jks  the name of the keystore for the server

set servercertificaterequest=%hostname%.csr
set servercertname=%hostname%.crt

echo.

::generate a key for the server hostname
keytool -genkey -alias %hostname% -keyalg RSA -keypass %DEFAULT_KEYSTORE_PASSWORD% -keystore %hostkeystorename%  -storepass %DEFAULT_KEYSTORE_PASSWORD% -dname "CN=%hostname%, OU=%hostname%, O=%hostname%, L=%hostname%, S=%hostname%, C=%DEFAULT_COUNTRY_CODE%"

:: generate a cert request and keystore for the server hostname
keytool -certreq -alias %hostname% -keyalg RSA -file %servercertificaterequest% -keystore %hostkeystorename%  -storepass %DEFAULT_KEYSTORE_PASSWORD%

:: there is no way to pass in the password to the next step--the user must enter it manually
echo ************************************************************************
echo.
echo NOTE:  The password for the next step is %DEFAULT_KEYSTORE_PASSWORD%.
echo.
echo ************************************************************************
echo.

:: generate the signed x509 certificate request for the server
openssl x509 -req -days 365 -in %servercertificaterequest% -CA %cacertname% -CAkey %cakeyname% -set_serial !random! -out %servercertname%

:: import the ca into the keystore as the trust chain
keytool -import -trustcacerts -file %cacertname% -keystore %hostkeystorename% -storepass %DEFAULT_KEYSTORE_PASSWORD% -noprompt -alias ca-%hostname%

:: import the signed server certificate into the keystore
keytool -import -file %servercertname% -keystore %hostkeystorename% -storepass %DEFAULT_KEYSTORE_PASSWORD% -alias %hostname%


echo.
echo ************************************************************************
echo.
echo %hostkeystorename% in %CD% is the server keystore for you to use as your keystore
echo and truststore.  It's password is %DEFAULT_KEYSTORE_PASSWORD%.
echo.
echo ************************************************************************
echo.


goto %RETURN%


:CREATE_USER_CERT
:: This subroutine expects three variables to be set:
:: RETURN:  The label to return to
:: cakeyname=%hostname%-ca.key  The name of the certificate authority key file to create
:: cacertname=%hostname%-ca.crt The name of the certificate authority certificate to create

set /p username=Enter the username of the person you want to generate a certificate for:
echo.

set userkeyfile=%username%.key
set usercsrfile=%username%.csr
set csrfile=%username%.csr
set crtfile=%username%.crt
set p12file=%username%.p12
set configFile=%username%.config

:: generate the user's config file
echo dir=. >> %configFile%
echo [ req ] >> %configFile%
echo output_password=pass:%DEFAULT_USER_PASSWORD% >> %configFile%
echo input_password=pass:%DEFAULT_USER_PASSWORD% >> %configFile%
echo distinguished_name = req_distinguished_name >> %configFile%
echo prompt=no >> %configFile%
echo [ req_distinguished_name ]  >> %configFile%
echo organizationName=%username% >> %configFile%
echo organizationalUnitName=%username% >> %configFile%
echo emailAddress=%username% >> %configFile%
echo localityName=%username% >> %configFile%
echo stateOrProvinceName=%username% >> %configFile%
echo commonName=%username% >> %configFile%
echo countryName=%DEFAULT_COUNTRY_CODE% >> %configFile%

:: generate the user's RSA private key
openssl genrsa -des3 -out %userkeyfile% -passout pass:%DEFAULT_USER_PASSWORD% 4096
:: generate a request for a user certificate
openssl req -new -key %userkeyfile% -passin pass:%DEFAULT_USER_PASSWORD% -out %usercsrfile% -config %configFile%
openssl x509 -req -days 365 -in %csrfile% -CA %cacertname% -CAkey %cakeyname% -passin pass:%DEFAULT_KEYSTORE_PASSWORD% -set_serial !random! -out %crtfile%
openssl pkcs12 -in %crtfile% -inkey %username%.key -out %p12file% -export -name "%username%"  -passin pass:%DEFAULT_USER_PASSWORD% -passout pass:%DEFAULT_USER_PASSWORD%

del %configFile%
echo.
echo *******************************************************
echo.
echo The certificate for your user to import into his/her browser is %p12file% in %CD%.  The password to import the file into the browser is %DEFAULT_USER_PASSWORD%.
echo.
echo *******************************************************
echo.
goto %RETURN%



:: MENU OPTIONS


:1
echo Your choice: Create self-signed certificate authority, server certificate, and user certificates.

set /p hostname=What is your hostname?  It should match your expected url. (IE localhost):
set cakeyname=%hostname%-ca.key
set cacertname=%hostname%-ca.crt

set RETURN=CREATE_MY_ALL_SELF_SIGNED_CA
goto CREATE_SELF_SIGNING_CERT_AUTHORITY
:CREATE_MY_ALL_SELF_SIGNED_CA


set hostkeystorename=%hostname%.jks
set RETURN=CREATE_ALL_MY_SERVER_CERT
goto CREATE_SERVER_CERTIFICATE
:CREATE_ALL_MY_SERVER_CERT


: DOWHILE_CREATEUSERALL
set RETURN=ALL_CREATE_USER_CERT
goto CREATE_USER_CERT
: ALL_CREATE_USER_CERT
set /p anotherRound=Would you like to create another user certificate? (Y/N)

if %anotherRound%==Y goto DOWHILE_CREATEUSERALL
if %anotherRound%==y goto DOWHILE_CREATEUSERALL



echo.
echo **************************************************
echo.
echo Your server's keystore name is %hostkeystorename% and it's in %CD%.  The password is %DEFAULT_KEYSTORE_PASSWORD%.  Use this file as your truststore and your keystore.
echo.
echo **************************************************
echo.


goto menu



:2
echo Your choice: Create only a self-signed certificate authority.

set /p hostname=What is your hostname (example localhost):
set cakeyname=%hostname%-ca.key
set cacertname=%hostname%-ca.crt

set RETURN=CREATE_ONLY_SELF_SIGNED_CA
goto CREATE_SELF_SIGNING_CERT_AUTHORITY
:CREATE_ONLY_SELF_SIGNED_CA

echo.
echo.
echo Your files, %cacertname% and %cakeyname%, were created in %CD%.

goto menu




:3
echo Your choice: Create only a server certificate.  You must already have a certificate authority file and a ca key file.


set /p hostname=What is your hostname:
set /p cacertname=What is your certificate authority filename?  ( probably named %hostname%-ca.crt):
set /p cakeyname=What is your certificate key filename?  ( probably named %hostname%-ca.key):
set hostkeystorename=%hostname%.jks

set RETURN=CREATE_SERVER_CERT_ONLY
goto CREATE_SERVER_CERTIFICATE
:CREATE_SERVER_CERT_ONLY
echo.
goto menu







:4
:LOOP_GENERATE_USER_CERT
echo Your choice: Create only PKI user certificates.  You must already have your certificate authority key file and ca crt file.

set /p cakeyname=Enter the name of the certificate authority key file (probably HOSTNAME-ca.key):
set /p cacertname=Enter the name of the certificate authority file (probably HOSTNAME-ca.crt):

set RETURN=ONLY_CREATE_USER_CERT
goto CREATE_USER_CERT
:ONLY_CREATE_USER_CERT


set /p anotherRound=Would you like to create another user certificate? (Y/N)

if %anotherRound%==Y goto LOOP_GENERATE_USER_CERT
if %anotherRound%==y goto LOOP_GENERATE_USER_CERT

goto menu



:5
echo Exiting...
