import React, {useState, useEffect} from 'react';
import { TextField, ListItemText, ListItem, Button, AppBar, Tab,
         Card, CardContent, CardMedia, IconButton, Typography} from '@material-ui/core';
import {SkipNext, SkipPrevious, PlayArrow, Stop, Pause } from '@material-ui/icons';
import { TabPanel, TabContext, TabList } from '@material-ui/lab';
import './App.css';
import 'chonky/style/main.css';
import { FileBrowser, FileList, FileSearch, FileToolbar, ChonkyActions } from 'chonky';
import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select';
import { FixedSizeList } from 'react-window';
import { makeStyles, useTheme } from '@material-ui/core/styles';

let currentPath;

function Playlists() {

  const [createplaylist, SetCreatePlaylist] = useState('');
  const [existingplaylists, SetExistingPlaylists] = useState([]);
  const [currentplaylist, SetCurrentPlaylist] = useState({value: '', label: ''});
  const [selection, SetSelection] = useState(null);
  const [currentplaylistfiles, SetCurrentPlaylistFiles] = useState([]);
  const [tabvalue, SetTabValue] = useState("1");
  

  useEffect(() => {
    
    let playlists; 

    fetch('/playlists/playlists').then(response => response.json()).then(json => {
      console.log(json)
      if (json.length === 0) {
        return;
      }
      playlists = json.map((item) => {
        return {
          value: item,
          label: item
        }
      });
      SetExistingPlaylists(playlists);
      fetch('/playlists/currentplaylist').then(response => response.text()).then(text => {
        if (text === "") {
          console.log("selection about to change: empty");           
          console.log(playlists);          
          SetCurrentPlaylist({value: playlists[0].value, label: playlists[0].value});
        }
        else {
            console.log("selection about to change:");
            SetCurrentPlaylist({value: text, label: text});
          
        }
        console.log(text);
      
      });



    });
  }, []);


  useEffect(() => {
    console.log("use effect:");
    console.log(currentplaylist);
    if (currentplaylist.value === "" || currentplaylist.value === "null") {
      return;
    }
    fetch('/playlists/currentplaylist/' + currentplaylist.value, {
      method: 'post'
    }).then(response => response.text()).then(text => {
      fetch('/playlists/currentplaylist/files').then(response => response.json()).then(json => {
        SetCurrentPlaylistFiles(json);
      });
    });
  }, [currentplaylist]);

  const createPlaylist = ()  => {
     console.log(`Create playlist`);
     console.log(createplaylist);
     fetch(`/playlists/create/${createplaylist}`).then(response => response.text()).then(text => {
       if (text === "True") {
        SetExistingPlaylists([...existingplaylists, {value: createplaylist, label: createplaylist}]);
        SetCurrentPlaylist({value: createplaylist, label: createplaylist});
        SetTabValue("2");
       }
      });

  };

  const deletePlaylist = ()  => {
    fetch('/playlists/currentplaylist/delete').then(response => response.text()).then(text => {
      console.log(text);
      if (text === "") {
         SetCurrentPlaylistFiles([]);
      }
      SetExistingPlaylists(existingplaylists.filter((item)=> item !== currentplaylist));
      SetCurrentPlaylist({value: text, label: text});
    });
  }


  const addSelectionToPlaylist = () => {
    console.log(selection);
    
    fetch('/playlists/addfolder', {
      method: 'post',
      body: JSON.stringify(selection),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json()).then(json => {      
      console.log(json);
      SetCurrentPlaylistFiles(json);
    });
    
  }

  const [files, setFiles] = useState([]);
  const [folderChain, setFolderChain] = useState([{id: uuidv4(), name: 'Network Shares', path: '/'}]);

  
  
  useEffect(()=> {  
    currentPath = "";
    fetch('/api/directories').then(response => response.json() ).then(json => {
      let files = [];
      json.map(x => {
        const name = x['short'];
        files.push({id: uuidv4(), name: name, isDir: true});
      });
      setFiles(files);
    });
  
  
  }, []);

  const handleFileAction = (action, data) => {

    
    if (action.id === "open_files") {
      console.log("OPEN FILES");
      SetSelection(null);
      console.log(data);
      if (data.files[0]  === undefined) return;
      let name,isDir;
      ({name, isDir} = data.files[0]);
      if (isDir) {
        name = decodeURIComponent(decodeURIComponent(name));
        currentPath = currentPath + "/" + name;
        console.log(`Directory selected: ${name}`);
        console.log(`Current Path: ${currentPath}`);
       
        let files = [];
        let newFolderChain;
  
      newFolderChain = [...folderChain, {id: uuidv4(), name: name, path: currentPath}];
      console.log(`Newfolderchain: ${newFolderChain}`);
      //newFolderChain = [{id: uuidv4(), name: 'Network Shares'}, {id: uuidv4(), name: name}];
       
       fetch( '/api/directories' + currentPath).then(response => response.json() ).then(json => {
  
        json.map(x => {
          const url = x['full'];
          const name = x['short'];
          files.push({id: uuidv4(), name: name, isDir: true, url: url});
        });
  
  
        fetch('/api/files' + currentPath).then(response => response.json()).then(json => {
          json.map(x => {
            const url = x['full'];
            const name = x['short'];
            files.push({id: uuidv4(), name: name, url: url});
          });         
  
  
          setFolderChain(newFolderChain);
          setFiles(files);      
        });
  
      });
  
  
      }
  
      else {
        const targetid = data.target.id;
        console.log(targetid);
        console.log(data);
        console.log(folderChain);
        ({name, isDir} = data.files[0]);
        const index = folderChain.findIndex(x => x.id === targetid);
        if (index === -1) {
          return;
        }
        console.log(index);
        currentPath = folderChain[index].path;
        if (currentPath === "/") {
          currentPath = "";
        }
        console.log(currentPath);
        const newFolderChain = folderChain.slice(0, index + 1);
        console.log(newFolderChain);
           
       let files = [];
     
         fetch( '/api/directories' + currentPath).then(response => response.json() ).then(json => {
     
           json.map(x => {
             const url = x['full'];
             const name = x['short'];
             files.push({id: uuidv4(), name: name, isDir: true, url: url});
           });
     
     
           if (currentPath === "") {
             setFolderChain(newFolderChain);
             setFiles(files);  
             return;        
           }
     
           fetch('/api/files' + currentPath).then(response => response.json()).then(json => {
             json.map(x => {
               const url = x['full'];
               const name = x['short'];
               files.push({id: uuidv4(), name: name, url: url});
             });         
             
     
             setFolderChain(newFolderChain);
             setFiles(files);      
           });
          
     
         });
  
      }


    }
  
    //else if (action.id === "open_files") {
    else if (action.id === "change_selection") {
      if (data.files.length > 0) {
        console.log("CHANGE SELECTED");
        SetSelection(data.files);
      }
    }

    console.log(action);
    console.log(data);
  
  };

  const fileActions = [
    ChonkyActions.ChangeSelection,
    ChonkyActions.OpenParentFolder,
    {
      id: ChonkyActions.OpenFiles.id
    },
    ChonkyActions.ToggleSearch,
    ChonkyActions.SortFilesByName,
    ChonkyActions.SortFilesBySize,
    ChonkyActions.SortFilesByDate,
    ChonkyActions.ToggleShowFoldersFirst
  ];

  function baseName(str)
  {
     var base = str.substring(str.lastIndexOf('/') + 1); 
      //if(base.lastIndexOf(".") != -1)       
      //    base = base.substring(0, base.lastIndexOf("."));
     return base;
  }

  function renderRow(props) {
    const { index, style } = props;
  
    return (
      <ListItem button style={style} key={index}>
        <ListItemText primary={baseName(currentplaylistfiles[index])} />
      </ListItem>
    );
  }

 const handleTabChange = (event, newValue) => {
   console.log(newValue);
   console.log(event);
   SetTabValue(newValue);
 };

 const clearPlaylist = () => {
   console.log("clear playlist");
   fetch('/playlists/currentplaylist/clear');
   SetCurrentPlaylistFiles([]);
 };

 const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));

