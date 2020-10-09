from flask import Flask, request, Response, send_from_directory, send_file, jsonify, Blueprint
import requests
import sys
import os
import subprocess
import json
from pathlib import Path
from urllib.parse import urlparse

castroutes = Blueprint('castroutes', __name__)

class MediaPlayer:

    def __init__(self, pm, mediaplayer):
        self.playlistmanager = pm
        self.currentTrack = ''
        self.mediaplayer = mediaplayer

    def shouldPlayNextTrack(self):
        pass

    def isUnderControl(self):
        pass

    def mediaPlayers(self):
        supervisor_token = os.environ['SUPERVISOR_TOKEN']
        r = requests.get('http://supervisor/core/api/states', 
        headers={
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + supervisor_token
        })        
        rjson = r.json()
        mediaplayers = [x for x in rjson if x['entity_id'] == self.mediaplayer]
        return mediaplayers

    def castMusic(self, url, entityid):
        basedir = os.environ['BASEDIR']
        filepath = _getFilePath(url, basedir)
        fileformat = subprocess.run(["/fileformat.sh", filepath ], capture_output=True)
        mediacontenttype = fileformat.stdout.decode("utf-8")


        print(url, flush=True)
        print(entityid, flush=True)
        print(mediacontenttype, flush=True)

        supervisor_token = os.environ['SUPERVISOR_TOKEN']
        requests.post('http://supervisor/core/api/services/media_player/play_media', 
        json={
            "entity_id": entityid,
            "media_content_id": url,
            "media_content_type": mediacontenttype
        },
        headers={
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + supervisor_token
        })
    

    def play(self, host):
        #players = self.mediaPlayers()
        print("----")
        #print(players, flush=True)            
        items = self.playlistmanager.currentPlaylistItems()
        playitem = items[0]
        playitemurl = host + playitem
        print(self.mediaplayer, flush=True)
        print(playitem, flush=True)
        print(playitemurl, flush=True)
        self.castMusic(playitemurl, self.mediaplayer)
        return jsonify(0)


    def stop(self):
        pass

    def pause(self):
        pass

    def next(self):
        pass

    def previous(self):
        pass


class PlayListsManager:
    DATADIRECTORY = "/data/"
    CURRENTPLAYLIST = "currentplaylist.txt"
    CURRENTPLAYLISTURI = "/data/currentplaylist.txt"
    DEFAULTPLAYER = '/data/defaultplayer'

    def __init__(self):
        self.currentPlaylist = ''
        self.playlists = []
        self.load()
    
    def load(self):
        self.loadCurrentPlaylist()
        self.loadPlaylists()

    def loadCurrentPlaylist(self):
        if Path(PlayListsManager.CURRENTPLAYLISTURI).stat().st_size > 0 :
            with open(PlayListsManager.CURRENTPLAYLISTURI, "r") as f:
                self.currentPlaylist = f.read()
                if self.currentPlaylist is None:
                    self.currentPlaylist = ''
        print("currentPlaylist:" + self.currentPlaylist, flush=True)

    def loadPlaylists(self):
        p = list(Path(PlayListsManager.DATADIRECTORY).glob("*.txt"))
        if len(p) > 0:
            self.playlists = [str(x)[len(PlayListsManager.DATADIRECTORY):] for x in p]
            self.playlists.remove(PlayListsManager.CURRENTPLAYLIST)
            self.playlists = [x[:-len('.txt')] for x in self.playlists]

    def setCurrentPlaylist(self, playlist):
        print("setcurrentplaylist:" + playlist)
        if playlist is None:
            pl = ''
        else:
            pl = playlist

        with open(PlayListsManager.CURRENTPLAYLISTURI, 'w') as f:
            f.write(pl)

    def clearCurrentPlaylist(self):
        with open(PlayListsManager.DATADIRECTORY + self.currentPlaylist + ".txt", "w") as f:
            f.truncate()
            f.write("[]")

    def deleteCurrentPlaylist(self):
        Path(PlayListsManager.DATADIRECTORY + self.currentPlaylist + ".txt").unlink()
        self.playlists.remove(self.currentPlaylist)
        if len(self.playlists) > 0 :
            self.currentPlaylist = self.playlists[0]
        else:
            self.currentPlaylist = ""
        self.setCurrentPlaylist(self.currentPlaylist)


    def addFolder(self, newentries):
        print(newentries, flush=True)
        print(self.currentPlaylist, flush=True)
        items = self.currentPlaylistItems()
        with open(PlayListsManager.DATADIRECTORY + self.currentPlaylist + ".txt", "w") as f:
            f.write(json.dumps(newentries + items))
        return newentries + items

    def currentPlaylistItems(self):
        items = []
        with open(PlayListsManager.DATADIRECTORY + self.currentPlaylist + ".txt", "r") as f:
            items = json.loads(f.read())
        return items

