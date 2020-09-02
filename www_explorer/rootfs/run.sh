#!/usr/bin/with-contenv bashio

port=$(bashio::addons self 'addons.self.network' '.network["8099/tcp"]')
nohup python -m http.server 80 &
python -B /run.py "$port"