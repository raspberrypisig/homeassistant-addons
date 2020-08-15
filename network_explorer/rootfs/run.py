from flask import Flask, request, Response, send_from_directory
import requests
import sys
import os
import subprocess
import json

app = Flask(__name__)
HOST="0.0.0.0"
PORT=8099

EXTERNALPORT=sys.argv[1]

networkshares = None

class NetworkShares:
    def __init__(self):
        with open('/data/network_shares.json') as f:
            self.shares = json.load(f)

    def add(self, type, path, mountdir):
        self.shares.append({
          'type': type,
          'path': path,
          'name': mountdir
        })
        with open('/data/network_shares.json', 'w') as f:
            json.dump(self.shares, f)

    def remove(self, name):
        self.shares = [i for i in self.shares if i['name'] != name]
        with open('/data/network_shares.json', 'w') as f:
            json.dump(self.shares, f)

def _proxy(*args, **kwargs):
    print(request.url, flush=True)
    resp = requests.request(
        method=request.method,
        url=request.url.replace(request.host_url, 'http://127.0.0.1/'),
        headers={key: value for (key, value) in request.headers if key != 'Host'},
        allow_redirects=False)

    excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
    headers = [(name, value) for (name, value) in resp.raw.headers.items()
               if name.lower() not in excluded_headers]

    response = Response(resp.content, resp.status_code, headers)
    return response

@app.route('/homeassistant')
def homeassistant():
    contents=''
    with open('/html/panel.html','r') as f:
        contents = f.read()
    contents = contents.replace('HOMEASSISTANTPORT', EXTERNALPORT)
    return contents

@app.route('/static/js/<path:loc>')
def staticjsfiles(loc):
    return send_from_directory("/html/static/js", loc)

@app.route('/static/css/<path:loc>')
def staticcssfiles(loc):
    return send_from_directory("/html/static/css", loc)

@app.route('/admin/connect', methods=['POST'])
def connect():
    data = request.get_json(force=True)
    result = subprocess.run(["/mountshare.sh", data['NetworkType'], data['NetworkPath'] , data['Name']])
    if result.returncode == 0:
        return "true"
    return "false"

@app.route('/admin/disconnect/<mountdir>', methods=['POST'])
def disconnect(mountdir):
    subprocess.run(["/disconnect.sh", mountdir])
    return ""

@app.route('/admin/addnetworkshare', methods=['POST'])
def addnetworkshare():
    data = request.get_json(force=True)
    result = subprocess.run(["/mountshare.sh", data['NetworkType'], data['NetworkPath'] , data['Name']])
    if result.returncode == 0:
        networkshares.add(data["NetworkType"],  data['NetworkPath'] , data['Name'])
    return str(result.returncode)

@app.route('/admin')
def httpserver():
    return send_from_directory("/html", "index.html")

@app.route('/')
def index():
    return _proxy()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def default(path):
    return _proxy()

def loadSavedNetworkShares():
    return NetworkShares()

if __name__ == "__main__":
    networkshares = loadSavedNetworkShares()
    app.run(host=HOST, port=PORT)

