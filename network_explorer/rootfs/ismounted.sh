#!/usr/bin/with-contenv bashio

sharetype="$1"
sharepath="$2"
mountdir="$3"

echo "type: $sharetype path=$sharepath dir=$mountdir"
grep $sharetype /etc/mtab | grep $sharepath | grep $mountdir 
exit

