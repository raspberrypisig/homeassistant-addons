from pathlib import Path
from flask import Flask, jsonify, request, Response
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
BASEDIR = "."
HOST="0.0.0.0"
PORT=8000

whitelist=["addons","config","share","backup", "ssl"]

def _proxy(*args, **kwargs):
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

def modifyURL(elem):
    args = request.args.to_dict()
    if 'out' in args:
        return str(elem)
    else:
        return elem.name

def modifyURLDir(elem):
    return elem.name

def isFile(elem):
    if elem.is_file():
        return True
    else:
        return False

def listFiles(basedir, requestedPath, glob="*"):
    p = Path(basedir).joinpath(requestedPath)
    if p.is_dir():
        files = list(p.glob(glob))
        files = list(filter(isFile, files))      
        files = list(map(modifyURL, files))
        return jsonify(files)
    else:
        return jsonify([])

def listDir(basedir, requestedPath):
  p = Path(basedir).joinpath(requestedPath)
  if p.is_dir():
      directories =  [modifyURLDir(x) for x in p.iterdir() if x.is_dir()]
      return jsonify(directories)
  else:
      return jsonify([])

@app.route('/api/files/<path:req>/filter/<path:glob>')
def listSelectedFilesInPath(req, glob):
    return listFiles(BASEDIR, req, glob)

@app.route('/api/files/<path:req>')
def listAllFilesInPath(req):
    return listFiles(BASEDIR, req)

@app.route('/api/directories/<path:req>')
def listSubdirectories(req='/'):
    return listDir(BASEDIR, req)


@app.route('/')
def index():
    r = requests.get('http://localhost')
    soup = BeautifulSoup(r.text, "html.parser")
    for s in soup.find_all('li'):
        a = s.find('a')
        href = a['href']
        href = href[:-1]
        if href  not in whitelist:
            s.decompose()
    return str(soup)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def default(path):
    return _proxy()
    

if __name__ == "__main__":
    app.run(host=HOST, port=PORT)

