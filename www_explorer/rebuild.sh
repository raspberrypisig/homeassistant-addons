#!/usr/bin/env bash
echo "Copy files to right directory."
mkdir -p /home/pi/homeassistant/share/hassio/addons/local/www_explorer
rsync -avu /home/pi/Developer/homeassistant-addons/www_explorer /home/pi/homeassistant/share/hassio/addons/local
echo "Stopping existing addon."
ha addons stop local_www_explorer
echo "Rebuilding addon."
ha addons rebuild local_www_explorer
echo "Starting addon."
ha addons start local_www_explorer
echo "Done."
