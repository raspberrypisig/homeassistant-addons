(this.webpackJsonphanetworkmanager=this.webpackJsonphanetworkmanager||[]).push([[0],{13:function(e,t,n){},15:function(e,t,n){},16:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),l=n(7),r=n.n(l),c=(n(13),n(2)),m=n(5);n(15);var i=function(){var e=Object(m.b)(),t=e.register,n=e.handleSubmit,l=e.control,r=Object(a.useState)(""),i=Object(c.a)(r,2),u=i[0],s=i[1],p=Object(m.a)({control:l,name:"test"}),E=p.fields,h=p.append,w=p.remove;return Object(a.useEffect)((function(){console.log(window.location.hostname),fetch("https://randomuser.me/api/").then((function(e){return e.json()})).then((function(e){s(window.location.protocol+"//"+window.location.hostname+":8002")}))}),[]),o.a.createElement("div",{className:"App"},o.a.createElement("div",null,"Network browser URL: ",o.a.createElement("a",{href:u,target:"_blank"},u)),o.a.createElement("h1",null,"Add Network Share"),o.a.createElement("form",{onSubmit:n((function(e){h({Name:e.Name,NetworkPath:e.NetworkPath,NetworkType:e.NetworkType})}))},o.a.createElement("div",null,o.a.createElement("label",{htmlFor:"Name"},"Name"),o.a.createElement("input",{name:"Name",placeholder:"eg. Music",ref:t})),o.a.createElement("div",null,o.a.createElement("label",{htmlFor:"NetworkPath"},"Network Path"),o.a.createElement("input",{name:"NetworkPath",placeholder:"eg. //192.168.20.99/Music",ref:t})),o.a.createElement("div",null,o.a.createElement("label",{htmlFor:"NetworkType"},"Network Share Type"),o.a.createElement("select",{ref:t,name:"NetworkType"},o.a.createElement("option",{value:"cifs"},"Windows Share"))),o.a.createElement("input",{type:"submit"})),o.a.createElement("div",null,o.a.createElement("div",null,E.map((function(e,t){return console.log(e),console.log(t),o.a.createElement("div",null,o.a.createElement("span",{key:t},e.Name," ",e.NetworkType," ",e.NetworkPath),o.a.createElement("span",null,o.a.createElement("span",{class:"dot"}),o.a.createElement("button",{onClick:function(){console.log(t)}},"Connect"),o.a.createElement("button",{onClick:function(){console.log(t)}},"Disconnect"),o.a.createElement("button",{onClick:function(){return w(t)}},"Remove")))})))))};r.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(i,null)),document.getElementById("root"))},8:function(e,t,n){e.exports=n(16)}},[[8,1,2]]]);
//# sourceMappingURL=main.3e5d75af.chunk.js.map