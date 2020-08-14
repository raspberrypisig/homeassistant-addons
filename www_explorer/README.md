# WWW Folder Explorer Home Assistant Addon

This addon allows you to explore the files and folders in /config, /share,/backup using a) web server directory listings and b) HTTP requests. 

Uses port 8000 by default, but this is configurable.


### Example File and Folder Layout
<pre>
/config/www
|--- Music/
|    |--- Snoop Dogg/
|         |--- 1.mp3
|         |--- 2.mp3
|         |--- Cool Ringtone.m4a
|    |--- Roxette/
|         |--- 1980hits.txt
|         |--- boo.wav
</pre>


# Syntax

### File browsing

```text
http://<HOME_ASSISTANT_IP>:8000
```


### Directories under a subdiretory

```text
http://<HOME_ASSISTANT_IP>:8000/directories/config/www/Music
```

The example layout would return **["Snoop Dogg", "Roxette"]**

### Files under a subdirectory

```text
http://<HOME_ASSISTANT_IP>:8000/files/config/wwww/Music/Roxette
```

The example layout would return **["1980hits.txt", "boo.wav"]**

### Filter files under a directory

```text
http://HOME_ASSISTANT_IP>:8000/files/config/www/Music/Snoop Dogg/filter/*.mp3
```

The example layout would return **["1.mp3", "2.mp3", "3.mp3"]**

### Experimenting with glob

```text
http://HOME_ASSISTANT_IP>:8000/files/Music/filter/**/*.wav
```

The example layout would return **["/config/www/Music/Roxette/boo.wav"]**







