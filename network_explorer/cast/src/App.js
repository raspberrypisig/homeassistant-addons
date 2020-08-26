import React, {useState, useEffect} from 'react';
import './App.css';
import 'chonky/style/main.css';
import { FileBrowser, FileList, FileSearch, FileToolbar } from 'chonky';


function App() {

const [files, setFiles] = useState([]);
const [folderChain, setFolderChain] = useState([{id: '/', name: 'Network Shares'}]);

useEffect(()=> {
  console.log("effect in affect.");
  fetch('/api/directories').then(response => response.json() ).then(json => {
    let files = [];
    json.map(x => {
      const id = x['full'];
      const name = x['short'];
      files.push({id: id, name: name, isDir: true});
    });
    setFiles(files);
  });
},  [folderChain]);

const handleFileAction = (action, data) => {
  if (action.id === "change_selection") {
    if (data.files[0]  === undefined) return;
    let name,id,isDir;
    ({name, id, isDir} = data.files[0]);
    if (isDir) {
     console.log("Directory selected");
     const newFolderChain = [...folderChain, {id: id, name: name}];
     const newFiles = [{id: '/test/boo.mp3', name: 'boo.mp3'},{id: '/test/enya.mp3', name: 'enya.mp3'}];
 
     setFolderChain(newFolderChain);
     setFiles(newFiles);

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




