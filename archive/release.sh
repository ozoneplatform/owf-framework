#!/bin/sh

VERSION_PROP=$(cat application.properties | grep app.version)
APP_VERSION=${VERSION_PROP##*=}

USER_HOST="ozone@www.owfgoss.org"
ARTIFACT_PATH="OWF/$APP_VERSION"
LINK_PATH="AML/current_release/owf"

git tag -a v$APP_VERSION -m "released on $(date)"
git push origin master --tags

echo "creating and linking directories on the file server... you can ignore the following error: /etc/bashrc: line 8: id: command not found"
ssh $USER_HOST "mkdir -p $ARTIFACT_PATH"
ssh $USER_HOST "rm -f $LINK_PATH; ln -s /home/jail/home/ozone/$ARTIFACT_PATH $LINK_PATH"

echo "uploading artifacts... you can ignore the following error: /etc/bashrc: line 8: id: command not found"
scp ~/downloads/OWF-bundle-$APP_VERSION.zip $USER_HOST:$ARTIFACT_PATH
scp ~/downloads/OWF-sample-widgets-$APP_VERSION.zip $USER_HOST:$ARTIFACT_PATH