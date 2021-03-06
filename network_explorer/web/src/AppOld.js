import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import './App.css';

function App() {

  const { register, handleSubmit, control, setValue, watch } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "test"
  });
  const test = watch("test");

  const onSubmit = data => {
    //alert(JSON.stringify(data))
    var networkshare = {Name: data.Name, NetworkPath: data.NetworkPath, NetworkType: data.NetworkType};
    fetch('/admin/addnetworkshare', {
      method: "post", 
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(networkshare)
    }).then(response => response.text()).then(text => {
      console.log(text);
      text === "0"? networkshare['IsConnected'] = "true": networkshare['IsConnected'] = "false" ;
      append(networkshare);
    });


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

        <input name="IsConnected" type="hidden" class="" ref={register} />

        <input type="submit" />
      </form>
      <div>
        <div>
        {
          fields.map((item, index) => {

          return (
          <div>
            <span key={index}>
              {item.Name} {item.NetworkType} {item.NetworkPath}
            </span>
            <span>
              <input class="AppInvisible" name={`test[${index}].circle`} ref={register()} />
              <span class={`AppDot ${(item.IsConnected ===  "false" && test?.[index]?.circle === "")|| test?.[index]?.circle === "false" ?  "AppRedDot": "AppGreenDot"}`}></span>
              <button onClick={()=> {
                fetch('/admin/connect', {
                  method: "post",
                  body: JSON.stringify({Name: `${item.Name}`, NetworkPath: `${item.NetworkPath}`, NetworkType: `${item.NetworkType}`})
                }).then(response => response.text()).then(text=>  {setValue(`test[${index}].circle`, text)});                
               
              }}>Connect</button>
              <button onClick={()=> {
                fetch(`/admin/disconnect/${item.Name}`, {
                  method: "post"
                });
                //console.log(test[index]);
                setValue(`test[${index}].circle`, "false");
              }}>Disconnect</button>
              <button onClick={()=> {
                remove(index);
                fetch(`/admin/remove/${item.Name}`, {
                  method: "post"
                });
              } 
              }>Remove</button>
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
