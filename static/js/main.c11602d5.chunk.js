(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{15:function(t,e,a){t.exports=a(26)},20:function(t,e,a){},23:function(t,e,a){},24:function(t,e,a){},26:function(t,e,a){"use strict";a.r(e);var n=a(0),r=a.n(n),i=a(11),c=a.n(i),o=(a(20),a(3)),s=a(4),l=a(2),m=a(5),u=a(7),f=a(6),p=a(8),d=a(14),E=(a(23),function t(){var e=this;Object(l.a)(this,t),this.numLines=0,this.functionData={},this.currentStack=[],this.parse=function(t){var a=t.split("\n");e.numLines=a.length;var n=0,r=a[n++],i=a[n++];for(r.match(/Version: [23].*/)&&i.match(/File format: [2-4]/)||(console.log("Invalid file"),console.log(r,i));n<e.numLines;n++)e.parseLine(a[n]);return e.functionData},this.parseLine=function(t){var a=t.split("\t");if(!(a.length<5)){var n=parseInt(a[1],10),r=a[2];switch(e.functionData[n]||(e.functionData[n]={id:n,timeEnter:0,memoryEnter:0,timeExit:0,memoryExit:0,timeDiff:0,memoryDiff:0,depth:0,name:"",internal:0,file:"",line:"",params:[],return:"",children:[],parent:0,isExpanded:1}),r){case"0":if(e.functionData[n].depth=parseInt(a[0],10),e.functionData[n].timeEnter=e.formatFloat(a[3]),e.functionData[n].memoryEnter=e.formatFloat(a[4]),e.functionData[n].name=a[5],e.functionData[n].internal=!!a[6],e.functionData[n].file=a[8],e.functionData[n].line=a[9],a[7]?e.functionData[n].params=[a[7]]:e.functionData[n].params=a.slice(11),e.currentStack.length){e.functionData[n].isExpanded=0,e.functionData[n].parent=e.currentStack[e.currentStack.length-1];var i=e.currentStack[e.currentStack.length-1];e.functionData[i].children.push(n)}e.currentStack.push(n);break;case"1":e.functionData[n].timeExit=e.formatFloat(a[3]),e.functionData[n].memoryExit=e.formatFloat(a[4]),e.functionData[n].timeDiff=e.formatFloat(e.functionData[n].timeExit-e.functionData[n].timeEnter),e.functionData[n].memoryDiff=e.formatFloat(e.functionData[n].memoryExit-e.functionData[n].memoryEnter),e.currentStack.pop();break;case"R":e.functionData[n].return=a[5];break;default:console.log("Invalid line",t)}}},this.formatFloat=function(t){return parseFloat(t)}}),h=(a(24),function(t){function e(){var t,a;Object(l.a)(this,e);for(var n=arguments.length,i=new Array(n),c=0;c<n;c++)i[c]=arguments[c];return(a=Object(u.a)(this,(t=Object(f.a)(e)).call.apply(t,[this].concat(i)))).getChildContainer=function(){return a.props.entry.children.length?a.props.entry.isExpanded?r.a.createElement("div",{className:"TraceEntry-children expanded","data-entryid":a.props.entry.id},r.a.createElement("div",{className:"TraceEntry-children-leftpad","data-entryid":a.props.entry.id,onClick:function(){a.props.onCollapse(a.props.entry.id)}}),r.a.createElement("div",{className:"TraceEntry-children-container"},a.props.entry.children.map(function(t){return r.a.createElement(e,Object.assign({},a.props,{key:t,isChild:!0,entry:a.props.allEntries[t]}))}))):r.a.createElement("div",{className:"TraceEntry-children collapsed","data-entryid":a.props.entry.id,onClick:function(){a.props.onExpand(a.props.entry.id)}}):null},a.renderParams=function(t){return" "+t.map(function(t){return t.substr(0,50)}).join(", ")+" "},a.formatFloat=function(t){return+(Math.round(t+"e+5")+"e-5")},a}return Object(p.a)(e,t),Object(m.a)(e,[{key:"render",value:function(){var t=this.props.entry,e=this.props.allEntries[this.props.entry.parent],a=0,n=0;if(e){var i=e.timeDiff,c=e.memoryDiff;0!==i&&(a=t.timeDiff/i*100),0!==c&&(n=t.memoryDiff/c*100)}return r.a.createElement("div",{className:"TraceEntry"},r.a.createElement("div",{className:"TraceEntry-data"},r.a.createElement("div",{className:"TraceEntry-func",title:t.file+":"+t.line},r.a.createElement("div",{className:"TraceEntry-funcname"},t.name),"(",r.a.createElement("div",{className:"TraceEntry-args"},t.params.length?this.renderParams(t.params):null),") -> ",r.a.createElement("div",{className:"TraceEntry-return"},t.return.substr(0,50))),r.a.createElement("div",{className:"TraceEntry-metric"},a>0?r.a.createElement("div",{className:"TraceEntry-metric-percentage"},"( ",this.formatFloat(a),"% ) \xa0"):null,this.formatFloat(t.timeDiff)),r.a.createElement("div",{className:"TraceEntry-metric"},n>0?r.a.createElement("div",{className:"TraceEntry-metric-percentage"},"( ",this.formatFloat(n),"% ) \xa0"):null,this.formatFloat(t.memoryDiff))),this.getChildContainer())}}]),e}(n.Component)),y=a(13),D=function(t){function e(){var t,a;Object(l.a)(this,e);for(var n=arguments.length,i=new Array(n),c=0;c<n;c++)i[c]=arguments[c];return(a=Object(u.a)(this,(t=Object(f.a)(e)).call.apply(t,[this].concat(i)))).state={isReady:!1,traceData:{}},a.onDrop=function(t){var e=new FileReader;e.onabort=function(){return console.log("file reading was aborted")},e.onerror=function(){return console.log("file reading has failed")},e.addEventListener("progress",console.log),e.onload=function(){var t=e.result,n=new E;a.setState({isReady:!0,traceData:n.parse(t)})},t.forEach(function(t){return e.readAsText(t,"utf-8")})},a.renderEntry=function(t){return t.parent?null:r.a.createElement(h,{key:t.id,entry:t,allEntries:a.state.traceData,onExpand:a.expandEntry,onCollapse:a.collapseEntry})},a.expandEntry=function(t){a.setState({traceData:Object(s.a)({},a.state.traceData,Object(o.a)({},t,Object(s.a)({},a.state.traceData[t],{isExpanded:1})))})},a.collapseEntry=function(t){a.setState({traceData:Object(s.a)({},a.state.traceData,Object(o.a)({},t,Object(s.a)({},a.state.traceData[t],{isExpanded:0})))})},a}return Object(p.a)(e,t),Object(m.a)(e,[{key:"render",value:function(){var t=this;return r.a.createElement("div",{className:"App",onClick:this.clickHandler},r.a.createElement(d.a,{onDrop:this.onDrop},function(t){var e=t.getRootProps,a=t.getInputProps;return r.a.createElement("section",null,r.a.createElement("div",e(),r.a.createElement("input",a()),r.a.createElement("p",null,"Drag 'n' drop some files here, or click to select files")))}),this.state.isReady&&r.a.createElement("div",{className:"entries"},Object(y.map)(this.state.traceData,function(e){return t.renderEntry(e)})))}}]),e}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(D,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(t){t.unregister()})}},[[15,1,2]]]);
//# sourceMappingURL=main.c11602d5.chunk.js.map