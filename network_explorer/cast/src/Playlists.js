import React, {useState, useEffect} from 'react';
import { TextField, ListItemText, ListItem } from '@material-ui/core';
import './App.css';
import 'chonky/style/main.css';
import { FileBrowser, FileList, FileSearch, FileToolbar, ChonkyActions } from 'chonky';
import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select';
import { FixedSizeList } from 'react-window';

let currentPath;

function Playlists() {

  const [createplaylist, SetCreatePlaylist] = useState('');
  const [existingplaylists, SetExistingPlaylists] = useState([]);
  const [currentplaylist, SetCurrentPlaylist] = useState('');
  const [selection, SetSelection] = useState(null);
  const [currentplaylistfiles, SetCurrentPlaylistFiles] = useState([]);

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
    if (currentplaylist === "" || currentplaylist == "null") {
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
       }
      });

  };

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
     var base = new String(str).substring(str.lastIndexOf('/') + 1); 
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

  return (
    <div  className="App">
      <h2>Playlists Page</h2>
      <p>
        <h2>Create Playlist</h2>
        <TextField name="createplaylist" label="Create Playlist" variant="outlined" onChange={(event) => SetCreatePlaylist(event.target.value)} /> <p><button onClick={createPlaylist}>CREATE PLAYLIST</button></p>
      </p>
      <p>
        <h2>OR Select Existing Playlist</h2>
        
        <Select name="existingplaylists" value={currentplaylist} onChange={SetCurrentPlaylist} options={existingplaylists}/>                
        
      </p>
      <p>
        <h2>Add Folder to Playlist</h2>
        <p>1. Choose folders from below</p>
        <p>2. Single click to select, double-click to open folder </p>
        <p>3. You can select multiple folders at once using shift or ctrl key</p>
        <p>4. Add selection to playlist. You can do this multiple times. </p>
      <p>CURRENT PLAYLIST: {currentplaylist != null ? currentplaylist.value : "" }</p>
  <p>PLAYLIST ITEMS COUNT: {currentplaylistfiles.length} </p>
        <p><a href="#viewplaylist">View Playlist</a></p>
        <p><button onClick={addSelectionToPlaylist}>ADD SELECTION TO PLAYLIST</button></p>

        <FileBrowser files={files} folderChain={folderChain} onFileAction={handleFileAction} disableDefaultFileActions={true} fileActions={fileActions}>
            <FileToolbar />
            <FileSearch />
            <FileList />
        </FileBrowser>     

      </p>
      <p>
        <h2 id="viewplaylist">Current Playlist</h2>
        <FixedSizeList height={400} width={800} itemSize={46} itemCount={currentplaylistfiles.length}>
        {renderRow}
      </FixedSizeList>
      </p>
    </div>
  );
}

export default Playlists;