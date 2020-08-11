#!/usr/bin/with-contenv bashio

mkdir -p /config/network_shares
cd /config/network_shares
mkdir -p boo
mount -v -t cifs -o rw,vers=3.0,username=guest,guest,file_mode=0777,dir_mode=0777 '//192.168.20.76/Users/Public/wideopen' boo
nohup python -m http.server 80 &
python /run.py