(this.webpackJsonpcast=this.webpackJsonpcast||[]).push([[0],{118:function(e,n,t){e.exports=t(332)},123:function(e,n,t){},124:function(e,n,t){},332:function(e,n,t){"use strict";t.r(n);var o=t(0),i=t.n(o),c=t(65),a=t.n(c),r=(t(123),t(117)),l=t(69),s=(t(124),t(125),t(20)),u=t(336);var h=function(){var e=Object(o.useState)([]),n=Object(l.a)(e,2),t=n[0],c=n[1],a=Object(o.useState)([{id:Object(u.a)(),name:"Network Shares"}]),h=Object(l.a)(a,2),d=h[0],f=h[1],m="";Object(o.useEffect)((function(){fetch("/api/directories").then((function(e){return e.json()})).then((function(e){var n=[];e.map((function(e){var t=e.full,o=e.short;n.push({id:t,name:o,isDir:!0})})),c(n)}))}),[]);var p=[{id:s.ChonkyActions.OpenFiles.id},{id:s.ChonkyActions.ChangeSelection.id},{id:s.ChonkyActions.OpenParentFolder.id,requiresSelection:!1}];return i.a.createElement("div",{className:"App"},i.a.createElement(s.FileBrowser,{files:t,folderChain:d,onFileAction:function(e,n){if("change_selection"===e.id){if(void 0===n.files[0])return;var t,o=n.files[0];if(t=o.name,o.isDir){m=decodeURIComponent(decodeURIComponent("".concat(m,"/").concat(t))),console.log("Directory selected: ".concat(t)),console.log("Current Path: ".concat(m));var i,a=[];i=[{id:Object(u.a)(),name:"Network Shares"},{id:Object(u.a)(),name:t}],fetch("/api/directories"+m).then((function(e){return e.json()})).then((function(e){e.map((function(e){var n=e.path,t=e.short;a.push({id:n,name:t,isDir:!0})})),fetch("/api/files"+m).then((function(e){return e.json()})).then((function(e){e.map((function(e){var n=e.path,t=e.short;a.push({id:n,name:t})})),f(i),c(a)}))}))}else console.log("File selected")}else if("open_files"===e.id){console.log(d);var l=Object(r.a)(d);l=l.splice(0,l.length-1),console.log(l),f(l),c([{id:"/back",name:"back.jpg"}])}console.log(e),console.log(n)},disableDefaultFileActions:!0,fileActions:p},i.a.createElement(s.FileToolbar,null),i.a.createElement(s.FileSearch,null),i.a.createElement(s.FileList,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a.a.render(i.a.createElement(i.a.StrictMode,null,i.a.createElement(h,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[118,1,2]]]);
//# sourceMappingURL=main.df4df1b1.chunk.js.map