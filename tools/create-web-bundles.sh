#!/bin/bash

# This script automates the process of re-bundling
# OWF's javascript and css.  It also bundles 
# any css themes stored in the external themes
# directory.  Note that during ths process, the external
# themes directory is moved temporarily
#
# Usage create-web-bundles.sh -o owfLocation -js externalJsLocation [-themes externalThemesLocation]
#
# Arguments: 
# owfLocation - The location of either the OWF war or the extracted 
#   contents of the OWF war on which to operate
# externalJsLocation - The location of the external JS plugin directory.
# externalThemesLocation - The location of the external themes directory.

#Uncomment to debug this script
#set -x

#given a relative path, print out the absolute path
#that points to the same place.  
function to_absolute_path()
{
    local relPath=$1
    if [ -d "$relPath" ]; then
        local relDir=$relPath
        local fileName=''
    else
        local relDir=$(dirname "$relPath")
        local fileName=$(basename "$relPath")
    fi

    pushd "$relDir" > /dev/null
    echo "$(pwd)/${fileName}"
    popd > /dev/null
}

#Read command line arguments
while [ $# -gt 0 ]; do
    if [ $1 = '-o' ]; then
        shift
        owfLocation=$1
    elif [ $1 = '-themes' ]; then
        shift
        externalThemesLocation=$1
    elif [ $1 = '-js' ]; then
        shift
        externalJsLocation=$1
    fi
    shift
done

if [ "x" = "x$owfLocation" ]; then
    echo "owfLocation is not set"
    exit 1
fi

if [ ! -e "$owfLocation" ]; then
    echo "owfLocation does not exist"
    exit 1
fi

if [ "x" = "x$externalJsLocation" ]; then
    echo "externalJsLocation is not set"
    exit 1
fi

if [ ! -e "$externalJsLocation" ]; then
    echo "externalJsLocation does not exist"
    exit 1
fi

owfLocation=$(to_absolute_path ${owfLocation})

#Check to see if its a regular file (not a directory)
if [ -f "$owfLocation" ]; then
    #Extract OWF into a temporary dir
    owfDir=$(mktemp -d owf.XXX)
    pushd "$owfDir" >/dev/null

    if [[ $- == *x* ]]; then 
        jar xvf "$owfLocation" #Add verbose flag if we are in debug mode
    else
        jar xf "$owfLocation"
    fi

    popd
else
    owfDir=$owfLocation
fi

if [ 'x' != "x$externalThemesLocation" ]; then
    #Remove old uiperformance versioned files
    rm -f "$externalThemesLocation/*.theme/css/*__*"

    #Move external themes into extracted war
    mv "$externalThemesLocation" "$owfDir/themes-tmp"
fi


if [ 'x' != "x$externalJsLocation" ]; then
    #Remove old uiperformance versioned files
    rm -f "$externalJsLocation/*__*"

    #Move external themes into extracted war
    mv "$externalJsLocation" "$owfDir/js-plugins"
fi

pushd "$owfDir/WEB-INF/tools" > /dev/null

#invoke jar to actually perform bundling
java -jar createWebBundles.jar

popd

if [ 'x' != "x$externalThemesLocation" ]; then
    #Put external themes back
    mv "$owfDir/themes-tmp" "$externalThemesLocation" 
fi

if [ 'x' != "x$externalJsLocation" ]; then
    #Put external js files back
    mv "$owfDir/js-plugins" "$externalJsLocation" 
fi

if [ "$owfDir" != "$owfLocation" ]; then
    pushd "$owfDir" > /dev/null

    if [[ $- == *x* ]]; then 
        jar cvf "$owfLocation" *
    else
        jar cf "$owfLocation" *
    fi

    popd
    rm -rf "$owfDir"
fi
