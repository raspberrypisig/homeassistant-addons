from flask import Flask, request, Response, send_from_directory, send_file, jsonify, Blueprint
import requests
import sys
import os
import subprocess
import json
from pathlib import Path
from commonroutes import castroutes

app = Flask(__name__)
app.register_blueprint(castroutes)

HOST="0.0.0.0"
PORT=8099

EXTERNALPORT=sys.argv[1]
DARKMODE=sys.argv[2]
BASEDIR="/network_shares/"

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
                if share['guest']:
                    result = subprocess.run(["/mountshare.sh", share['sharetype'], share['sharepath'], share['sharename'], share["smbver"]])
                else:
                    result = subprocess.run(["/mountshare.sh", share['sharetype'], share['sharepath'], share['sharename'],  share["smbver"],  share['username'], share['password']])
                if result.returncode == 0:                    
                    share['isconnected'] = True

        print("Reconnect:" + str(self.shares), flush=True)

    def getShareFromName(self, sharename):
        return next(filter(lambda x: x['sharename'] == sharename, self.shares), None)

    def getIndexFromShareName(self, sharename):
        for index,share in enumerate(self.shares):
            if share["sharename"] == sharename:
                return index
        return -1

    def update(self, sharename, key, value):
        index = self.getIndexFromShareName(sharename)
        if index >= 0 :
            self.shares[index][key] = value

    def connect(self, sharename):
        share = self.getShareFromName(sharename)

        if share['guest']:
            result = subprocess.run(["/mountshare.sh", share['sharetype'], share['sharepath'], share['sharename'],  share["smbver"]])
        else:
            result = subprocess.run(["/mountshare.sh", share['sharetype'], share['sharepath'], share['sharename'],  share["smbver"], share['username'], share['password']])
        if result.returncode == 0:
            self.update(sharename, "isconnected", True)
            return True

        self.update(sharename, "isconnected", False)
        return False
      


    def add(self, type, path, mountdir, guest, smbver, username=None, password=None):
        self.shares.append({
          'sharetype': type,
          'sharepath': path,
          'sharename': mountdir,
          'guest': guest,
          'smbver': smbver,
          'username': username,
          'password': password
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

@app.route('/favicon.ico')
def favicon():
    return send_file("/html/favicon.ico")

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

def modifyURLDir(elem, basepath):
    return {
        "short": elem.name,
        "path": str(elem.relative_to(basepath)),
        "full": f"http://{request.host}/{str(elem.relative_to(basepath))}"
    }

def listDir(basedir, requestedPath):
  basepath = Path(basedir)
  p = basepath.joinpath(requestedPath)
  if p.is_dir():
      directories =  [modifyURLDir(x, basepath) for x in p.iterdir() if x.is_dir()]
      return jsonify(directories)
  else:
      return jsonify([])

@app.route('/api/directories/')
@app.route('/api/directories/<path:req>')
def listSubdirectories(req=""):
    return listDir(BASEDIR, req)

def isFile(elem):
    if elem.is_file():
        return True
    else:
        return False

def listFiles(basedir, requestedPath, glob="*"):
  basepath = Path(basedir)
  p = basepath.joinpath(requestedPath)
  if p.is_dir():
      files = list(p.glob(glob))
      files = list(filter(isFile, files)) 
      files = [modifyURLDir(x, basepath)  for x in files]
      return jsonify(files)
  else:
      return jsonify([])

@app.route('/api/files/<path:req>/filter/<path:glob>')
def listSelectedFilesInPath(req, glob):
    return listFiles(BASEDIR, req, glob)


@app.route('/api/files/')
@app.route('/api/files/<path:req>')
def getFiles(req=""):
    return listFiles(BASEDIR, req)

@app.route('/admin/shares', methods=['GET'])
def getShares():
    networkshares.reconnect()
    result = json.dumps(networkshares.shares, default = lambda x: x.__dict__)
    print("AdminShares:" + result, flush=True)
    resp = Response(result)
    resp.headers['Content-Type'] = 'application/json'
    return resp


@app.route('/admin/connect/<sharename>')
def connect(sharename):
    result = networkshares.connect(sharename)
    #result = subprocess.run(["/mountshare.sh", data['sharetype'], data['sharepath'] , data['sharename']])
    if result:
        return "0"
    return "1"

@app.route('/admin/disconnect/<mountdir>', methods=['POST'])
def disconnect(mountdir):
    subprocess.run(["/disconnect.sh", mountdir])
    return ""

@app.route('/admin/addnetworkshare', methods=['POST'])
def addnetworkshare():
    data = request.get_json(force=True)
    if data['guest']:        
        result = subprocess.run(["/mountshare.sh", data['sharetype'], data['sharepath'] , data['sharename'],  data["smbver"]])
    else:
        result = subprocess.run(["/mountshare.sh", data['sharetype'], data['sharepath'] , data['sharename'],  data["smbver"] ,data['username'], data['password']])
    
    if result.returncode == 0:
        if data['guest']:
            networkshares.add(data["sharetype"],  data['sharepath'] , data['sharename'], data['guest'],  data["smbver"])
        else:
            networkshares.add(data["sharetype"],  data['sharepath'] , data['sharename'], data['guest'],  data["smbver"], data['username'], data['password'])
    return str(result.returncode)

@app.route('/admin/remove/<name>', methods=['POST'])
def removenetworkshare(name):
    networkshares.remove(name)
    subprocess.run(["/umountshare.sh", name])
    return ""

@app.route('/api/darkmode')
def darkmode():
    if DARKMODE == "true":
        return jsonify(True)
    return jsonify(False)

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

