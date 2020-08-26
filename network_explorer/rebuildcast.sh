#!/usr/bin/env bash
echo "Build web components"
cd cast
npm run build
cd ..

echo "Copy files to right directory."
mkdir -p /home/pi/homeassistant/share/hassio/addons/local/network_explorer
rsync -avu --exclude 'cast' --exclude 'web' /home/pi/Developer/homeassistant-addons/network_explorer /home/pi/homeassistant/share/hassio/addons/local
rsync -av /home/pi/Developer/homeassistant-addons/network_explorer/cast/build/ /home/pi/homeassistant/share/hassio/addons/local/network_explorer/rootfs/html/cast
rsync -av /home/pi/Developer/homeassistant-addons/network_explorer/cast/build/ /home/pi/Developer/homeassistant-addons/network_explorer/rootfs/html/cast
echo "Stopping existing addon."
ha addons stop local_network_explorer
echo "Rebuilding addon."
ha addons rebuild local_network_explorer
echo "Starting addon."
ha addons start local_network_explorer
echo "Done."
