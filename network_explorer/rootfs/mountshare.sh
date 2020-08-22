#!/usr/bin/with-contenv bashio

sharetype=$1
sharepath="$2"
mountdir="$3"
username=${4:-guest}
password=${5:-guest}

echo "type: $sharetype path=$sharepath dir=$mountdir username=$username password=$password" 
cd /network_shares
mkdir -p $mountdir
if [ $username == "guest" -a $password == "guest" ];
then
mount -t $sharetype -o ro,username=guest,guest,file_mode=0777,dir_mode=0777 $sharepath $mountdir
else
mount -t $sharetype -o ro,username="$username",password="$password",file_mode=0777,dir_mode=0777 $sharepath $mountdir
fi
exit

