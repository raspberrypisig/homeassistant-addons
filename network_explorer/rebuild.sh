#!/usr/bin/env bash
echo "Copy files to right directory."
rsync -avu /home/pi/Developer/homeassistant-addons/network_explorer /home/pi/homeassistant/share/hassio/addons/local
echo "Stopping existing addon."
ha addons stop local_network_explorer
echo "Rebuilding addon."
ha addons rebuild local_network_explorer
echo "Starting addon."
ha addons start local_network_explorer
echo "Done."
