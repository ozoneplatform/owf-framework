#! /bin/bash
# create-certificates.sh
#
#  This script is provided as a utility to help OWF and Marketplace users
# create simple, self signed server certificates and optionally user
# PKI certificates.
#
# Please use this script in conjunction with the User Admin Guide and the
# Quick Start Guide.
#

DEFAULT_USER_PASSWORD="password"
DEFAULT_KEYSTORE_PASSWORD="changeit"
DEFAULT_COUNTRY_CODE="US"

# createSelfSigningCertAuthority cakeyname cacertname hostname
#
# This subroutine expects three parameters to be set:
# cakeyname=%hostname%-ca.key  The name of the certificate authority key file to create
# cacertname=%hostname%-ca.crt The name of the certificate authority certificate to create
# hostname= the name of the certificate authority.  Example localhost
#
# It creates two files, the certificate authority keystore (cakeyname) and the certificate
# authority cert, cacertname.  Passwords are set to DEFAULT_KEYSTORE_PASSWORD
#
function createSelfSigningCertAuthority
{
    #set local variables
	local l_cakeyname=${1}
	local l_cacertname=${2}
	local l_hostname=${3}

    # generate the user's config file
    local l_configFile=${l_hostname}.config
	echo "dir=." >> ${l_configFile}
	echo "[ req ]" >> ${l_configFile}
	echo "output_password=pass:${DEFAULT_KEYSTORE_PASSWORD}" >> ${l_configFile}
	echo "distinguished_name = req_distinguished_name" >> ${l_configFile}
	echo "prompt=no" >> ${l_configFile}
    echo "req_extensions=v3_req" >> ${l_configFile}
    echo "x509_extensions= v3_ca" >> ${l_configFile}
	echo "[ req_distinguished_name ]"  >> ${l_configFile}
	echo "organizationName=${l_hostname}" >> ${l_configFile}
	echo "organizationalUnitName=${l_hostname}" >> ${l_configFile}
	echo "emailAddress=${l_hostname}" >> ${l_configFile}
	echo "localityName=${l_hostname}" >> ${l_configFile}
	echo "stateOrProvinceName=${l_hostname}" >> ${l_configFile}
	echo "commonName=${l_hostname}" >> ${l_configFile}
	echo "countryName=${DEFAULT_COUNTRY_CODE}" >> ${l_configFile}
    echo "[ v3_req ]" >> ${l_configFile}
    echo "basicConstraints=CA:FALSE" >> ${l_configFile}
    echo "keyUsage=nonRepudiation,digitalSignature,keyEncipherment" >> ${l_configFile}
    echo "[ v3_ca ]" >> ${l_configFile}
    echo "subjectKeyIdentifier=hash" >> ${l_configFile}
    echo "authorityKeyIdentifier=keyid:always,issuer:always" >> ${l_configFile}
    echo "basicConstraints=critical,CA:true" >> ${l_configFile}

	# generate certificate authority's keystore
	openssl genrsa -des3 -out ${l_cakeyname} -passout pass:${DEFAULT_KEYSTORE_PASSWORD} 4096

	# generate certificate authority's cert request
	openssl req -new -x509 -days 365 -key ${l_cakeyname} -passin pass:${DEFAULT_KEYSTORE_PASSWORD} -out ${l_cacertname} -config ${l_configFile}


	# remove the config file--we don't need it anymore.
	rm ${l_configFile}

	echo -e "Created ${l_cakeyname} and ${l_cacertname} in `pwd` \n"

}





