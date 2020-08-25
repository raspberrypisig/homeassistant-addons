#!/usr/bin/with-contenv bashio

sharetype="$1"
sharepath="$2"
mountdir="$3"
username="${4:-guest}"
password="${5:-guest}"

mount.cifs -V

cd /network_shares
set -x
mkdir -p "$mountdir"
if [ $username == "guest" -a $password == "guest" ];
then
  mount -t $sharetype -o ro,password "$sharepath" "$mountdir"
else
  mount -t $sharetype -o ro,username=$username,password=$password "$sharepath" "$mountdir"
fi
set +x
exit

