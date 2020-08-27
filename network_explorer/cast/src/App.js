import React, {useState, useEffect} from 'react';
import './App.css';
import 'chonky/style/main.css';
import { FileBrowser, FileList, FileSearch, FileToolbar, ChonkyActions } from 'chonky';
import { v4 as uuidv4 } from 'uuid';

let currentPath;

function App() {

const [files, setFiles] = useState([]);
const [folderChain, setFolderChain] = useState([{id: uuidv4(), name: 'Network Shares'}]);

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
},  []);

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

    newFolderChain = [...folderChain, {id: uuidv4(), name: name}];
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
      alert(data.files[0].url);
    }
  }

  else if (action.id === "open_files") {
    currentPath = currentPath.substring(0, currentPath.lastIndexOf("/"));
    console.log(currentPath);
    console.log(folderChain);
    let newfc = [...folderChain];
    newfc = newfc.splice(0, newfc.length - 1);
    console.log(newfc)
    //setFolderChain(newfc);
    //setFiles([{id: "/back", name: "back.jpg"}]);

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


        setFolderChain(newfc);
        setFiles(files);      
      });

    });

  }

  console.log(action);
  console.log(data);

};

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
];

return (
    <div  className="App">
        <FileBrowser files={files} folderChain={folderChain} onFileAction={handleFileAction} disableDefaultFileActions={true} fileActions={fileActions}>
            <FileToolbar />
            <FileSearch />
            <FileList />
        </FileBrowser>
    </div>
  );
}

export default App;