const classes = useStyles();
const theme = useTheme();

  return (
    <div  className="App" style={{backgroundColor: "#f5f5f5"}}>
      <h2>Playlists Page</h2>
 
      <h2>Current Playlist</h2>
      <Select name="existingplaylists" value={currentplaylist} onChange={SetCurrentPlaylist} options={existingplaylists}/>                
      <p>&nbsp;</p>
      <Button variant="contained" color="secondary" onClick={deletePlaylist}>DELETE PLAYLIST</Button>
      <p>&nbsp;</p>
      <TabContext value={tabvalue} >
      <AppBar position="static"> 
        <TabList onChange={handleTabChange} aria-label="Playlists">
          <Tab label="Create Playlist" value="1" />
          <Tab label="Add To Playlist"  value="2" />
          <Tab label="View Playlist" value="3" />
          <Tab label="Now Playing" value="4" />
        </TabList>
      </AppBar>


      <TabPanel value="1">
      <p>
        <h2>Create Playlist</h2>
        <TextField name="createplaylist" label="Create Playlist" variant="outlined" onChange={(event) => SetCreatePlaylist(event.target.value)} /> 
        <p><Button variant="contained" color="primary" onClick={createPlaylist}>CREATE PLAYLIST</Button></p>
      </p>
      </TabPanel>
      <TabPanel value="2">
      <p>
      <h2>Add Folder to Playlist</h2>
        <p>1. Choose folders from below</p>
        <p>2. Single click to select, double-click to open folder </p>
        <p>3. You can select multiple folders at once using shift or ctrl key</p>
        <p>4. Add selection to playlist. You can do this multiple times. </p>        
      </p>      
      <p>CURRENT PLAYLIST: {currentplaylist != null ? currentplaylist.value : "" }</p>
      <p>PLAYLIST ITEMS COUNT: {currentplaylistfiles.length} </p>
      <p><Button variant="contained" color="primary" onClick={addSelectionToPlaylist}>ADD SELECTION TO PLAYLIST</Button></p>
      <FileBrowser files={files} folderChain={folderChain} onFileAction={handleFileAction} disableDefaultFileActions={true} fileActions={fileActions}>
      <FileToolbar />
      <FileSearch />
      <FileList />
      </FileBrowser> 

      </TabPanel>
      <TabPanel value="3">
      <p>
        <h2 id="viewplaylist">Current Playlist</h2>
        <p><Button variant="contained" color="secondary" onClick={clearPlaylist}>CLEAR PLAYLIST</Button></p>
        <FixedSizeList height={400} width={800} itemSize={46} itemCount={currentplaylistfiles.length}>
        {renderRow}
      </FixedSizeList>
      </p>        
      </TabPanel>      
      <TabPanel value="4">
      <Card className={classes.root}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5">
          {currentplaylist != null ? currentplaylist.value : "" }
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Playing:
          </Typography>
        </CardContent>
        <div className={classes.controls}>
          <IconButton aria-label="previous">
            {theme.direction === 'rtl' ? <SkipNext /> : <SkipPrevious />}
          </IconButton>
          <IconButton aria-label="play/pause">
            <PlayArrow className={classes.playIcon} />
          </IconButton>
          <IconButton aria-label="stop">
            <Stop className={classes.playIcon} />
          </IconButton>
          <IconButton aria-label="pause">
            <Pause className={classes.playIcon} />
          </IconButton>
          <IconButton aria-label="next">
            {theme.direction === 'rtl' ? <SkipPrevious /> : <SkipNext />}
          </IconButton>
        </div>
      </div>
      <CardMedia
        className={classes.cover}
        image="/static/images/cards/live-from-space.jpg"
        title="Live from space album cover"
      />
    </Card>
      </TabPanel>
      </TabContext>

      



    

      

    </div>
  );
}

export default Playlists;