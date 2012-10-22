#!/bin/sh

#Usage: sh watch_all_themes.sh [compass_watch_args]
#This will run an instance of compass watch in the 
#background for each theme.  Note that the output
#of these watches will be intertwined


for file in `ls -d *.theme/sass`
do
    cd "$file"
    compass watch $@ &
    cd ../.. > /dev/null
done

#don't exit until all of the watches are killed.
#This behavior allows this script to be run in a 
#separate terminal window
wait
