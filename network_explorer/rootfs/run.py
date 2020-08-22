from flask import Flask, request, Response, send_from_directory, send_file
import requests
import sys
import os
import subprocess
import json
from pathlib import Path

app = Flask(__name__)
HOST="0.0.0.0"
PORT=8099

EXTERNALPORT=sys.argv[1]

networkshares = None

class NetworkShares:
    def __init__(self):
        with open('/data/network_shares.json') as f:
            self.shares = json.load(f)
        

    def reconnect(self):
        for share in self.shares:
            result = subprocess.run(["/ismounted.sh", share['sharename']])
            if result.returncode == 0:
                share['isconnected'] = True
            else:
                share['isconnected'] = False
                result = subprocess.run(["/mountshare.sh", share['sharetype'], share['sharepath'], share['sharename']])
                if result.returncode == 0:                    
                    share['isconnected'] = True

        print("Reconnect:" + str(self.shares), flush=True)

    def connect(self, index):
        result = subprocess.run(["/mountshare.sh", self.shares[index]['sharetype'], self.shares[index]['sharepath'], self.shares[index]['sharename']])
        if result.returncode == 0:
            self.shares[index]["isconnected"] = True
            return True

        self.shares[index]["isconnected"] = False
        return False
      


    def add(self, type, path, mountdir):
        self.shares.append({
          'sharetype': type,
          'sharepath': path,
          'sharename': mountdir
        })
        with open('/data/network_shares.json', 'w') as f:
            json.dump(self.shares, f)

    def remove(self, name):
        self.shares = [i for i in self.shares if i['sharename'] != name]
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

@app.route('/admin/shares', methods=['GET'])
def getShares():
    networkshares.reconnect()
    result = json.dumps(networkshares.shares, default = lambda x: x.__dict__)
    print("AdminShares:" + result, flush=True)
    resp = Response(result)
    resp.headers['Content-Type'] = 'application/json'
    return resp


@app.route('/admin/connect', methods=['POST'])
def connect():
    data = request.get_json(force=True)
    result = subprocess.run(["/mountshare.sh", data['sharetype'], data['sharepath'] , data['sharename']])
    if result.returncode == 0:
        return "0"
    return "1"

@app.route('/admin/disconnect/<mountdir>', methods=['POST'])
def disconnect(mountdir):
    subprocess.run(["/disconnect.sh", mountdir])
    return ""

@app.route('/admin/addnetworkshare', methods=['POST'])
def addnetworkshare():
    data = request.get_json(force=True)
    result = subprocess.run(["/mountshare.sh", data['sharetype'], data['sharepath'] , data['sharename']])
    if result.returncode == 0:
        networkshares.add(data["sharetype"],  data['sharepath'] , data['sharename'])
    return str(result.returncode)

@app.route('/admin/remove/<name>', methods=['POST'])
def removenetworkshare(name):
    networkshares.remove(name)
    subprocess.run(["/umountshare.sh", name])
    return ""


@app.route('/admin')
def httpserver():
    return send_from_directory("/html", "index.html")

@app.route('/')
def index():
    return _proxy()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def default(path):
    hasExtension = Path(path).suffix.startswith(".")
    if hasExtension:
        return send_file("/network_shares/" +  path, conditional=True)   
    return _proxy()

def loadSavedNetworkShares():
    return NetworkShares()

if __name__ == "__main__":
    networkshares = loadSavedNetworkShares()
    networkshares.reconnect()
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    app.run(host=HOST, port=PORT)

