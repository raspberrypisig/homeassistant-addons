#!/usr/bin/with-contenv bashio

mountdir="$1"

echo "ismounted=$mountdir"
grep "/network_shares/$mountdir" /etc/mtab
exit

