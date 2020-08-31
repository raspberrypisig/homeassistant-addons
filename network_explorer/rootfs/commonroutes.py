from flask import Flask, request, Response, send_from_directory, send_file, jsonify, Blueprint
import requests
import sys
import os
import subprocess
import json
from pathlib import Path

castroutes = Blueprint('castroutes', __name__)

@castroutes.route('/ha/players')
def haplayers():
    supervisor_token = os.environ['SUPERVISOR_TOKEN']
    r = requests.get('http://supervisor/core/api/states', 
        headers={
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + supervisor_token
        }        
    )
    rjson = r.json()
    mediaplayers = [x['entity_id'] for x in rjson if x['entity_id'].startswith("media_player.")]
    return jsonify(mediaplayers)

@castroutes.route('/ha/cast', methods=["POST"])
def castMusic():
    r = request.get_json(force=True)
    url = r['url'] 
    entityid = r['player_entity_id']

    print(url, flush=True)
    print(entityid, flush=True)

    supervisor_token = os.environ['SUPERVISOR_TOKEN']
    r = requests.post('http://supervisor/core/api/services/media_player/play_media', 
        json={
            "entity_id": entityid,
            "media_content_id": url,
            "media_content_type": "music"
        },
        headers={
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + supervisor_token
        }        
    )
    return r.text

@castroutes.route('/cast')
def cast():
    contents=''
    with open('/html/cast/index.html','r') as f:
        contents = f.read()
    return contents

@castroutes.route('/cast/static/js/<path:loc>')
def caststaticjsfiles(loc):
    return send_from_directory("/html/cast/static/js", loc)

@castroutes.route('/cast/static/css/<path:loc>')
def caststaticcssfiles(loc):
    return send_from_directory("/html/cast/static/css", loc)

    

