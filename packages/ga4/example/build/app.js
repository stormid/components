!function(e){var t=window.webpackHotUpdate;window.webpackHotUpdate=function(e,n){!function(e,t){if(!_[e]||!w[e])return;for(var n in w[e]=!1,t)Object.prototype.hasOwnProperty.call(t,n)&&(m[n]=t[n]);0==--g&&0===y&&D()}(e,n),t&&t(e,n)};var n,r=!0,o="61086bd4960cbf8b8931",a={},i=[],s=[];function c(e){var t=I[e];if(!t)return S;var r=function(r){return t.hot.active?(I[r]?-1===I[r].parents.indexOf(e)&&I[r].parents.push(e):(i=[e],n=r),-1===t.children.indexOf(r)&&t.children.push(r)):(console.warn("[HMR] unexpected require("+r+") from disposed module "+e),i=[]),S(r)},o=function(e){return{configurable:!0,enumerable:!0,get:function(){return S[e]},set:function(t){S[e]=t}}};for(var a in S)Object.prototype.hasOwnProperty.call(S,a)&&"e"!==a&&"t"!==a&&Object.defineProperty(r,a,o(a));return r.e=function(e){return"ready"===u&&p("prepare"),y++,S.e(e).then(t,(function(e){throw t(),e}));function t(){y--,"prepare"===u&&(b[e]||x(e),0===y&&0===g&&D())}},r.t=function(e,t){return 1&t&&(e=r(e)),S.t(e,-2&t)},r}function d(t){var r={_acceptedDependencies:{},_declinedDependencies:{},_selfAccepted:!1,_selfDeclined:!1,_selfInvalidated:!1,_disposeHandlers:[],_main:n!==t,active:!0,accept:function(e,t){if(void 0===e)r._selfAccepted=!0;else if("function"==typeof e)r._selfAccepted=e;else if("object"==typeof e)for(var n=0;n<e.length;n++)r._acceptedDependencies[e[n]]=t||function(){};else r._acceptedDependencies[e]=t||function(){}},decline:function(e){if(void 0===e)r._selfDeclined=!0;else if("object"==typeof e)for(var t=0;t<e.length;t++)r._declinedDependencies[e[t]]=!0;else r._declinedDependencies[e]=!0},dispose:function(e){r._disposeHandlers.push(e)},addDisposeHandler:function(e){r._disposeHandlers.push(e)},removeDisposeHandler:function(e){var t=r._disposeHandlers.indexOf(e);t>=0&&r._disposeHandlers.splice(t,1)},invalidate:function(){switch(this._selfInvalidated=!0,u){case"idle":(m={})[t]=e[t],p("ready");break;case"ready":H(t);break;case"prepare":case"check":case"dispose":case"apply":(v=v||[]).push(t)}},check:O,apply:j,status:function(e){if(!e)return u;l.push(e)},addStatusHandler:function(e){l.push(e)},removeStatusHandler:function(e){var t=l.indexOf(e);t>=0&&l.splice(t,1)},data:a[t]};return n=void 0,r}var l=[],u="idle";function p(e){u=e;for(var t=0;t<l.length;t++)l[t].call(null,e)}var f,m,h,v,g=0,y=0,b={},w={},_={};function E(e){return+e+""===e?+e:e}function O(e){if("idle"!==u)throw new Error("check() is only allowed in idle status");return r=e,p("check"),(t=1e4,t=t||1e4,new Promise((function(e,n){if("undefined"==typeof XMLHttpRequest)return n(new Error("No browser support"));try{var r=new XMLHttpRequest,a=S.p+""+o+".hot-update.json";r.open("GET",a,!0),r.timeout=t,r.send(null)}catch(e){return n(e)}r.onreadystatechange=function(){if(4===r.readyState)if(0===r.status)n(new Error("Manifest request to "+a+" timed out."));else if(404===r.status)e();else if(200!==r.status&&304!==r.status)n(new Error("Manifest request to "+a+" failed."));else{try{var t=JSON.parse(r.responseText)}catch(e){return void n(e)}e(t)}}}))).then((function(e){if(!e)return p(k()?"ready":"idle"),null;w={},b={},_=e.c,h=e.h,p("prepare");var t=new Promise((function(e,t){f={resolve:e,reject:t}}));m={};return x(0),"prepare"===u&&0===y&&0===g&&D(),t}));var t}function x(e){_[e]?(w[e]=!0,g++,function(e){var t=document.createElement("script");t.charset="utf-8",t.src=S.p+""+e+"."+o+".hot-update.js",document.head.appendChild(t)}(e)):b[e]=!0}function D(){p("ready");var e=f;if(f=null,e)if(r)Promise.resolve().then((function(){return j(r)})).then((function(t){e.resolve(t)}),(function(t){e.reject(t)}));else{var t=[];for(var n in m)Object.prototype.hasOwnProperty.call(m,n)&&t.push(E(n));e.resolve(t)}}function j(t){if("ready"!==u)throw new Error("apply() is only allowed in ready status");return function t(r){var s,c,d,l,u;function f(e){for(var t=[e],n={},r=t.map((function(e){return{chain:[e],id:e}}));r.length>0;){var o=r.pop(),a=o.id,i=o.chain;if((l=I[a])&&(!l.hot._selfAccepted||l.hot._selfInvalidated)){if(l.hot._selfDeclined)return{type:"self-declined",chain:i,moduleId:a};if(l.hot._main)return{type:"unaccepted",chain:i,moduleId:a};for(var s=0;s<l.parents.length;s++){var c=l.parents[s],d=I[c];if(d){if(d.hot._declinedDependencies[a])return{type:"declined",chain:i.concat([c]),moduleId:a,parentId:c};-1===t.indexOf(c)&&(d.hot._acceptedDependencies[a]?(n[c]||(n[c]=[]),g(n[c],[a])):(delete n[c],t.push(c),r.push({chain:i.concat([c]),id:c})))}}}}return{type:"accepted",moduleId:e,outdatedModules:t,outdatedDependencies:n}}function g(e,t){for(var n=0;n<t.length;n++){var r=t[n];-1===e.indexOf(r)&&e.push(r)}}k();var y={},b=[],w={},O=function(){console.warn("[HMR] unexpected require("+D.moduleId+") to disposed module")};for(var x in m)if(Object.prototype.hasOwnProperty.call(m,x)){var D;u=E(x),D=m[x]?f(u):{type:"disposed",moduleId:x};var j=!1,H=!1,P=!1,A="";switch(D.chain&&(A="\nUpdate propagation: "+D.chain.join(" -> ")),D.type){case"self-declined":r.onDeclined&&r.onDeclined(D),r.ignoreDeclined||(j=new Error("Aborted because of self decline: "+D.moduleId+A));break;case"declined":r.onDeclined&&r.onDeclined(D),r.ignoreDeclined||(j=new Error("Aborted because of declined dependency: "+D.moduleId+" in "+D.parentId+A));break;case"unaccepted":r.onUnaccepted&&r.onUnaccepted(D),r.ignoreUnaccepted||(j=new Error("Aborted because "+u+" is not accepted"+A));break;case"accepted":r.onAccepted&&r.onAccepted(D),H=!0;break;case"disposed":r.onDisposed&&r.onDisposed(D),P=!0;break;default:throw new Error("Unexception type "+D.type)}if(j)return p("abort"),Promise.reject(j);if(H)for(u in w[u]=m[u],g(b,D.outdatedModules),D.outdatedDependencies)Object.prototype.hasOwnProperty.call(D.outdatedDependencies,u)&&(y[u]||(y[u]=[]),g(y[u],D.outdatedDependencies[u]));P&&(g(b,[D.moduleId]),w[u]=O)}var L,M=[];for(c=0;c<b.length;c++)u=b[c],I[u]&&I[u].hot._selfAccepted&&w[u]!==O&&!I[u].hot._selfInvalidated&&M.push({module:u,parents:I[u].parents.slice(),errorHandler:I[u].hot._selfAccepted});p("dispose"),Object.keys(_).forEach((function(e){!1===_[e]&&function(e){delete installedChunks[e]}(e)}));var T,U,C=b.slice();for(;C.length>0;)if(u=C.pop(),l=I[u]){var q={},N=l.hot._disposeHandlers;for(d=0;d<N.length;d++)(s=N[d])(q);for(a[u]=q,l.hot.active=!1,delete I[u],delete y[u],d=0;d<l.children.length;d++){var $=I[l.children[d]];$&&((L=$.parents.indexOf(u))>=0&&$.parents.splice(L,1))}}for(u in y)if(Object.prototype.hasOwnProperty.call(y,u)&&(l=I[u]))for(U=y[u],d=0;d<U.length;d++)T=U[d],(L=l.children.indexOf(T))>=0&&l.children.splice(L,1);p("apply"),void 0!==h&&(o=h,h=void 0);for(u in m=void 0,w)Object.prototype.hasOwnProperty.call(w,u)&&(e[u]=w[u]);var R=null;for(u in y)if(Object.prototype.hasOwnProperty.call(y,u)&&(l=I[u])){U=y[u];var V=[];for(c=0;c<U.length;c++)if(T=U[c],s=l.hot._acceptedDependencies[T]){if(-1!==V.indexOf(s))continue;V.push(s)}for(c=0;c<V.length;c++){s=V[c];try{s(U)}catch(e){r.onErrored&&r.onErrored({type:"accept-errored",moduleId:u,dependencyId:U[c],error:e}),r.ignoreErrored||R||(R=e)}}}for(c=0;c<M.length;c++){var B=M[c];u=B.module,i=B.parents,n=u;try{S(u)}catch(e){if("function"==typeof B.errorHandler)try{B.errorHandler(e)}catch(t){r.onErrored&&r.onErrored({type:"self-accept-error-handler-errored",moduleId:u,error:t,originalError:e}),r.ignoreErrored||R||(R=t),R||(R=e)}else r.onErrored&&r.onErrored({type:"self-accept-errored",moduleId:u,error:e}),r.ignoreErrored||R||(R=e)}}if(R)return p("fail"),Promise.reject(R);if(v)return t(r).then((function(e){return b.forEach((function(t){e.indexOf(t)<0&&e.push(t)})),e}));return p("idle"),new Promise((function(e){e(b)}))}(t=t||{})}function k(){if(v)return m||(m={}),v.forEach(H),v=void 0,!0}function H(t){Object.prototype.hasOwnProperty.call(m,t)||(m[t]=e[t])}var I={};function S(t){if(I[t])return I[t].exports;var n=I[t]={i:t,l:!1,exports:{},hot:d(t),parents:(s=i,i=[],s),children:[]};return e[t].call(n.exports,n,n.exports,c(t)),n.l=!0,n.exports}S.m=e,S.c=I,S.d=function(e,t,n){S.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},S.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},S.t=function(e,t){if(1&t&&(e=S(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(S.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)S.d(n,r,function(t){return e[t]}.bind(null,r));return n},S.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return S.d(t,"a",t),t},S.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},S.p="",S.h=function(){return o},c(0)(S.s=0)}([function(e,t,n){"use strict";n.r(t);var r={autoTrack:!0,debug:void 0};const o="v",a="tid",i="_p",s="ul",c="cid",d="_fv",l="_s",u="sid",p="sct",f="seg",m="_ss",h="_dbg",v="dr",g="dl",y="dt",b="en",w="ep",_="epn",E="sr",O="_et",x="uaa",D="uab",j="uafvl",k="uamb",H="uam",I="uap",S="uapv",P="uaw",A=["platform","platformVersion","architecture","model","uaFullVersion","bitness","uaFullVersion","bitness","fullVersionList","wow64"],L=["q","s","search","query","keyword"],M="page_view",T="scroll",U="click",C="view_search_results",q="user_engagement",N="file_download",$="form_start",R="form_submit";function V(e,t=300,n=0){return(...r)=>(clearTimeout(n),n=setTimeout(e,t,...r))}const B=(e=16)=>(e=e>16?16:e,(""+Math.floor(1e16*Math.random())).padStart(e,"0").substring(-1,e)),F=(e,t=localStorage)=>{const n=t.getItem(e);if(n)return n;const r=B();return t.setItem(e,r),r},G=e=>{const t=+(sessionStorage.getItem(p)||0)+1;return e.firstEvent&&sessionStorage.setItem(p,t),t},z=()=>{let e,t=0,n=!1;const r=()=>t+(new Date(Date.now()).getTime()-e);return{start:()=>{n||(e=new Date(Date.now()).getTime(),n=!0)},stop:()=>{n&&(t=r(),n=!1)},get:r}},X=e=>{const t=(n=document.activeElement)&&"submit"===n.getAttribute("type")||"BUTTON"===n.nodeName&&"button"!==n.getAttribute("type")?document.activeElement:e.querySelector("button:not([type=button]), input[type=submit]");var n;return t?"BUTTON"===t.nodeName?(t.innerText||t.textContent).trim():t.value||"Submit":""},Y=e=>{if(!e.data.base.length)return;const t="https://www.google-analytics.com/g/collect?"+new URLSearchParams(e.data.base.filter(([,e])=>e));return navigator.sendBeacon&&navigator.sendBeacon(t,e.data.events||void 0),e.data.base=[],e.data.events="",e.firstEvent=!1,e.hitCount=e.hitCount+1,e},J=V(Y,1e3),K=async(e,t)=>{e.data=await ee(e,t),J(e)},Q=async(e,t)=>{e.data=await ee(e,t),Y(e)},W=e=>{if(e){if(e.name)return[`${b}=${e.name}${e.params?"&"+e.params.map(e=>`${e[0]}${e[1]?"="+e[1]:""}`).join("&"):""}`];console.warn("GA4: Missing event name")}},Z=async e=>{const{firstVisit:t,sessionStart:n,sessionCount:r}=(e=>{const t=localStorage.getItem(c)?void 0:"1",n=sessionStorage.getItem(u)?void 0:"1";n&&sessionStorage.setItem(u,"1");return{firstVisit:t,sessionStart:n,sessionCount:G(e)}})(e),{tid:b,settings:w}=e,{architecture:_,bitness:O,fullVersionList:L,mobile:M,model:T,platform:U,platformVersion:C,wow64:q}=await(async()=>navigator.userAgentData?navigator.userAgentData.getHighEntropyValues(A):{})();return[[o,"2"],[a,b],[i,B()],[s,(navigator.language||"").toLowerCase()],[c,F(c)],[d,t],[l,e.hitCount],[u,F(u)],[p,r],[f,"1"],[m,n],[h,w.debug&&1],[v,document.referrer],[g,document.location.origin+document.location.pathname+document.location.search],[y,document.title],[E,`${screen.width}x${screen.height}`],[x,_],[D,O],[j,L&&L.map(e=>`${e.brand} ${e.version}`).join(" ")],[k,M],[H,T],[I,U],[S,C],[P,q]]},ee=async(e,t)=>({base:0===e.data.base.length?await Z(e):e.data.base,events:[e.data.events,W(t)].join("\r\n")}),te=e=>()=>{(()=>{const e=document.body,t=window.pageYOffset||e.scrollTop,{scrollHeight:n,offsetHeight:r,clientHeight:o}=document.documentElement,a=Math.max(e.scrollHeight,n,e.offsetHeight,r,e.clientHeight,o)-window.innerHeight;return Math.floor(100*Math.abs(t/a))})()<90||(K(e,{name:T,params:[[_+".percent_scrolled",90],[O,e.timer.get()]]}),document.removeEventListener("scroll",e.handlers.scroll))},ne=e=>t=>{const n=(e=>{let t=e;for(;t&&t.tagName;){if(t.tagName&&"a"===t.tagName.toLowerCase())return t;t=t.parentNode}return!1})(t.target);if(!n)return;const{isExternal:r,hostname:o,pathname:a}=(e=>{let t,n;try{({hostname:t,pathname:n}=e&&new URL(e)||{})}catch{}return{isExternal:t!==window.location.host,hostname:t,pathname:n}})(n),i=n.href.split(".").pop().match(new RegExp("pdf|xlsx?|docx?|txt|rtf|csv|exe|key|pp(s|t|tx)|7z|pkg|rar|gz|zip|avi|mov|mp4|mpe?g|wmv|midi?|mp3|wav|wma"));if(!r&&!i)return;const s=[[w+".link_domain",o],[w+".link_id",n.id],[w+".link_url",n.href],[w+".link_classes",n.className],[O,e.timer.get()]];if(!i)return Q(e,{name:U,params:[...s,[w+".outbound",!0]]});Q(e,{name:N,params:[...s,[w+".file_extension",i],[w+".file_name",a],[w+".link_text",(n.innerText||n.textContent||"").trim()]]})};var re=async({tid:e,settings:t})=>{const n={tid:e,settings:t,firstEvent:!0,data:{base:[],events:""},handlers:{},forms:[],hitCount:1,timer:z()};if(n.timer.start(),t.autoTrack){await K(n,{name:M});const e=document.location.search;if(r=e,L.some(e=>r.includes(`&${e}=`)||r.includes(`?${e}=`))){const t=new URLSearchParams(e),r=L.find(e=>t.get(e));await K(n,{name:C,params:[[w+".search_term",t.get(r)],[""+O,n.timer.get()]]})}n.handlers.scroll=V(te(n)),document.addEventListener("scroll",n.handlers.scroll),n.handlers.scroll(),window.addEventListener("focus",n.timer.start),window.addEventListener("blur",n.timer.stop),document.addEventListener("visibilitychange",()=>{"hidden"===document.visibilityState&&(e=>{e.timer.stop(),Q(e,{name:q,params:[[O,e.timer.get()]]})})(n)}),document.addEventListener("click",ne(n));const t=[].slice.call(document.querySelectorAll("form"));t.length>0&&(n.handlers.forms=t.map((e,t)=>{n.forms[t]={started:!1};const r=((e,t,n)=>()=>{K(e,{name:$,params:[[w+".form_id",t.id],[w+".form_name",t.name],[w+".form_destination",new URL(t.getAttribute("action")||"",document.location.origin+document.location.pathname+document.location.search).href],[O,e.timer.get()]]}),t.removeEventListener("change",e.handlers.forms[n]),e.forms[n].started=!0})(n,e,t);return e.addEventListener("change",r),e.addEventListener("submit",((e,t,n)=>()=>{e.forms[n].started||e.handlers.forms[n](),Q(e,{name:R,params:[[w+".form_id",t.id],[w+".form_name",t.name],[w+".form_destination",new URL(t.getAttribute("action")||"",document.location.origin+document.location.pathname+document.location.search).href],[w+".form_submit_text",X(t)],[O,e.timer.get()]]})})(n,e,t)),r}))}var r;return{track:Q.bind(null,n),queue:K.bind(null,n),getState:()=>n}};(async(e,t)=>{e?Object.create(await re({tid:e,settings:{...r,...t}})):console.warn("GA4: Missing tracking Id")})("G-XPD8YC5FYF",{debug:!0})}]);