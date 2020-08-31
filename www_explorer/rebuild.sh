#!/usr/bin/env bash
set -x
echo "Copy files to right directory."
mkdir -p /home/pi/homeassistant/share/hassio/addons/local/www_explorer
rsync -av /home/pi/Developer/homeassistant-addons/network_explorer/rootfs/commonroutes.py /home/pi/Developer/homeassistant-addons/www_explorer/rootfs
rsync -av --delete /home/pi/Developer/homeassistant-addons/network_explorer/cast/build/ /home/pi/Developer/homeassistant-addons/www_explorer/rootfs/html/cast
rsync -avu /home/pi/Developer/homeassistant-addons/www_explorer /home/pi/homeassistant/share/hassio/addons/local

echo "Stopping existing addon."
ha addons stop local_www_explorer
echo "Rebuilding addon."
ha addons rebuild local_www_explorer
echo "Starting addon."
ha addons start local_www_explorer
echo "Done."
