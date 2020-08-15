#!/usr/bin/with-contenv bashio

sharetype=$1
sharepath="$2"
mountdir="$3"

echo "type: $sharetype path=$sharepath dir=$mountdir"
cd /network_shares
mkdir -p $mountdir
mount -t $sharetype -o ro,username=guest,guest,file_mode=0777,dir_mode=0777 $sharepath $mountdir
exit

