from pathlib import Path
from flask import Flask, jsonify

app = Flask(__name__)
BASEDIR = "/config/www"
LOCAL="/local"
HOST="0.0.0.0"
PORT=8000

def modifyURL(elem):
    return str(elem).replace(BASEDIR, LOCAL)

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

@app.route('/files/<path:req>/filter/<path:glob>')
def listSelectedFilesInPath(req, glob):
    return listFiles(BASEDIR, req, glob)

@app.route('/files/<path:req>')
def listAllFilesInPath(req):
    return listFiles(BASEDIR, req)

@app.route('/directories/<path:req>')
def listSubdirectories(req):
    return listDir(BASEDIR, req)

@app.route('/')
def default():
    return listDir(BASEDIR, "")

if __name__ == "__main__":
    app.run(host=HOST, port=PORT)

