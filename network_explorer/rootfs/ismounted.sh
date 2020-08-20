#!/usr/bin/with-contenv bashio

mountdir="$1"

echo "ismounted=$mountdir"
cat /etc/mtab
grep "/network_shares/$mountdir" /etc/mtab
exit

