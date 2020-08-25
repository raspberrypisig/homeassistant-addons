# Network Explorer Home Assistant Addon

This addon allows you to browse network shares inside Home Assistant via HTTP web requests. 

In addition, there is a lightweight API.

Uses port 8002 by default, but this is configurable.


### Example File and Folder Layout
<pre>
|--- Music/
|    |--- Snoop Dogg/
|         |--- 1.mp3
|         |--- 2.mp3
|         |--- Cool Ringtone.m4a
|    |--- Roxette/
|         |--- 1980hits.txt
|         |--- joyride.mp3
|         |--- thelook.mp3
</pre>
This is an example to give idea of how API works in addition to the Explorer.

In the Admin section, added a share with the following details:

Share Name is called My Music (can call it whatever you like)

Network Location is //192.168.1.99/NAS

# Syntax

### File browsing

```text
http://<HOME_ASSISTANT_IP>:8002
```

 

### Directories under a subdiretory

```text
http://<HOME_ASSISTANT_IP>:8002/api/directories/My Music/Music
```

The example layout would return **["Snoop Dogg", "Roxette"]**

### Files under a subdirectory

```text
http://<HOME_ASSISTANT_IP>:8000/api/files/My Music/Music/Roxette
```

The example layout would return **["1980hits.txt", "joyride.mp3", "thelook.mp3"]**








