(this.webpackJsonpcast=this.webpackJsonpcast||[]).push([[0],{118:function(e,n,t){e.exports=t(332)},123:function(e,n,t){},124:function(e,n,t){},332:function(e,n,t){"use strict";t.r(n);var o,i=t(0),a=t.n(i),c=t(65),r=t.n(c),l=(t(123),t(117)),s=t(69),u=(t(124),t(125),t(20)),h=t(336);var d=function(){var e=Object(i.useState)([]),n=Object(s.a)(e,2),t=n[0],c=n[1],r=Object(i.useState)([{id:Object(h.a)(),name:"Network Shares"}]),d=Object(s.a)(r,2),f=d[0],m=d[1];Object(i.useEffect)((function(){o="",fetch("/api/directories").then((function(e){return e.json()})).then((function(e){var n=[];e.map((function(e){var t=e.full,o=e.short;n.push({id:t,name:o,isDir:!0})})),c(n)}))}),[]);var p=[{id:u.ChonkyActions.OpenFiles.id},{id:u.ChonkyActions.ChangeSelection.id},{id:u.ChonkyActions.OpenParentFolder.id,requiresSelection:!1}];return a.a.createElement("div",{className:"App"},a.a.createElement(u.FileBrowser,{files:t,folderChain:f,onFileAction:function(e,n){if("change_selection"===e.id){if(void 0===n.files[0])return;var t,i=n.files[0];if(t=i.name,i.isDir){t=decodeURIComponent(decodeURIComponent(t)),o=o+"/"+t,console.log("Directory selected: ".concat(t)),console.log("Current Path: ".concat(o));var a,r=[];a=[{id:Object(h.a)(),name:"Network Shares"},{id:Object(h.a)(),name:t}],fetch("/api/directories"+o).then((function(e){return e.json()})).then((function(e){e.map((function(e){var n=e.path,t=e.short;r.push({id:n,name:t,isDir:!0})})),fetch("/api/files"+o).then((function(e){return e.json()})).then((function(e){e.map((function(e){var n=e.path,t=e.short;r.push({id:n,name:t})})),m(a),c(r)}))}))}else console.log("File selected")}else if("open_files"===e.id){console.log(f);var s=Object(l.a)(f);s=s.splice(0,s.length-1),console.log(s),m(s),c([{id:"/back",name:"back.jpg"}])}console.log(e),console.log(n)},disableDefaultFileActions:!0,fileActions:p},a.a.createElement(u.FileToolbar,null),a.a.createElement(u.FileSearch,null),a.a.createElement(u.FileList,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(d,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[118,1,2]]]);
//# sourceMappingURL=main.d87ef3d0.chunk.js.map