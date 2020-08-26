import React, {useState, useEffect} from 'react';
import './App.css';
import 'chonky/style/main.css';
import { FileBrowser, FileList, FileSearch, FileToolbar } from 'chonky';
import { v4 as uuidv4 } from 'uuid';

function App() {

const [files, setFiles] = useState([]);
const [folderChain, setFolderChain] = useState([{id: uuidv4(), name: 'Network Shares'}]);
const [currentfolderchain, SetCurrentFolderChain] = useState([]);

useEffect(()=> {
  fetch('/api/directories').then(response => response.json() ).then(json => {
    let files = [];
    json.map(x => {
      const id = x['full'];
      const name = x['short'];
      files.push({id: id, name: name, isDir: true});
    });
    setFiles(files);
  });
},  []);

const handleFileAction = (action, data) => {
  if (action.id === "change_selection") {
    if (data.files[0]  === undefined) return;
    let name,id,isDir;
    ({name, id, isDir} = data.files[0]);
    if (isDir) {
     console.log("Directory selected");

     fetch('/api/directories/' + name).then(response => response.json() ).then(json => {
      let files = [];
      json.map(x => {
        const id = x['full'];
        const name = x['short'];
        files.push({id: id, name: name, isDir: true});
      });
      const newFolderChain = [{id: uuidv4(), name: 'Network Shares'}, {id: uuidv4(), name: name}];
      setFolderChain(newFolderChain);
      setFiles(files);
    });


    }

    else {
      console.log("File selected");
    }
  }

  else if (action.id === "open_files") {
    console.log(folderChain);
    let newfc = [...folderChain];
    newfc = newfc.splice(0, newfc.length - 1);
    console.log(newfc)
    setFolderChain(newfc);
    setFiles([{id: "/back", name: "back.jpg"}]);
  }

  console.log(action);
  console.log(data);

};


return (
    <div  className="App">
        <FileBrowser files={files} folderChain={folderChain} onFileAction={handleFileAction}>
            <FileToolbar />
            <FileSearch />
            <FileList />
        </FileBrowser>
    </div>
  );
}

export default App;




