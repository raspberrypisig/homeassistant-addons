(this.webpackJsonpcast=this.webpackJsonpcast||[]).push([[0],{118:function(e,t,n){},182:function(e,t,n){e.exports=n(391)},187:function(e,t,n){},391:function(e,t,n){"use strict";n.r(t);var a,l=n(0),o=n.n(l),c=n(10),i=n.n(c),r=(n(187),n(171)),s=n(7),u=n(70),f=n(23),h=(n(118),n(119),n(12)),m=n(448),p=n(88),d=[];var E,g=function(){var e=Object(l.useState)([]),t=Object(f.a)(e,2),n=t[0],c=t[1],i=Object(l.useState)([{id:Object(m.a)(),name:"Network Shares",path:"/"}]),r=Object(f.a)(i,2),s=r[0],E=r[1],g=Object(l.useState)(null),y=Object(f.a)(g,2),v=y[0],b=y[1];Object(l.useEffect)((function(){fetch("/ha/players").then((function(e){return e.json()})).then((function(e){(d=e.map((function(e){return{value:e,label:e}}))).length>0&&(console.log(e[0]),b({value:e[0],label:e[0]}))})),a="",fetch("/api/directories").then((function(e){return e.json()})).then((function(e){var t=[];e.map((function(e){var n=e.short;t.push({id:Object(m.a)(),name:n,isDir:!0})})),c(t)}))}),[]);var j=[h.ChonkyActions.ChangeSelection,h.ChonkyActions.OpenParentFolder,{id:h.ChonkyActions.OpenFiles.id},h.ChonkyActions.ToggleSearch,h.ChonkyActions.SortFilesByName,h.ChonkyActions.SortFilesBySize,h.ChonkyActions.SortFilesByDate,h.ChonkyActions.ToggleShowFoldersFirst];return o.a.createElement("div",{className:"App"},o.a.createElement("h2",null,"Choose Media Player"),null!=v&&o.a.createElement(p.a,{defaultValue:v,onChange:b,options:d}),o.a.createElement("h2",null,"Choose Music To Play (or select ",o.a.createElement("a",{href:"/playlists"},"Playlists"),")"),o.a.createElement(h.FileBrowser,{files:n,folderChain:s,onFileAction:function(e,t){if("change_selection"===e.id){if(void 0===t.files[0])return;var n,l=t.files[0];if(n=l.name,l.isDir){n=decodeURIComponent(decodeURIComponent(n)),a=a+"/"+n,console.log("Directory selected: ".concat(n)),console.log("Current Path: ".concat(a));var o,i=[];o=[].concat(Object(u.a)(s),[{id:Object(m.a)(),name:n,path:a}]),console.log("Newfolderchain: ".concat(o)),fetch("/api/directories"+a).then((function(e){return e.json()})).then((function(e){e.map((function(e){var t=e.full,n=e.short;i.push({id:Object(m.a)(),name:n,isDir:!0,url:t})})),fetch("/api/files"+a).then((function(e){return e.json()})).then((function(e){e.map((function(e){var t=e.full,n=e.short;i.push({id:Object(m.a)(),name:n,url:t})})),E(o),c(i)}))}))}else console.log("File selected"),console.log("".concat(t.files[0].url)),console.log("Selected Media player: ".concat(v.value)),fetch("/ha/cast",{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify({player_entity_id:v.value,url:t.files[0].url})}).then((function(e){return e.text()})).then((function(e){return null}))}else if("open_files"===e.id){var r=t.target.id;console.log(r);var f=s.findIndex((function(e){return e.id===r}));if(-1===f)return;console.log(f),"/"===(a=s[f].path)&&(a=""),console.log(a);var h=s.slice(0,f+1);console.log(h);var p=[];fetch("/api/directories"+a).then((function(e){return e.json()})).then((function(e){if(e.map((function(e){var t=e.full,n=e.short;p.push({id:Object(m.a)(),name:n,isDir:!0,url:t})})),""===a)return E(h),void c(p);fetch("/api/files"+a).then((function(e){return e.json()})).then((function(e){e.map((function(e){var t=e.full,n=e.short;p.push({id:Object(m.a)(),name:n,url:t})})),E(h),c(p)}))}))}console.log(e),console.log(t)},disableDefaultFileActions:!0,fileActions:j},o.a.createElement(h.FileToolbar,null),o.a.createElement(h.FileSearch,null),o.a.createElement(h.FileList,null)))},y=n(427),v=n(431),b=n(433),j=n(434),O=n(435),C=n(446),S=n(437),A=n(438),k=n(91),F=n(439),P=n(445),T=n(440),N=n(441),w=n(442),I=n(443),L=n(444),D=n(113),x=n(447),B=n(436),R=n(167),Y=n(432),U=n(42);var _=function(){var e=Object(l.useState)(""),t=Object(f.a)(e,2),n=t[0],a=t[1],c=Object(l.useState)([]),i=Object(f.a)(c,2),r=i[0],s=i[1],d=Object(l.useState)({value:"",label:""}),g=Object(f.a)(d,2),_=g[0],M=g[1],J=Object(l.useState)(null),z=Object(f.a)(J,2),V=z[0],W=z[1],G=Object(l.useState)([]),H=Object(f.a)(G,2),$=H[0],q=H[1],K=Object(l.useState)("1"),Q=Object(f.a)(K,2),X=Q[0],Z=Q[1];Object(l.useEffect)((function(){var e;fetch("/playlists/playlists").then((function(e){return e.json()})).then((function(t){console.log(t),0!==t.length&&(e=t.map((function(e){return{value:e,label:e}})),s(e),fetch("/playlists/currentplaylist").then((function(e){return e.text()})).then((function(t){""===t?(console.log("selection about to change: empty"),console.log(e),M({value:e[0].value,label:e[0].value})):(console.log("selection about to change:"),M({value:t,label:t})),console.log(t)})))}))}),[]),Object(l.useEffect)((function(){console.log("use effect:"),console.log(_),""!==_.value&&"null"!==_.value&&fetch("/playlists/currentplaylist/"+_.value,{method:"post"}).then((function(e){return e.text()})).then((function(e){fetch("/playlists/currentplaylist/files").then((function(e){return e.json()})).then((function(e){q(e)}))}))}),[_]);var ee=Object(l.useState)([]),te=Object(f.a)(ee,2),ne=te[0],ae=te[1],le=Object(l.useState)([{id:Object(m.a)(),name:"Network Shares",path:"/"}]),oe=Object(f.a)(le,2),ce=oe[0],ie=oe[1];Object(l.useEffect)((function(){E="",fetch("/api/directories").then((function(e){return e.json()})).then((function(e){var t=[];e.map((function(e){var n=e.short;t.push({id:Object(m.a)(),name:n,isDir:!0})})),ae(t)}))}),[]);var re=[h.ChonkyActions.ChangeSelection,h.ChonkyActions.OpenParentFolder,{id:h.ChonkyActions.OpenFiles.id},h.ChonkyActions.ToggleSearch,h.ChonkyActions.SortFilesByName,h.ChonkyActions.SortFilesBySize,h.ChonkyActions.SortFilesByDate,h.ChonkyActions.ToggleShowFoldersFirst];function se(e){var t,n=e.index,a=e.style;return o.a.createElement(y.a,{button:!0,style:a,key:n},o.a.createElement(v.a,{primary:(t=$[n],t.substring(t.lastIndexOf("/")+1))}))}var ue=Object(Y.a)((function(e){return{root:{display:"flex"},details:{display:"flex",flexDirection:"column"},content:{flex:"1 0 auto"},cover:{width:151},controls:{display:"flex",alignItems:"center",paddingLeft:e.spacing(1),paddingBottom:e.spacing(1)},playIcon:{height:38,width:38}}}))(),fe=Object(U.a)();return o.a.createElement("div",{className:"App",style:{backgroundColor:"#f5f5f5"}},o.a.createElement("h2",null,"Playlists Page"),o.a.createElement("h2",null,"Current Playlist"),o.a.createElement(p.a,{name:"existingplaylists",value:_,onChange:M,options:r}),o.a.createElement("p",null,"\xa0"),o.a.createElement(b.a,{variant:"contained",color:"secondary",onClick:function(){fetch("/playlists/currentplaylist/delete").then((function(e){return e.text()})).then((function(e){console.log(e),""===e&&q([]),s(r.filter((function(e){return e!==_}))),M({value:e,label:e})}))}},"DELETE PLAYLIST"),o.a.createElement("p",null,"\xa0"),o.a.createElement(D.a,{value:X},o.a.createElement(j.a,{position:"static"},o.a.createElement(x.a,{onChange:function(e,t){console.log(t),console.log(e),Z(t)},"aria-label":"Playlists"},o.a.createElement(O.a,{label:"Create Playlist",value:"1"}),o.a.createElement(O.a,{label:"Add To Playlist",value:"2"}),o.a.createElement(O.a,{label:"View Playlist",value:"3"}),o.a.createElement(O.a,{label:"Now Playing",value:"4"}))),o.a.createElement(B.a,{value:"1"},o.a.createElement("p",null,o.a.createElement("h2",null,"Create Playlist"),o.a.createElement(C.a,{name:"createplaylist",label:"Create Playlist",variant:"outlined",onChange:function(e){return a(e.target.value)}}),o.a.createElement("p",null,o.a.createElement(b.a,{variant:"contained",color:"primary",onClick:function(){console.log("Create playlist"),console.log(n),fetch("/playlists/create/".concat(n)).then((function(e){return e.text()})).then((function(e){"True"===e&&(s([].concat(Object(u.a)(r),[{value:n,label:n}])),M({value:n,label:n}),Z("2"))}))}},"CREATE PLAYLIST")))),o.a.createElement(B.a,{value:"2"},o.a.createElement("p",null,o.a.createElement("h2",null,"Add Folder to Playlist"),o.a.createElement("p",null,"1. Choose folders from below"),o.a.createElement("p",null,"2. Single click to select, double-click to open folder "),o.a.createElement("p",null,"3. You can select multiple folders at once using shift or ctrl key"),o.a.createElement("p",null,"4. Add selection to playlist. You can do this multiple times. ")),o.a.createElement("p",null,"CURRENT PLAYLIST: ",null!=_?_.value:""),o.a.createElement("p",null,"PLAYLIST ITEMS COUNT: ",$.length," "),o.a.createElement("p",null,o.a.createElement(b.a,{variant:"contained",color:"primary",onClick:function(){console.log(V),fetch("/playlists/addfolder",{method:"post",body:JSON.stringify(V),headers:{"Content-Type":"application/json"}}).then((function(e){return e.json()})).then((function(e){console.log(e),q(e)}))}},"ADD SELECTION TO PLAYLIST")),o.a.createElement(h.FileBrowser,{files:ne,folderChain:ce,onFileAction:function(e,t){if("open_files"===e.id){if(console.log("OPEN FILES"),W(null),console.log(t),void 0===t.files[0])return;var n,a=t.files[0];if(n=a.name,a.isDir){n=decodeURIComponent(decodeURIComponent(n)),E=E+"/"+n,console.log("Directory selected: ".concat(n)),console.log("Current Path: ".concat(E));var l,o=[];l=[].concat(Object(u.a)(ce),[{id:Object(m.a)(),name:n,path:E}]),console.log("Newfolderchain: ".concat(l)),fetch("/api/directories"+E).then((function(e){return e.json()})).then((function(e){e.map((function(e){var t=e.full,n=e.short;o.push({id:Object(m.a)(),name:n,isDir:!0,url:t})})),fetch("/api/files"+E).then((function(e){return e.json()})).then((function(e){e.map((function(e){var t=e.full,n=e.short;o.push({id:Object(m.a)(),name:n,url:t})})),ie(l),ae(o)}))}))}else{var c=t.target.id;console.log(c),console.log(t),console.log(ce);var i=t.files[0];n=i.name,i.isDir;var r=ce.findIndex((function(e){return e.id===c}));if(-1===r)return;console.log(r),"/"===(E=ce[r].path)&&(E=""),console.log(E);var s=ce.slice(0,r+1);console.log(s);var f=[];fetch("/api/directories"+E).then((function(e){return e.json()})).then((function(e){if(e.map((function(e){var t=e.full,n=e.short;f.push({id:Object(m.a)(),name:n,isDir:!0,url:t})})),""===E)return ie(s),void ae(f);fetch("/api/files"+E).then((function(e){return e.json()})).then((function(e){e.map((function(e){var t=e.full,n=e.short;f.push({id:Object(m.a)(),name:n,url:t})})),ie(s),ae(f)}))}))}}else"change_selection"===e.id&&t.files.length>0&&(console.log("CHANGE SELECTED"),W(t.files));console.log(e),console.log(t)},disableDefaultFileActions:!0,fileActions:re},o.a.createElement(h.FileToolbar,null),o.a.createElement(h.FileSearch,null),o.a.createElement(h.FileList,null))),o.a.createElement(B.a,{value:"3"},o.a.createElement("p",null,o.a.createElement("h2",{id:"viewplaylist"},"Current Playlist"),o.a.createElement("p",null,o.a.createElement(b.a,{variant:"contained",color:"secondary",onClick:function(){console.log("clear playlist"),fetch("/playlists/currentplaylist/clear"),q([])}},"CLEAR PLAYLIST")),o.a.createElement(R.a,{height:400,width:800,itemSize:46,itemCount:$.length},se))),o.a.createElement(B.a,{value:"4"},o.a.createElement(S.a,{className:ue.root},o.a.createElement("div",{className:ue.details},o.a.createElement(A.a,{className:ue.content},o.a.createElement(k.a,{component:"h5",variant:"h5"},null!=_?_.value:""),o.a.createElement(k.a,{variant:"subtitle1",color:"textSecondary"},"Playing:")),o.a.createElement("div",{className:ue.controls},o.a.createElement(F.a,{"aria-label":"previous"},"rtl"===fe.direction?o.a.createElement(T.a,null):o.a.createElement(N.a,null)),o.a.createElement(F.a,{"aria-label":"play/pause"},o.a.createElement(w.a,{className:ue.playIcon})),o.a.createElement(F.a,{"aria-label":"stop"},o.a.createElement(I.a,{className:ue.playIcon})),o.a.createElement(F.a,{"aria-label":"pause"},o.a.createElement(L.a,{className:ue.playIcon})),o.a.createElement(F.a,{"aria-label":"next"},"rtl"===fe.direction?o.a.createElement(N.a,null):o.a.createElement(T.a,null)))),o.a.createElement(P.a,{className:ue.cover,image:"/static/images/cards/live-from-space.jpg",title:"Live from space album cover"})))))};var M=function(){return o.a.createElement(r.a,null,o.a.createElement(s.c,null,o.a.createElement(s.a,{path:"/cast",element:o.a.createElement(g,null)}),o.a.createElement(s.a,{path:"/playlists",element:o.a.createElement(_,null)})))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(M,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[182,1,2]]]);
//# sourceMappingURL=main.915ab694.chunk.js.map