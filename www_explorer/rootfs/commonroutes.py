from flask import Flask, request, Response, send_from_directory, send_file, jsonify, Blueprint
import requests
import sys
import os
import subprocess
import json
from pathlib import Path
from urllib.parse import urlparse

castroutes = Blueprint('castroutes', __name__)

@castroutes.route('/cast/favicon.ico')
def favicon():
    return send_file("/html/favicon.ico")

def _getFilePath(url, basedir):
    return basedir + urlparse(url).path

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
    basedir = os.environ['BASEDIR']
    filepath = _getFilePath(url, basedir)
    fileformat = subprocess.run(["/fileformat.sh", filepath ], capture_output=True)
    mediacontenttype = fileformat.stdout.decode("utf-8")


    print(url, flush=True)
    print(entityid, flush=True)
    print(mediacontenttype, flush=True)

    supervisor_token = os.environ['SUPERVISOR_TOKEN']
    r = requests.post('http://supervisor/core/api/services/media_player/play_media', 
        json={
            "entity_id": entityid,
            "media_content_id": url,
            "media_content_type": mediacontenttype
        },
        headers={
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + supervisor_token
        }        
    )
    print(r.text, flush=True)
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

    

