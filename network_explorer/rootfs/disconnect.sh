#!/usr/bin/with-contenv bashio

mountdir="$1"

cd /network_shares
umount $mountdir
exit

