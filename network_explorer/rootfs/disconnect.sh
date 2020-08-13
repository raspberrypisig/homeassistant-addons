#!/usr/bin/with-contenv bashio

mountdir="$1"

cd /config/network_shares
umount $mountdir
exit

