(this.webpackJsonpcast=this.webpackJsonpcast||[]).push([[0],{118:function(e,n,t){e.exports=t(332)},123:function(e,n,t){},124:function(e,n,t){},332:function(e,n,t){"use strict";t.r(n);var o=t(0),a=t.n(o),c=t(65),i=t.n(c),l=(t(123),t(117)),r=t(69),s=(t(124),t(125),t(33)),u=t(336);var m=function(){var e=Object(o.useState)([]),n=Object(r.a)(e,2),t=n[0],c=n[1],i=Object(o.useState)([{id:"/",name:"Network Shares"}]),m=Object(r.a)(i,2),f=m[0],d=m[1];return Object(o.useEffect)((function(){fetch("/api/directories").then((function(e){return e.json()})).then((function(e){var n=[];e.map((function(e){e.full;var t=e.short;n.push({id:Object(u.a)(),name:t,isDir:!0})})),c(n)}))}),[]),a.a.createElement("div",{className:"App"},a.a.createElement(s.FileBrowser,{files:t,folderChain:f,onFileAction:function(e,n){if("change_selection"===e.id){if(void 0===n.files[0])return;var t,o=n.files[0];if(t=o.name,o.id,o.isDir){console.log("Directory selected");var a=[].concat(a,[{id:Object(u.a)(),name:t}]);d(a),c([{id:"/test/boo.mp3",name:"boo.mp3"},{id:"/test/enya.mp3",name:"enya.mp3"}])}else console.log("File selected")}else if("open_files"===e.id){console.log(f);var i=Object(l.a)(f);i=i.splice(0,i.length-1),console.log(i),d(i),c([{id:"/back",name:"back.jpg"}])}console.log(e),console.log(n)}},a.a.createElement(s.FileToolbar,null),a.a.createElement(s.FileSearch,null),a.a.createElement(s.FileList,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(m,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[118,1,2]]]);
//# sourceMappingURL=main.82f8a274.chunk.js.map