@castroutes.route('/cast/favicon.ico')
def favicon():
    return send_file("/html/favicon.ico")

def _getFilePath(url, basedir):
    return basedir + urlparse(url).path

def haplayersfull():
    supervisor_token = os.environ['SUPERVISOR_TOKEN']
    r = requests.get('http://supervisor/core/api/states', 
        headers={
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + supervisor_token
        }        
    )
    rjson = r.json()
    mediaplayers = [{'entity_id': x['entity_id'], 'name': x['attributes']['friendly_name']} for x in rjson if x['entity_id'].startswith("media_player.")]
    return mediaplayers

@castroutes.route('/api/defaultplayer')
def getDefaultPlayer():
    defaultplayer = None
    with open(PlayListsManager.DEFAULTPLAYER, 'r') as f:
        defaultplayer = f.read()
    return defaultplayer

@castroutes.route('/api/defaultplayer/<defaultplayer>')
def players(defaultplayer):
    mediaplayers = haplayersfull()
    player = [x['entity_id'] for x in mediaplayers if x['name'] == defaultplayer]
    with open(PlayListsManager.DEFAULTPLAYER, 'w') as f:
        f.write(player[0])
    return ""

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
   
    return r.text

@castroutes.route('/playlists/create/<playlist>')
def createPlaylist(playlist):
    playlistFile = f'{PlayListsManager.DATADIRECTORY}{playlist}.txt'
    isFileExists = Path(playlistFile).is_file()
    if isFileExists:
        return str(False)
    f = open(playlistFile, 'w')
    f.write("[]")
    f.close()
    return str(True)

@castroutes.route('/playlists/addfolder', methods=['POST'])
def addFolder():
    selectedFiles = request.get_json(force=True)
    basedir = os.environ['BASEDIR']
    playlistsManager = PlayListsManager()
    currentPlaylist = []

    for f in selectedFiles:
        if f['isDir']:
            url = f['url']
            filepath = _getFilePath(url, basedir)
            newplaylist = Path(filepath).rglob("*.*")
            newplaylist = [str(x)[len(basedir):] for x in newplaylist]
            currentPlaylist = list(set().union(currentPlaylist + newplaylist))
            currentPlaylist = playlistsManager.addFolder(currentPlaylist)
        else:
            pass

    return jsonify(currentPlaylist)

@castroutes.route('/playlists/currentplaylist/<newplaylist>', methods=['POST'])
def setCurrentPlaylist(newplaylist):
     playlistManager = PlayListsManager()
     playlistManager.setCurrentPlaylist(newplaylist)
     return ""


@castroutes.route('/playlists/currentplaylist/clear')
def clearCurrentPlaylist():
    playlistManager = PlayListsManager()    
    playlistManager.clearCurrentPlaylist()

@castroutes.route('/playlists/currentplaylist')
def currentPlaylist():
    playlistManager = PlayListsManager()
    currentPlaylist = playlistManager.currentPlaylist
    return currentPlaylist

@castroutes.route('/playlists/currentplaylist/files')
def currentPlaylistItems():
    playlistManager = PlayListsManager()
    return jsonify(playlistManager.currentPlaylistItems())

@castroutes.route('/playlists/currentplaylist/delete')
def deleteCurrentPlaylist():
    playlistManager = PlayListsManager()
    playlistManager.deleteCurrentPlaylist()
    return playlistManager.currentPlaylist

@castroutes.route('/playlists/playlists')
def playlists():
    playlistManager = PlayListsManager()
    return jsonify(playlistManager.playlists)


@castroutes.route('/playlists/mediaplayer/<player>/<action>')
def mediaplayer(player, action):
    #print(player, flush=True)
    #print(action, flush=True)    
    host = request.host_url[:-1]
    print(host)
    playlistManager = PlayListsManager()
    mp = MediaPlayer(playlistManager, player)
    if action == "play":
        return mp.play(host)

    return jsonify(-1)

@castroutes.route('/playlists')
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

    

