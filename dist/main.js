/*! For license information please see main.js.LICENSE.txt */
!function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=15)}([function(t,e){function r(t,e,r,n,o,i,a){try{var s=t[i](a),c=s.value}catch(t){return void r(t)}s.done?e(c):Promise.resolve(c).then(n,o)}function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function o(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function i(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}var a=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];if(n(this,t),e.length>0)this.cube=e;else{for(var r=[[[{},{},{}],[{},{},{}],[{},{},{}]],[[{},{},{}],[{},{},{}],[{},{},{}]],[[{},{},{}],[{},{},{}],[{},{},{}]]],o=0;o<3;o++)for(var i=0;i<3;i++)for(var a=function(e){var n={},a={x:o,y:i,z:e};Object.keys(a).forEach((function(e){var r=a[e];0===r?n[e]=t.faces[e].start:2===r&&(n[e]=t.faces[e].end)})),r[o][i][e]=n},s=0;s<3;s++)a(s);this.cube=r}}var e,i,a,s,c;return e=t,(i=[{key:"scramble",value:(s=regeneratorRuntime.mark((function t(){var e,r,n,o,i,a,s,c=arguments;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e=c.length>0&&void 0!==c[0]?c[0]:30,r=c.length>1&&void 0!==c[1]?c[1]:function(){},n=["U","D","R","L","F","B"],o=0;case 4:if(!(o<e)){t.next=14;break}return i=n[Math.floor(Math.random()*n.length)],a=[!0,!1][Math.floor(2*Math.random())],s="".concat(i).concat(a?"'":""),this.makeMove(s),t.next=11,r(s);case 11:o++,t.next=4;break;case 14:case"end":return t.stop()}}),t,this)})),c=function(){var t=this,e=arguments;return new Promise((function(n,o){var i=s.apply(t,e);function a(t){r(i,n,o,a,c,"next",t)}function c(t){r(i,n,o,a,c,"throw",t)}a(void 0)}))},function(){return c.apply(this,arguments)})},{key:"makeMove",value:function(t){var e=!0,r="";switch((t=t.toLowerCase().trim())[0]){case"f":r="g";break;case"b":r="b";break;case"l":r="o";break;case"r":r="r";break;case"u":r="w";break;case"d":r="y";break;default:throw new Error("Invalid Rubik's cube notation with letter ".concat(t[0]))}2==t.length&&"'"==t[1]&&(e=!1),this.moveFace(r,e)}},{key:"moveFace",value:function(e){var r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=JSON.parse(JSON.stringify(this.cube)),o=function(t,e){var r=-1;return e.forEach((function(e,n){e[0]===t[0]&&e[1]===t[1]&&(r=n)})),r},i=function(t,e){return(t+1)%e.length},a=function(t,e){return(t-1+4)%e.length},s="",c=-1;Object.keys(t.faces).forEach((function(r){var n=t.faces[r];if(n.start===e)c=0;else{if(n.end!==e)return;c=2}s=r}));var u=r;"y"===s?0===c&&(u=!u):"z"===s?2===c&&(u=!u):"x"===s&&0===c&&(u=!u);for(var h=[[0,0],[2,0],[2,2],[0,2]],f=[[1,0],[2,1],[1,2],[0,1]],l=0;l<3;l++)for(var p=0;p<3;p++)for(var v=0;v<3;v++){var y={x:l,y:p,z:v},g=this.cube[l][p][v];if(y[s]===c){var d=[-1,-1];"y"===s?d=[y.z,y.x]:"z"===s?d=[y.y,y.x]:"x"===s&&(d=[y.y,y.z]);var m=o(d,h),b=o(d,f);if(m>-1){var x=h[u?i(m,h):a(m,h)];if("y"===s){var w=x[0],j=x[1];n[j][c][w]={x:g.z,y:g.y,z:g.x}}else if("z"===s){var O=x[0],z=x[1];n[z][O][c]={x:g.y,y:g.x,z:g.z}}else if("x"===s){var k=x[0],E=x[1];n[c][k][E]={x:g.x,y:g.z,z:g.y}}}else if(b>-1){var L=f[u?i(b,f):a(b,f)];if("y"===s){var R=L[0],q=L[1];n[q][c][R]={y:g.y},g.x?n[q][c][R].z=g.x:g.z&&(n[q][c][R].x=g.z)}else if("z"===s){var _=L[0],C=L[1];n[C][_][c]={z:g.z},g.x?n[C][_][c].y=g.x:g.y&&(n[C][_][c].x=g.y)}else if("x"===s){var S=L[0],A=L[1];n[c][S][A]={x:g.x},g.z?n[c][S][A].y=g.z:g.y&&(n[c][S][A].z=g.y)}}}}this.cube=n}},{key:"toFacesObj",value:function(){for(var e=this,r={},n=function(n){for(var o=function(o){for(var i=function(i){var a={x:n,y:o,z:i},s=e.cube[n][o][i];Object.keys(a).forEach((function(e){var c=a[e],u="";if(0===c)u=t.faces[e].start;else{if(2!==c)return;u=t.faces[e].end}r[u]||(r[u]=[[],[],[]]);var h=-1,f=-1;if("z"===e?(h=2-o,f=n):"y"===e?(h=2-i,f=n):"x"===e&&(h=2-o,f=i),"o"===u||"b"===u)h=2-h;else if("y"===u){var l=[f,h];h=2-(h=l[0]),f=2-(f=l[1])}r[u][h][f]=s[e]}))},a=0;a<3;a++)i(a)},i=0;i<3;i++)o(i)},o=0;o<3;o++)n(o);return r}}])&&o(e.prototype,i),a&&o(e,a),t}();i(a,"colors",{w:"white",g:"green",r:"red",b:"blue",y:"yellow",o:"orange"}),i(a,"faces",{x:{start:"o",end:"r"},y:{start:"y",end:"w"},z:{start:"g",end:"b"}}),t.exports=a},function(t,e,r){},function(t,e,r){},function(t,e){document.querySelectorAll(".openable-section .label").forEach((function(t){t.addEventListener("click",(function(){t.parentElement.classList.toggle("closed"),setTimeout((function(){t===document.activeElement&&t.blur()}),250)}))}))},function(t,e,r){var n=function(t){"use strict";var e=Object.prototype,r=e.hasOwnProperty,n="function"==typeof Symbol?Symbol:{},o=n.iterator||"@@iterator",i=n.asyncIterator||"@@asyncIterator",a=n.toStringTag||"@@toStringTag";function s(t,e,r,n){var o=e&&e.prototype instanceof h?e:h,i=Object.create(o.prototype),a=new j(n||[]);return i._invoke=function(t,e,r){var n="suspendedStart";return function(o,i){if("executing"===n)throw new Error("Generator is already running");if("completed"===n){if("throw"===o)throw i;return z()}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var s=b(a,r);if(s){if(s===u)continue;return s}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if("suspendedStart"===n)throw n="completed",r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n="executing";var h=c(t,e,r);if("normal"===h.type){if(n=r.done?"completed":"suspendedYield",h.arg===u)continue;return{value:h.arg,done:r.done}}"throw"===h.type&&(n="completed",r.method="throw",r.arg=h.arg)}}}(t,r,a),i}function c(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}t.wrap=s;var u={};function h(){}function f(){}function l(){}var p={};p[o]=function(){return this};var v=Object.getPrototypeOf,y=v&&v(v(O([])));y&&y!==e&&r.call(y,o)&&(p=y);var g=l.prototype=h.prototype=Object.create(p);function d(t){["next","throw","return"].forEach((function(e){t[e]=function(t){return this._invoke(e,t)}}))}function m(t,e){var n;this._invoke=function(o,i){function a(){return new e((function(n,a){!function n(o,i,a,s){var u=c(t[o],t,i);if("throw"!==u.type){var h=u.arg,f=h.value;return f&&"object"==typeof f&&r.call(f,"__await")?e.resolve(f.__await).then((function(t){n("next",t,a,s)}),(function(t){n("throw",t,a,s)})):e.resolve(f).then((function(t){h.value=t,a(h)}),(function(t){return n("throw",t,a,s)}))}s(u.arg)}(o,i,n,a)}))}return n=n?n.then(a,a):a()}}function b(t,e){var r=t.iterator[e.method];if(void 0===r){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=void 0,b(t,e),"throw"===e.method))return u;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return u}var n=c(r,t.iterator,e.arg);if("throw"===n.type)return e.method="throw",e.arg=n.arg,e.delegate=null,u;var o=n.arg;return o?o.done?(e[t.resultName]=o.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,u):o:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,u)}function x(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function w(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function j(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(x,this),this.reset(!0)}function O(t){if(t){var e=t[o];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var n=-1,i=function e(){for(;++n<t.length;)if(r.call(t,n))return e.value=t[n],e.done=!1,e;return e.value=void 0,e.done=!0,e};return i.next=i}}return{next:z}}function z(){return{value:void 0,done:!0}}return f.prototype=g.constructor=l,l.constructor=f,l[a]=f.displayName="GeneratorFunction",t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===f||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,l):(t.__proto__=l,a in t||(t[a]="GeneratorFunction")),t.prototype=Object.create(g),t},t.awrap=function(t){return{__await:t}},d(m.prototype),m.prototype[i]=function(){return this},t.AsyncIterator=m,t.async=function(e,r,n,o,i){void 0===i&&(i=Promise);var a=new m(s(e,r,n,o),i);return t.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},d(g),g[a]="Generator",g[o]=function(){return this},g.toString=function(){return"[object Generator]"},t.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){for(;e.length;){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r}return r.done=!0,r}},t.values=O,j.prototype={constructor:j,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(w),!t)for(var e in this)"t"===e.charAt(0)&&r.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(r,n){return a.type="throw",a.arg=t,e.next=r,n&&(e.method="next",e.arg=void 0),!!n}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],a=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var s=r.call(i,"catchLoc"),c=r.call(i,"finallyLoc");if(s&&c){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(s){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,u):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),u},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),w(r),u}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;w(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:O(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=void 0),u}},t}(t.exports);try{regeneratorRuntime=n}catch(t){Function("r","regeneratorRuntime = r")(n)}},function(t,e,r){var n=r(0);Array.prototype.contains=function(t){return this.indexOf(t)>-1},Array.prototype.equals=function(t){for(var e=0;e<this.length;e++)if(e>=t.length||t[e]!==this[e])return!1;return!0},t.exports=function(t,e){var r=function(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],r={g:"F",b:"B",r:"R",o:"L",w:"U",y:"D"};if(r[t])return"".concat(r[t]).concat(e?"":"'");throw new Error("Invalid face color with letter ".concat(t))},o=function(t,e){var r=n.faces[t];if(!r)throw new Error("Invalid axis ".concat(t));if(0===e)return r.start;if(2===e)return r.end;throw new Error("Invalid axis position ".concat(e,", axis position must be 0 or 2"))},i=function(t){for(var e=0;e<3;e++)for(var r=0;r<3;r++)for(var n=0;n<3;n++)if(null!=t(e,r,n))return},a=function(e,r){var n=!0,o=Object.values(t.cube[r.x][r.y][r.z]);return Object.values(e).forEach((function(t){o.contains(t)||(n=!1)})),n},s=function(t){return 1===t.length?t+"'":t[0]},c=function(t){var n,o,i=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],a={g:"o",o:"b",b:"r",r:"g"},c={g:"r",r:"b",b:"o",o:"g"};i?(n=r(a[t]),o=r("y")):(n=r(c[t],!1),o=r("y",!1)),e(n),e(o),e(s(n)),e(s(o))},u=function(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],r=[t.x,t.z];if(e){if(r.equals([0,0]))return"g";if(r.equals([2,0]))return"r";if(r.equals([2,2]))return"b";if(r.equals([0,2]))return"o"}else{if(r.equals([0,0]))return"o";if(r.equals([0,2]))return"b";if(r.equals([2,2]))return"r";if(r.equals([2,0]))return"g"}throw new Error("Given piece position (".concat(t.x,", ").concat(t.y,", ").concat(t.z,") is not a corner piece."))},h=function n(s){i((function(c,u,h){var f=t.cube[c][u][h],l=Object.values(f);if(2===l.length&&l.contains("w")&&l.contains(s)){var p,v,y={r:{x:2,z:1},g:{x:1,z:0},o:{x:0,z:1},b:{x:1,z:2}},g={x:c,y:u,z:h};if(Object.keys(f).forEach((function(t){"w"===f[t]?p=[t,g[t]]:v=[t,g[t]]})),2===u&&"y"!==p[0]){var d=o(p[0],p[1]);e(r(d)),e(r(d)),n(s)}else if(0===u&&"y"!==p[0]){var m=["g","r","b","o"],b=o(p[0],p[1]),x=m[(m.indexOf(s)-1+4)%m.length],w=m.indexOf(x)-m.indexOf(b);w<0&&(w=4+w);for(var j=0;j<w;j++)e(r("y"));e(r(x,!1)),e(r(s)),e(r(x))}else if(1===u){var O=o(v[0],v[1]),z=r(O,!1);e(r(O)),i((function(n,o,i){var a=t.cube[n][o][i],c=Object.values(a);if(2===c.length&&c.contains("w")&&c.contains(s)&&0!==o)return e(r(O,!1)),e(r(O,!1)),z=r(O),!0})),e(r("y")),e(z),n(s)}else if(2===u&&"y"===p[0]){var k=y[s];if(k.y=2,!a(f,k)){var E=o(v[0],v[1]);e(r(E)),e(r(E)),n(s)}}else if(0===u&&"y"===p[0]){var L=y[s];for(L.y=0;!a(f,L);)e(r("y"));e(r(s)),e(r(s))}return!0}}))},f=function n(o,s){i((function(i,h,f){var l=t.cube[i][h][f],p=Object.values(l),v=function(e,r){return a(e,r)&&"w"===t.cube[r.x][r.y][r.z].y};if(3===p.length&&p.contains("w")&&p.contains(o)&&p.contains(s)){var y={x:i,y:h,z:f},g=function(t,e){var r=[t,e];if(r.contains("g")&&r.contains("o"))return{x:0,z:0,y:2};if(r.contains("o")&&r.contains("b"))return{x:0,z:2,y:2};if(r.contains("b")&&r.contains("r"))return{x:2,z:2,y:2};if(r.contains("r")&&r.contains("g"))return{x:2,z:0,y:2};throw new Error("Corner with colors ".concat(t," and ").concat(e," is not valid."))}(o,s);if(2===h)v(l,g)||(c(u(y)),n(o,s));else if(0===h){for(var d={x:g.x,z:g.z,y:0};!a(l,d);)e(r("y"));for(;!v(l,g);)c(u(g))}return!0}}))},l=function n(o,s){i((function(i,h,f){var l=t.cube[i][h][f],p=Object.values(l);if(2===p.length&&p.contains(o)&&p.contains(s)){var v={x:i,y:h,z:f};if(1===v.y){var y=[o,s],g=!1;(y.contains("g")&&y.contains("o")&&0===v.x&&0===v.z||y.contains("o")&&y.contains("b")&&0===v.x&&2===v.z||y.contains("b")&&y.contains("r")&&2===v.x&&2===v.z||y.contains("r")&&y.contains("g")&&2===v.x&&0===v.z)&&(g=!0);var d=!1;if(g&&(y.contains("g")&&"g"===l.z||y.contains("b")&&"b"===l.z)&&(d=!0),g&&d)return;var m=u(v),b=u(v,!1);c(m),c(b,!1),n(o,s)}else if(0===v.y){for(var x=l.y,w={g:{x:1,z:2,y:0},r:{x:0,z:1,y:0},b:{x:1,z:0,y:0},o:{x:2,z:1,y:0}}[x];!a(l,w);)e(r("y"));var j=function(t,e){var r=[t,e];if(r.contains("g")&&r.contains("o"))return{x:0,z:0,y:1};if(r.contains("o")&&r.contains("b"))return{x:0,z:2,y:1};if(r.contains("b")&&r.contains("r"))return{x:2,z:2,y:1};if(r.contains("r")&&r.contains("g"))return{x:2,z:0,y:1};throw new Error("Side piece with colors ".concat(t," and ").concat(e," is not valid."))}(o,s),O=u(j),z=u(j,!1);O!==x?(c(O),c(z,!1)):z!==x&&(c(z,!1),c(O))}return!0}}))};h("g"),h("r"),h("b"),h("o"),f("g","o"),f("o","b"),f("b","r"),f("r","g"),l("g","o"),l("o","b"),l("b","r"),l("r","g"),function n(){var o=function(e){return"y"===t.cube[e.x][e.y][e.z].y},i={left:{x:2,z:1,y:0},bottom:{x:1,z:0,y:0},right:{x:0,z:1,y:0},top:{x:1,z:2,y:0}},a=0,s=0;if(Object.keys(i).forEach((function(t){o(i[t])&&("left"===t||"right"===t?s++:"top"!==t&&"bottom"!==t||a++)})),2!==a||2!==s)if(0===a&&0===s)e(r("g")),c("g"),e(r("g",!1)),n();else if(1===a&&1===s){for(;!o(i.left)||!o(i.top);)e(r("y"));e(r("g")),c("g"),e(r("g",!1)),n()}else 2===a?(e(r("y")),n()):2===s&&(e(r("g")),c("g"),e(r("g",!1)))}(),function n(){for(var o=function(t){e(r(t)),e(r("y")),e(r(t,!1)),e(r("y")),e(r(t)),e(r("y")),e(r("y")),e(r(t,!1)),e(r("y"))},i={left:{x:2,z:1,y:0},bottom:{x:1,z:0,y:0},right:{x:0,z:1,y:0},top:{x:1,z:2,y:0}},a={left:"r",bottom:"g",right:"o",top:"b"},s=[];!(s.length>1);)e(r("y")),s=[],Object.keys(i).forEach((function(e){var r,n;r=i[e],((n=t.cube[r.x][r.y][r.z]).x?n.x:n.z)===a[e]&&s.push(e)}));if(4!==s.length)if(s.contains("left")&&s.contains("right")||s.contains("top")&&s.contains("bottom"))o("o"),n();else{var c="";s.contains("bottom")&&s.contains("left")?c="r":s.contains("left")&&s.contains("top")?c="b":s.contains("top")&&s.contains("right")?c="o":s.contains("right")&&s.contains("bottom")&&(c="g"),o(c)}}(),function t(){var n=function(t,n){e(r("y")),e(r(t)),e(r("y",!1)),e(r(n,!1)),e(r("y")),e(r(t,!1)),e(r("y",!1)),e(r(n))},o=[];if([["g","o"],["o","b"],["b","r"],["r","g"]].forEach((function(t){var e,r,n;a({x:t[0],y:t[1],z:"y"},(e=t[0],r=t[1],(n=[e,r]).contains("g")&&n.contains("o")?{x:0,z:0,y:0}:n.contains("o")&&n.contains("b")?{x:0,z:2,y:0}:n.contains("b")&&n.contains("r")?{x:2,z:2,y:0}:n.contains("r")&&n.contains("g")?{x:2,z:0,y:0}:void 0))&&o.push(t)})),4!==o.length)if(0===o.length)n("o","r"),t();else if(o.length>=1){var i,s,c=o[0];c.contains("g")&&c.contains("o")?(i="o",s="r"):c.contains("o")&&c.contains("b")?(i="b",s="g"):c.contains("b")&&c.contains("r")?(i="r",s="o"):c.contains("r")&&c.contains("g")&&(i="g",s="b"),n(i,s),t()}}(),function(){for(var n=function(){for(;"y"!==t.cube[0][0][0].y;)e(r("g")),e(r("w")),e(r("g",!1)),e(r("w",!1))},o=0;o<4;o++)n(),e(r("y",!1))}()}},function(t,e){t.exports=function(t){var e=function(t,e){for(var r=[],n=0;n<e;n++)r=r.concat(t);return r},r=t.join(";")+";",n=function(t,e){if(0!==t.length){var n=t.join(";")+";",o=e.join(";")+(e.length>1?";":"");r=r.split(n).join(o)}},o=function(t){return 1===t.length?t+"'":t[0]},i=function(t){return t.length>1&&"'"===t[1]};["L","F","R","B","F'","R'","B'","L'"].forEach((function(t){var r=[t,i(t)?"D'":"D",o(t),i(t)?"D":"D'"],a=[o(r[3]),o(r[2]),o(r[1]),o(r[0])];n(e(r,5),a),n(e(r,4),e(a,2))}));["U","D","L","R","F","B"].forEach((function(t){var e=t+"'";n([t,t,t,t],[]),n([e,e,e,e],[]),n([t,t,t,t],[e]),n([e,e,e,e],[t]),n([e,t],[]),n([t,e],[])}));var a=r.split(";");return a.pop(),a}},function(t,e,r){"use strict";var n=r(8),o=r(11);function i(){this.protocol=null,this.slashes=null,this.auth=null,this.host=null,this.port=null,this.hostname=null,this.hash=null,this.search=null,this.query=null,this.pathname=null,this.path=null,this.href=null}e.parse=b,e.resolve=function(t,e){return b(t,!1,!0).resolve(e)},e.resolveObject=function(t,e){return t?b(t,!1,!0).resolveObject(e):e},e.format=function(t){o.isString(t)&&(t=b(t));return t instanceof i?t.format():i.prototype.format.call(t)},e.Url=i;var a=/^([a-z0-9.+-]+:)/i,s=/:[0-9]*$/,c=/^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,u=["{","}","|","\\","^","`"].concat(["<",">",'"',"`"," ","\r","\n","\t"]),h=["'"].concat(u),f=["%","/","?",";","#"].concat(h),l=["/","?","#"],p=/^[+a-z0-9A-Z_-]{0,63}$/,v=/^([+a-z0-9A-Z_-]{0,63})(.*)$/,y={javascript:!0,"javascript:":!0},g={javascript:!0,"javascript:":!0},d={http:!0,https:!0,ftp:!0,gopher:!0,file:!0,"http:":!0,"https:":!0,"ftp:":!0,"gopher:":!0,"file:":!0},m=r(12);function b(t,e,r){if(t&&o.isObject(t)&&t instanceof i)return t;var n=new i;return n.parse(t,e,r),n}i.prototype.parse=function(t,e,r){if(!o.isString(t))throw new TypeError("Parameter 'url' must be a string, not "+typeof t);var i=t.indexOf("?"),s=-1!==i&&i<t.indexOf("#")?"?":"#",u=t.split(s);u[0]=u[0].replace(/\\/g,"/");var b=t=u.join(s);if(b=b.trim(),!r&&1===t.split("#").length){var x=c.exec(b);if(x)return this.path=b,this.href=b,this.pathname=x[1],x[2]?(this.search=x[2],this.query=e?m.parse(this.search.substr(1)):this.search.substr(1)):e&&(this.search="",this.query={}),this}var w=a.exec(b);if(w){var j=(w=w[0]).toLowerCase();this.protocol=j,b=b.substr(w.length)}if(r||w||b.match(/^\/\/[^@\/]+@[^@\/]+/)){var O="//"===b.substr(0,2);!O||w&&g[w]||(b=b.substr(2),this.slashes=!0)}if(!g[w]&&(O||w&&!d[w])){for(var z,k,E=-1,L=0;L<l.length;L++){-1!==(R=b.indexOf(l[L]))&&(-1===E||R<E)&&(E=R)}-1!==(k=-1===E?b.lastIndexOf("@"):b.lastIndexOf("@",E))&&(z=b.slice(0,k),b=b.slice(k+1),this.auth=decodeURIComponent(z)),E=-1;for(L=0;L<f.length;L++){var R;-1!==(R=b.indexOf(f[L]))&&(-1===E||R<E)&&(E=R)}-1===E&&(E=b.length),this.host=b.slice(0,E),b=b.slice(E),this.parseHost(),this.hostname=this.hostname||"";var q="["===this.hostname[0]&&"]"===this.hostname[this.hostname.length-1];if(!q)for(var _=this.hostname.split(/\./),C=(L=0,_.length);L<C;L++){var S=_[L];if(S&&!S.match(p)){for(var A="",I=0,P=S.length;I<P;I++)S.charCodeAt(I)>127?A+="x":A+=S[I];if(!A.match(p)){var F=_.slice(0,L),N=_.slice(L+1),T=S.match(v);T&&(F.push(T[1]),N.unshift(T[2])),N.length&&(b="/"+N.join(".")+b),this.hostname=F.join(".");break}}}this.hostname.length>255?this.hostname="":this.hostname=this.hostname.toLowerCase(),q||(this.hostname=n.toASCII(this.hostname));var U=this.port?":"+this.port:"",M=this.hostname||"";this.host=M+U,this.href+=this.host,q&&(this.hostname=this.hostname.substr(1,this.hostname.length-2),"/"!==b[0]&&(b="/"+b))}if(!y[j])for(L=0,C=h.length;L<C;L++){var G=h[L];if(-1!==b.indexOf(G)){var D=encodeURIComponent(G);D===G&&(D=escape(G)),b=b.split(G).join(D)}}var B=b.indexOf("#");-1!==B&&(this.hash=b.substr(B),b=b.slice(0,B));var H=b.indexOf("?");if(-1!==H?(this.search=b.substr(H),this.query=b.substr(H+1),e&&(this.query=m.parse(this.query)),b=b.slice(0,H)):e&&(this.search="",this.query={}),b&&(this.pathname=b),d[j]&&this.hostname&&!this.pathname&&(this.pathname="/"),this.pathname||this.search){U=this.pathname||"";var J=this.search||"";this.path=U+J}return this.href=this.format(),this},i.prototype.format=function(){var t=this.auth||"";t&&(t=(t=encodeURIComponent(t)).replace(/%3A/i,":"),t+="@");var e=this.protocol||"",r=this.pathname||"",n=this.hash||"",i=!1,a="";this.host?i=t+this.host:this.hostname&&(i=t+(-1===this.hostname.indexOf(":")?this.hostname:"["+this.hostname+"]"),this.port&&(i+=":"+this.port)),this.query&&o.isObject(this.query)&&Object.keys(this.query).length&&(a=m.stringify(this.query));var s=this.search||a&&"?"+a||"";return e&&":"!==e.substr(-1)&&(e+=":"),this.slashes||(!e||d[e])&&!1!==i?(i="//"+(i||""),r&&"/"!==r.charAt(0)&&(r="/"+r)):i||(i=""),n&&"#"!==n.charAt(0)&&(n="#"+n),s&&"?"!==s.charAt(0)&&(s="?"+s),e+i+(r=r.replace(/[?#]/g,(function(t){return encodeURIComponent(t)})))+(s=s.replace("#","%23"))+n},i.prototype.resolve=function(t){return this.resolveObject(b(t,!1,!0)).format()},i.prototype.resolveObject=function(t){if(o.isString(t)){var e=new i;e.parse(t,!1,!0),t=e}for(var r=new i,n=Object.keys(this),a=0;a<n.length;a++){var s=n[a];r[s]=this[s]}if(r.hash=t.hash,""===t.href)return r.href=r.format(),r;if(t.slashes&&!t.protocol){for(var c=Object.keys(t),u=0;u<c.length;u++){var h=c[u];"protocol"!==h&&(r[h]=t[h])}return d[r.protocol]&&r.hostname&&!r.pathname&&(r.path=r.pathname="/"),r.href=r.format(),r}if(t.protocol&&t.protocol!==r.protocol){if(!d[t.protocol]){for(var f=Object.keys(t),l=0;l<f.length;l++){var p=f[l];r[p]=t[p]}return r.href=r.format(),r}if(r.protocol=t.protocol,t.host||g[t.protocol])r.pathname=t.pathname;else{for(var v=(t.pathname||"").split("/");v.length&&!(t.host=v.shift()););t.host||(t.host=""),t.hostname||(t.hostname=""),""!==v[0]&&v.unshift(""),v.length<2&&v.unshift(""),r.pathname=v.join("/")}if(r.search=t.search,r.query=t.query,r.host=t.host||"",r.auth=t.auth,r.hostname=t.hostname||t.host,r.port=t.port,r.pathname||r.search){var y=r.pathname||"",m=r.search||"";r.path=y+m}return r.slashes=r.slashes||t.slashes,r.href=r.format(),r}var b=r.pathname&&"/"===r.pathname.charAt(0),x=t.host||t.pathname&&"/"===t.pathname.charAt(0),w=x||b||r.host&&t.pathname,j=w,O=r.pathname&&r.pathname.split("/")||[],z=(v=t.pathname&&t.pathname.split("/")||[],r.protocol&&!d[r.protocol]);if(z&&(r.hostname="",r.port=null,r.host&&(""===O[0]?O[0]=r.host:O.unshift(r.host)),r.host="",t.protocol&&(t.hostname=null,t.port=null,t.host&&(""===v[0]?v[0]=t.host:v.unshift(t.host)),t.host=null),w=w&&(""===v[0]||""===O[0])),x)r.host=t.host||""===t.host?t.host:r.host,r.hostname=t.hostname||""===t.hostname?t.hostname:r.hostname,r.search=t.search,r.query=t.query,O=v;else if(v.length)O||(O=[]),O.pop(),O=O.concat(v),r.search=t.search,r.query=t.query;else if(!o.isNullOrUndefined(t.search)){if(z)r.hostname=r.host=O.shift(),(q=!!(r.host&&r.host.indexOf("@")>0)&&r.host.split("@"))&&(r.auth=q.shift(),r.host=r.hostname=q.shift());return r.search=t.search,r.query=t.query,o.isNull(r.pathname)&&o.isNull(r.search)||(r.path=(r.pathname?r.pathname:"")+(r.search?r.search:"")),r.href=r.format(),r}if(!O.length)return r.pathname=null,r.search?r.path="/"+r.search:r.path=null,r.href=r.format(),r;for(var k=O.slice(-1)[0],E=(r.host||t.host||O.length>1)&&("."===k||".."===k)||""===k,L=0,R=O.length;R>=0;R--)"."===(k=O[R])?O.splice(R,1):".."===k?(O.splice(R,1),L++):L&&(O.splice(R,1),L--);if(!w&&!j)for(;L--;L)O.unshift("..");!w||""===O[0]||O[0]&&"/"===O[0].charAt(0)||O.unshift(""),E&&"/"!==O.join("/").substr(-1)&&O.push("");var q,_=""===O[0]||O[0]&&"/"===O[0].charAt(0);z&&(r.hostname=r.host=_?"":O.length?O.shift():"",(q=!!(r.host&&r.host.indexOf("@")>0)&&r.host.split("@"))&&(r.auth=q.shift(),r.host=r.hostname=q.shift()));return(w=w||r.host&&O.length)&&!_&&O.unshift(""),O.length?r.pathname=O.join("/"):(r.pathname=null,r.path=null),o.isNull(r.pathname)&&o.isNull(r.search)||(r.path=(r.pathname?r.pathname:"")+(r.search?r.search:"")),r.auth=t.auth||r.auth,r.slashes=r.slashes||t.slashes,r.href=r.format(),r},i.prototype.parseHost=function(){var t=this.host,e=s.exec(t);e&&(":"!==(e=e[0])&&(this.port=e.substr(1)),t=t.substr(0,t.length-e.length)),t&&(this.hostname=t)}},function(t,e,r){(function(t,n){var o;!function(i){e&&e.nodeType,t&&t.nodeType;var a="object"==typeof n&&n;a.global!==a&&a.window!==a&&a.self;var s,c=2147483647,u=/^xn--/,h=/[^\x20-\x7E]/,f=/[\x2E\u3002\uFF0E\uFF61]/g,l={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},p=Math.floor,v=String.fromCharCode;function y(t){throw new RangeError(l[t])}function g(t,e){for(var r=t.length,n=[];r--;)n[r]=e(t[r]);return n}function d(t,e){var r=t.split("@"),n="";return r.length>1&&(n=r[0]+"@",t=r[1]),n+g((t=t.replace(f,".")).split("."),e).join(".")}function m(t){for(var e,r,n=[],o=0,i=t.length;o<i;)(e=t.charCodeAt(o++))>=55296&&e<=56319&&o<i?56320==(64512&(r=t.charCodeAt(o++)))?n.push(((1023&e)<<10)+(1023&r)+65536):(n.push(e),o--):n.push(e);return n}function b(t){return g(t,(function(t){var e="";return t>65535&&(e+=v((t-=65536)>>>10&1023|55296),t=56320|1023&t),e+=v(t)})).join("")}function x(t,e){return t+22+75*(t<26)-((0!=e)<<5)}function w(t,e,r){var n=0;for(t=r?p(t/700):t>>1,t+=p(t/e);t>455;n+=36)t=p(t/35);return p(n+36*t/(t+38))}function j(t){var e,r,n,o,i,a,s,u,h,f,l,v=[],g=t.length,d=0,m=128,x=72;for((r=t.lastIndexOf("-"))<0&&(r=0),n=0;n<r;++n)t.charCodeAt(n)>=128&&y("not-basic"),v.push(t.charCodeAt(n));for(o=r>0?r+1:0;o<g;){for(i=d,a=1,s=36;o>=g&&y("invalid-input"),((u=(l=t.charCodeAt(o++))-48<10?l-22:l-65<26?l-65:l-97<26?l-97:36)>=36||u>p((c-d)/a))&&y("overflow"),d+=u*a,!(u<(h=s<=x?1:s>=x+26?26:s-x));s+=36)a>p(c/(f=36-h))&&y("overflow"),a*=f;x=w(d-i,e=v.length+1,0==i),p(d/e)>c-m&&y("overflow"),m+=p(d/e),d%=e,v.splice(d++,0,m)}return b(v)}function O(t){var e,r,n,o,i,a,s,u,h,f,l,g,d,b,j,O=[];for(g=(t=m(t)).length,e=128,r=0,i=72,a=0;a<g;++a)(l=t[a])<128&&O.push(v(l));for(n=o=O.length,o&&O.push("-");n<g;){for(s=c,a=0;a<g;++a)(l=t[a])>=e&&l<s&&(s=l);for(s-e>p((c-r)/(d=n+1))&&y("overflow"),r+=(s-e)*d,e=s,a=0;a<g;++a)if((l=t[a])<e&&++r>c&&y("overflow"),l==e){for(u=r,h=36;!(u<(f=h<=i?1:h>=i+26?26:h-i));h+=36)j=u-f,b=36-f,O.push(v(x(f+j%b,0))),u=p(j/b);O.push(v(x(u,0))),i=w(r,d,n==o),r=0,++n}++r,++e}return O.join("")}s={version:"1.4.1",ucs2:{decode:m,encode:b},decode:j,encode:O,toASCII:function(t){return d(t,(function(t){return h.test(t)?"xn--"+O(t):t}))},toUnicode:function(t){return d(t,(function(t){return u.test(t)?j(t.slice(4).toLowerCase()):t}))}},void 0===(o=function(){return s}.call(e,r,e,t))||(t.exports=o)}()}).call(this,r(9)(t),r(10))},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t}},function(t,e){var r;r=function(){return this}();try{r=r||new Function("return this")()}catch(t){"object"==typeof window&&(r=window)}t.exports=r},function(t,e,r){"use strict";t.exports={isString:function(t){return"string"==typeof t},isObject:function(t){return"object"==typeof t&&null!==t},isNull:function(t){return null===t},isNullOrUndefined:function(t){return null==t}}},function(t,e,r){"use strict";e.decode=e.parse=r(13),e.encode=e.stringify=r(14)},function(t,e,r){"use strict";function n(t,e){return Object.prototype.hasOwnProperty.call(t,e)}t.exports=function(t,e,r,i){e=e||"&",r=r||"=";var a={};if("string"!=typeof t||0===t.length)return a;var s=/\+/g;t=t.split(e);var c=1e3;i&&"number"==typeof i.maxKeys&&(c=i.maxKeys);var u=t.length;c>0&&u>c&&(u=c);for(var h=0;h<u;++h){var f,l,p,v,y=t[h].replace(s,"%20"),g=y.indexOf(r);g>=0?(f=y.substr(0,g),l=y.substr(g+1)):(f=y,l=""),p=decodeURIComponent(f),v=decodeURIComponent(l),n(a,p)?o(a[p])?a[p].push(v):a[p]=[a[p],v]:a[p]=v}return a};var o=Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)}},function(t,e,r){"use strict";var n=function(t){switch(typeof t){case"string":return t;case"boolean":return t?"true":"false";case"number":return isFinite(t)?t:"";default:return""}};t.exports=function(t,e,r,s){return e=e||"&",r=r||"=",null===t&&(t=void 0),"object"==typeof t?i(a(t),(function(a){var s=encodeURIComponent(n(a))+r;return o(t[a])?i(t[a],(function(t){return s+encodeURIComponent(n(t))})).join(e):s+encodeURIComponent(n(t[a]))})).join(e):s?encodeURIComponent(n(s))+r+encodeURIComponent(n(t)):""};var o=Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)};function i(t,e){if(t.map)return t.map(e);for(var r=[],n=0;n<t.length;n++)r.push(e(t[n],n));return r}var a=Object.keys||function(t){var e=[];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&e.push(r);return e}},function(t,e,r){"use strict";r.r(e);r.p,r(1),r(2),r(3);function n(t,e,r,n,o,i,a){try{var s=t[i](a),c=s.value}catch(t){return void r(t)}s.done?e(c):Promise.resolve(c).then(n,o)}function o(t){return function(){var e=this,r=arguments;return new Promise((function(o,i){var a=t.apply(e,r);function s(t){n(a,o,i,s,c,"next",t)}function c(t){n(a,o,i,s,c,"throw",t)}s(void 0)}))}}r(4);var i=r(0),a=r(5),s=r(6),c=r(7),u=new i;document.querySelectorAll(".col:first-child .moves .content .move-buttons .row .move").forEach((function(t){var e=t.querySelector("button"),r=t.querySelector("p strong").innerText,n=r.toUpperCase().charCodeAt(0),o=e.innerText;e.addEventListener("focus",(function(){var t=this;setTimeout((function(){t===document.activeElement&&t.blur()}),150)})),e.addEventListener("click",(function(){h(o)})),document.addEventListener("keydown",(function(t){if(void 0!==t.key){if(t.key.toLowerCase()!==r.toLowerCase())return}else{if(void 0===t.keyCode)return;if(t.keyCode!==n)return}h(o)}))})),window.addEventListener("load",o(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:case"end":return t.stop()}}),t)})))),document.addEventListener("keydown",function(){var t=o(regeneratorRuntime.mark((function t(e){var r,n,c,h;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if("b"!=e.key){t.next=11;break}if(r=[],n=new i(u.cube),a(n,(function(t){n.makeMove(t),r.push(t)})),r=s(r),c=function(){var t=o(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return u.makeMove(r[h]),h++,t.next=4,f();case 4:h<r.length&&c();case 5:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),h=0,!(r.length>0)){t.next=11;break}return c(),t.next=11,f();case 11:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}());var h=function(){var t=o(regeneratorRuntime.mark((function t(e){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return console.log(e),u.makeMove(e),t.next=4,f();case 4:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),f=function(){var t=o(regeneratorRuntime.mark((function t(){var e;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=u.toFacesObj(),t.next=3,l(e);case 3:return document.querySelector("img.cube-image.front-view").src=t.sent,t.next=6,p(e);case 6:document.querySelector("img.cube-image.back-view").src=t.sent;case 7:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),l=function(){var t=o(regeneratorRuntime.mark((function t(e){var r;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=v({left_face:e.g,right_face:e.r,top_face:e.w}),t.next=3,g(r);case 3:return t.abrupt("return",t.sent.image_url);case 4:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),p=function(){var t=o(regeneratorRuntime.mark((function t(e){var r;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=v({left_face:e.o,right_face:e.b,top_face:e.y}),t.next=3,g(r);case 3:return t.abrupt("return",t.sent.image_url);case 4:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),v=function(t){return Object.keys(t).forEach((function(e){var r=t[e];t[e]=y(r)})),t},y=function(t){return t.forEach((function(e,r){e.forEach((function(e,n){t[r][n]=i.colors[e]}))})),t},g=function(){var t=o(regeneratorRuntime.mark((function t(e){var r,n,o,i,a;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return(r=e).large_image=!0,t.next=4,fetch("http://localhost:6556/api/",{method:"POST",headers:new Headers({"Content-Type":"application/json",Accept:"application/json"}),body:JSON.stringify(r)});case 4:if(200!==(n=t.sent).status){t.next=20;break}return t.next=8,n.json();case 8:if((o=t.sent).output_path){t.next=15;break}if(!o.error){t.next=14;break}throw new Error('HTTP Request to "'.concat("http://localhost:6556/api/",'" threw the error: "').concat(o.error,'"'));case 14:throw new Error('JSON response from "'.concat("http://localhost:6556/api/",'" did not contain the required property "output_path"'));case 15:return i=o.output_path,a=c.resolve("http://localhost:6556/api/",i),t.abrupt("return",{image_url:a});case 20:throw new Error('Response from "'.concat("http://localhost:6556/api/",'" failed with status code ').concat(n.status));case 21:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()}]);