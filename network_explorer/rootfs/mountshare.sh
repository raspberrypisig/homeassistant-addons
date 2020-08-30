#!/usr/bin/with-contenv bashio

set -x

sharetype="$1"
sharepath="$2"
mountdir="$3"
smbver="$4"
username="${5:-guest}"
password="${6:-guest}"

mount.cifs -V

if [ "$smbver" == "default" ];
then
smbver=''
else
smbver=',vers=1.0'
fi

cd /network_shares
set -x
mkdir -p "$mountdir"
if [ $username == "guest" -a $password == "guest" ];
then
  mount -t $sharetype -o "ro,password${smbver}" "$sharepath" "$mountdir"
else
  mount -t $sharetype -o "ro,username=${username},password=${password}${smbver}" "$sharepath" "$mountdir"
fi
set +x
exit

