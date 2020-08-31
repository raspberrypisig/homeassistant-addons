#!/usr/bin/with-contenv bashio

mkdir -p /network_shares
cd /network_shares
if [ ! -f /data/network_shares.json ];
then 
  echo [] >  /data/network_shares.json
fi
nohup python -m http.server 80 &
port=$(bashio::addons self 'addons.self.network' '.network["8099/tcp"]')

darkmode=$(bashio::config 'dark_mode')
echo "Dark mode: $darkmode"

python -B /run.py "$port" "$darkmode"