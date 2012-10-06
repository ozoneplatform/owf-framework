#!/bin/sh

#Usage: sh compile_all_themes.sh [compass_compile_args]


for file in `ls -d *.theme/sass`
do
    cd "$file"
    
    #stop if there is an error
    if ! compass compile $@; then
        exit $?
    fi

    cd ../.. > /dev/null
done