# createServerCertificate cakeyname cacertname hostname hostkeystorename
#
# This subroutine expects four parameters:
# cakeyname=%hostname%-ca.key  The name of the certificate authority key file to create
# cacertname=%hostname%-ca.crt The name of the certificate authority certificate to create
# hostname= the name of the certificate authority.  Example localhost
# hostkeystorename: hostname.jks  the name of the keystore for the server
#
# This subroutine creates a server key with password DEFAULT_KEYSTORE_PASSWORD for hostname,
# creates a cert request for hostname, signs it with the passed in CA information, and
# then adds it to the hostkeystorename
#
function createServerCertificate
{

	# set up local variables
	local l_cakeyname="${1}"
	local l_cacertname="${2}"
	local l_hostname="${3}"
	local l_hostkeystorename="${4}"

	local l_servercertificaterequest=${hostname}.csr
	local l_servercertname=${hostname}.crt

	echo ""
	# generate server key
	keytool -genkey -alias ${l_hostname} -keyalg RSA -keypass ${DEFAULT_KEYSTORE_PASSWORD} -keystore ${l_hostkeystorename}  -storepass ${DEFAULT_KEYSTORE_PASSWORD} -dname "CN=${l_hostname}, OU=${l_hostname}, O=${l_hostname}, L=${l_hostname}, S=${l_hostname}, C=${DEFAULT_COUNTRY_CODE}"

	# generate server certificate request and keystore
	keytool -certreq -alias ${l_hostname} -keyalg RSA -file ${l_servercertificaterequest} -keystore ${l_hostkeystorename}  -storepass ${DEFAULT_KEYSTORE_PASSWORD}

	# there is no way to pass in a password to the next command--the user must enter this manually
	echo -e "\n************************************************************************\n"
	echo -e "NOTE:  The password for the next step is ${DEFAULT_KEYSTORE_PASSWORD}."
	echo -e "\n************************************************************************\n"

	# generate the signed certificate for the server hostname
	openssl x509 -req -days 365 -in ${l_servercertificaterequest} -CA ${l_cacertname} -CAkey ${l_cakeyname} -set_serial ${RANDOM} -out ${l_servercertname}

	# import the ca into the keystore as a trust chain
	keytool -import -trustcacerts -file ${l_cacertname} -keystore ${l_hostkeystorename} -storepass ${DEFAULT_KEYSTORE_PASSWORD} -noprompt -alias ca-${l_hostname}

	# import the signed server hostname certificate into the keystore
	keytool -import -file ${l_servercertname} -keystore ${l_hostkeystorename} -storepass ${DEFAULT_KEYSTORE_PASSWORD} -alias ${l_hostname}

	echo -e "\n************************************************************************\n"
	echo "${l_hostkeystorename} in `pwd` is the server keystore for you to use as your keystore "
	echo "and truststore.  It's password is ${DEFAULT_KEYSTORE_PASSWORD}."
	echo -e "\n************************************************************************\n"

}


# createUserCertificate cakeyname cacertname
#
# This subroutine expects two paremeters to be set:
# cakeyname=%hostname%-ca.key  The name of the certificate authority key file to create
# cacertname=%hostname%-ca.crt The name of the certificate authority certificate to create
function createUserCertificate
{

	# set up varibles
	local l_cakeyname="${1}"
	local l_cacertname="${2}"

	echo -e "\nEnter the username of the person you want to generate a certificate for:"
	read l_username
	echo ""

	local l_userkeyfile=${l_username}.key
	local l_usercsrfile=${l_username}.csr
	local l_crtfile=${l_username}.crt
	local l_p12file=${l_username}.p12
	local l_configFile=${l_username}.config

	# generate the user's config file
	echo dir=. > ${l_configFile}
	echo [ req ] >> ${l_configFile}
	echo output_password=pass:${DEFAULT_USER_PASSWORD} >> ${l_configFile}
	echo input_password=pass:${DEFAULT_USER_PASSWORD} >> ${l_configFile}
	echo distinguished_name = req_distinguished_name >> ${l_configFile}
	echo prompt=no >> ${l_configFile}
	echo [ req_distinguished_name ]  >> ${l_configFile}
	echo organizationName=${l_username} >> ${l_configFile}
	echo organizationalUnitName=${l_username} >> ${l_configFile}
	echo emailAddress=${l_username} >> ${l_configFile}
	echo localityName=${l_username} >> ${l_configFile}
	echo stateOrProvinceName=${l_username} >> ${l_configFile}
	echo commonName=${l_username} >> ${l_configFile}
	echo countryName=${DEFAULT_COUNTRY_CODE} >> ${l_configFile}

	# generate the user's RSA private key
	openssl genrsa -des3 -out ${l_userkeyfile} -passout pass:${DEFAULT_USER_PASSWORD} 4096

	# generate a request for a user certificate
	openssl req -new -key ${l_userkeyfile} -passin pass:${DEFAULT_USER_PASSWORD} -out ${l_usercsrfile} -config ${l_configFile}

	# sign request
	openssl x509 -req -days 365 -in ${l_usercsrfile} -CA ${l_cacertname} -CAkey ${l_cakeyname} -passin pass:${DEFAULT_KEYSTORE_PASSWORD} -set_serial ${RANDOM} -out ${l_crtfile}

	# export to p12 file
	openssl pkcs12 -in ${l_crtfile} -inkey ${l_userkeyfile} -out ${l_p12file} -export -name "${l_username}"  -passin pass:${DEFAULT_USER_PASSWORD} -passout pass:${DEFAULT_USER_PASSWORD}

	rm ${l_configFile}

	echo -e "\n*******************************************************\n"
	echo The certificate for your user to import into his/her browser is ${l_p12file} in `pwd`.  The password to import the file into the browser is ${DEFAULT_USER_PASSWORD}.
	echo -e "\n*******************************************************\n"
}


# START MAIN EXECUTION

