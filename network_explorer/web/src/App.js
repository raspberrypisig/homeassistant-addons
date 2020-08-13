import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import './App.css';

function App() {

  const { register, handleSubmit, control } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "test"
  });
  const onSubmit = data => {
    //alert(JSON.stringify(data));
    var networkshare = {Name: data.Name, NetworkPath: data.NetworkPath, NetworkType: data.NetworkType};
    fetch('/admin/addnetworkshare', {
      method: "post", 
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(networkshare)
    }).then(request => request.body).then(data => console.log(data));

    append(networkshare);
  };

  return (
    <div className="App">
      <h1>Add Network Share</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="Name">Name</label>
          <input name="Name" placeholder="eg. Music" ref={register} />
        </div>

        <div>
          <label htmlFor="NetworkPath">Network Path</label>
          <input name="NetworkPath" placeholder="eg. //192.168.20.99/Music" ref={register} />
        </div>


        <div>
          <label htmlFor="NetworkType">Network Share Type</label>
          <select ref={register} name="NetworkType">
            <option value="cifs">Windows Share</option>
          </select>      
        </div>
        <input type="submit" />
      </form>
      <div>
        <div>
        {
          fields.map((item, index) => {

          console.log(item)
          console.log(index)
          return (
          <div>
            <span key={index}>
              {item.Name} {item.NetworkType} {item.NetworkPath}
            </span>
            <span>
              <span class="dot"/>
              <button onClick={()=> {console.log(index)}}>Connect</button>
              <button onClick={()=> {console.log(index)}}>Disconnect</button>
              <button onClick={()=> remove(index)}>Remove</button>
            </span>
          </div>)
        })
        }
        </div>
      </div>
    </div>
  );
}

export default App;
