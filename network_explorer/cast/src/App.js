import React, {useState, useEffect} from 'react';
import './App.css';
import 'chonky/style/main.css';
import { FileBrowser, FileList, FileSearch, FileToolbar, ChonkyActions } from 'chonky';
import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select';

let currentPath;

let playerOptions = [];

function App() {

const [files, setFiles] = useState([]);
const [folderChain, setFolderChain] = useState([{id: uuidv4(), name: 'Network Shares', path: '/'}]);
const [player, setPlayer] = useState(null);


useEffect(()=> {
  fetch('/ha/players').then(request => request.json()).then(json => {
    playerOptions = json.map(x=> {return {value: x, label: x}});
    if (playerOptions.length > 0) {
      console.log(json[0]);
      setPlayer({value: json[0], label: json[0]});
    }
    
  });

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
  if (action.id === "change_selection") {
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

      console.log("File selected");
      alert(`${data.files[0].url}`);
      alert(`Selected Media player: ${player['value']}`)
      fetch('/ha/cast', {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
        "player_entity_id": player['value'],
         "url": data.files[0].url
        })
       }).then(response=>response.text()).then(text=>null);
    

    }
  }

  else if (action.id === "open_files") {
   const targetid = data.target.id;
   console.log(targetid);
   const index = folderChain.findIndex(x => x.id === targetid);
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

  console.log(action);
  console.log(data);

};


/*
const fileActions = [
  {
      id: ChonkyActions.OpenFiles.id,
  },
  {
      id: ChonkyActions.ChangeSelection.id 
  },
  {
      id: ChonkyActions.OpenParentFolder.id,
      requiresSelection: false
  },
  {
    id: ChonkyActions.ToggleShowFoldersFirst.id
  },
  {
    id: ChonkyActions.ToggleSearch.id,
    
  }
];
*/

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

return (
    <div  className="App">
        <h2>Choose Media Player</h2>
        { player != null &&
        <Select
        defaultValue={player}
        onChange={setPlayer}
        options={playerOptions}
        />
        }
        <h2>Choose Music To Play</h2>

        <FileBrowser files={files} folderChain={folderChain} onFileAction={handleFileAction} disableDefaultFileActions={true} fileActions={fileActions}>
            <FileToolbar />
            <FileSearch />
            <FileList />
        </FileBrowser>
    </div>
  );
}

export default App;