echo -e "Welcome to the OWF and Marketplace Self-Signed Certificate Creation Script. \n"
echo -e "In order to use this script, you must have openssl on your path.  To test "
echo -e "this, open a command prompt and type 'openssl'.  If it errors out, install "
echo -e "openssl."
echo -e "You also have to have keytool.  To test if you have keytool, open a cmd "
echo -e "prompt and type keytool.\n"
echo -e "This script is provided as a utility to help OWF and Marketplace users"
echo -e "create simple, self signed server certificates and optionally user "
echo -e "PKI certificates.  \n"
echo -e "Please use this script in conjunction with the User Admin Guide and the"
echo -e "Quick Start Guide.  \n"
echo -e "Be aware that self-signed certificates do not constitute a good quality"
echo -e "production security system, and any self-signed certificate will trigger"
echo -e "warnings and potentially security problems.  It is recommended"
echo -e "that prior to considering a security system production quality all"
echo -e "certificates be signed by a recognized certificate authority, such"
echo -e "as Verisign or an internally trusted agent. \n"
echo "Press enter to continue...."
read -e temp


# STARTING MENU LOOP

menuChoice="0"
until [ "${menuChoice}" -eq "5" ]; do

   echo -e "\n--------------------------------------------------------------------------\n"
   echo -e "MENU \n"
   echo "1.  EASY: Create self-signed certificate authority key and certificate, server certificate, and user certificates."
   echo "2.  Create only a self-signed certificate authority key and certificate."
   echo "3.  Create only a server certificate.  You must already have certificate authority key and crt files."
   echo "4.  Create only PKI user certificates.  You must already have certificate authority key and crt files."
   echo "5.  Exit."
   echo ""
   echo -e "--------------------------------------------------------------------------\n\n"
   echo "Your choice: "
   read menuChoice
   echo -e "\n--------------------------------------------------------------------------\n"


	if [ "${menuChoice}" -eq "1" ]; then

		echo -e "Create self-signed certificate authority key and certificate, server certificate, and user certificates. \n"

		echo "What is your hostname?  It should match your expected url. (IE localhost):"
		read hostname

		cakeyname=${hostname}-ca.key
		cacertname=${hostname}-ca.crt
		hostkeystorename=${hostname}.jks

		# call function that creates the certificate authority files
		# createSelfSigningCertAuthority cakeyname cacertname hostname
		createSelfSigningCertAuthority "${cakeyname}" "${cacertname}" "${hostname}"

		# this function creates the server certificate files
		# createServerCertificate cakeyname cacertname hostname hostkeystorename
		createServerCertificate "${cakeyname}" "${cacertname}" "${hostname}" "${hostkeystorename}"

                anotherRound="Y"
		while [ "${anotherRound}" = "Y" ] || [ "${anotherRound}" = "y" ] ;  do

			# createUserCertificate cakeyname cacertname
			createUserCertificate ${cakeyname} ${cacertname}

			echo "Would you like to create another user certificate? (Y/N)"
			read anotherRound
		done  # end create user certificates


	elif [ "${menuChoice}" -eq "2" ]; then

		echo -e  "Create only a self-signed certificate authority key and certificate.\n"
		echo "What is your hostname?  (IE localhost):"
		read hostname

		# call function that creates the files
		# createSelfSigningCertAuthority cakeyname cacertname hostname
		createSelfSigningCertAuthority "${hostname}-ca.key" "${hostname}-ca.crt" "${hostname}"


	elif [ "${menuChoice}" -eq "3" ]; then

		echo Create only a server certificate.  You must already have certificate authority key and crt files.

		echo -e "\nWhat is your hostname:"
		read hostname

		echo "What is your certificate authority filename?  ( probably named ${hostname}-ca.crt):"
		read cacertname

		echo "What is your certificate key filename?  ( probably named ${hostname}-ca.key):"
		read cakeyname

		hostkeystorename=${hostname}.jks

		# this function creates the server certificate files
		# createServerCertificate cakeyname cacertname hostname hostkeystorename
		createServerCertificate "${cakeyname}" "${cacertname}" "${hostname}" "${hostkeystorename}"


	elif [ "${menuChoice}" -eq "4" ]; then



   	    echo Create only PKI user certificates.  You must already have certificate authority key and crt files.

		anotherRound="Y"
		while [ "${anotherRound}" = "Y" ] || [ "${anotherRound}" = "y" ] ;  do

			echo "Enter the name of the certificate authority key file (probably HOSTNAME-ca.key):"
			read cakeyname

			echo "Enter the name of the certificate authority file (probably HOSTNAME-ca.crt):"
			read cacertname


			# createUserCertificate cakeyname cacertname
			createUserCertificate ${cakeyname} ${cacertname}

			echo "Would you like to create another user certificate? (Y/N)"
			read anotherRound
		done  # end create user certificates

	fi


done  # end menu loop

echo
echo Exiting....
echo

