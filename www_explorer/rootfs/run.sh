#!/usr/bin/with-contenv bashio

nohup python -m http.server 80 &
python -B /run.py