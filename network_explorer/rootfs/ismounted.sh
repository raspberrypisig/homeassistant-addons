#!/usr/bin/with-contenv bashio
#set -x
mountdir="$1"
echo "ismounted:$mountdir"

mountdir=$(echo $mountdir |sed 's/ /\\\\040/g')
grep "/network_shares/$mountdir" /etc/mtab
exit

