!function t(e,n,o){function r(a,s){if(!n[a]){if(!e[a]){var c="function"==typeof require&&require;if(!s&&c)return c(a,!0);if(i)return i(a,!0);var u=new Error("Cannot find module '"+a+"'");throw u.code="MODULE_NOT_FOUND",u}var h=n[a]={exports:{}};e[a][0].call(h.exports,function(t){var n=e[a][1][t];return r(n?n:t)},h,h.exports,t,e,n,o)}return n[a].exports}for(var i="function"==typeof require&&require,a=0;a<o.length;a++)r(o[a]);return r}({1:[function(t,e,n){"use strict";var o={fontNo:"6",dpi:203};n.config=o},{}],2:[function(t){"use strict";t("./src/components/component"),t("./src/components/text"),t("./src/components/rect"),t("./src/components/ellipse"),t("./src/components/line"),t("./src/components/image"),t("./src/components/barcode"),t("./src/components/variable"),t("./src/components/scene")},{"./src/components/barcode":3,"./src/components/component":4,"./src/components/ellipse":5,"./src/components/image":6,"./src/components/line":10,"./src/components/rect":11,"./src/components/scene":12,"./src/components/text":13,"./src/components/variable":14}],3:[function(t,e,n){"use strict";function o(t,e){switch(t){case"upce":case"ean13":if(1==e)return 20;if(2==e)return 25;if(3==e)return 25;if(4==e)return 35;if(5==e)return 20;if(6==e)return 50;if(7==e)return 50;if(8==e)return 75;if(9==e)return 75;break;case"upca":if(1==e)return 10;if(2==e)return 20;if(3==e)return 25;if(4==e)return 18;if(5==e)return 28;if(6==e)return 58;if(7==e)return 90;if(8==e)return 92;if(9==e)return 95}}var r=t("../../config").config,i={1:2,2:3,3:5,4:6,5:8,6:10},a=["qrcode","pdf417","micropdf417","datamatrix","maxicode","code49"];scene.Barcode.prototype._toZpl=function(t){var e=this.model,n=e.symbol,s=e.scale_w,c=void 0===s?1:s,u=e.showText,h=void 0===u?!0:u,p=e.textAbove,f=void 0===p?"":p,l=this.labelingBounds,d=l.left,g=l.top,b=l.width,m=l.height,v=t?this.get("text"):this.text,y=this.orientation,x=[],M=2,w="R"==y||"B"==y?b:m,B=c;B=1>B?1:Math.floor(B),"ean13"!=n&&"upce"!=n&&"upca"!=n||!h||(d+=Number(o(n,B))),x.push(["^BY"+B,M]),x.push("qrcode"==n?["^FO"+d,g-10]:["^FO"+d,g]),h&&-1==a.indexOf(n)&&(w-=6*c+8);r.dpi;switch(h=h?"Y":"N",n){case"code11":x.push(["^B1"+y,,w,h,f]);break;case"interleaved2of5":x.push(["^B2"+y,w,h,f,"N"]);break;case"code39":x.push(["^B3"+y,"N",w,h,f]);break;case"code49":x.push(["^B4"+y,w,h]);break;case"planet":x.push(["^B5"+y,w,h,f]);break;case"pdf417":x.push(["^B7"+y,w,,,,]);break;case"ean8":x.push(["^B8"+y,w,h,f]);break;case"upce":x.push(["^B9"+y,w,h,f]);break;case"code93":x.push(["^BA"+y,w,h,f]);break;case"codablock":x.push(["^BB"+y,w,,,,]);break;case"code128":x.push(["^BC"+y,w,h,f,,]);break;case"maxicode":x.push(["^BD"+y,,w,h,f]);break;case"ean13":x.push(["^BE"+y,w,h,f]);break;case"micropdf417":x.push(["^BF"+y,w,"2"]);break;case"industrial2of5":x.push(["^BI"+y,w,h,f]);break;case"standard2of5":x.push(["^BJ"+y,w,h,f]);break;case"ansicodabar":x.push(["^BK"+y,,w,h,f,,]);break;case"logmars":x.push(["^BL"+y,w,f]);break;case"msi":x.push(["^BM"+y,,w,h,f,"N","N"]);break;case"plessey":x.push(["^BP"+y,"Y",w,h,f]);break;case"qrcode":B=i[Math.round(c)]?i[c]:i[6],x.push(["^BQ"+y,2,B]);break;case"upca":x.push(["^BU"+y,w,h,f]);break;case"datamatrix":x.push(["^BX"+y,1==B?2:Math.floor(1.5*B)]);break;case"postal":x.push(["^BZ"+y,w,h,f])}"qrcode"===n?(x.push(["^FDQ",v]),x.push(["^FS"])):"code39"===n?x.push(["^FD"+v+"^FS"]):"upca"==n&&7==v.length?(x.push(["^FD"+v.slice(0,6)+"0000"+v.slice(6)]),x.push(["^FS"])):(x.push(["^FD"+v]),x.push(["^FS"]));var P=x.map(function(t){return t.join(",")}).join("\n")+"\n";return P},n.Barcode=scene.Barcode},{"../../config":1}],4:[function(t,e,n){"use strict";function o(t){return"black"===t||"#000"===t||"#000000"===t}var r=t("../../config").config,i=15,a={NORMAL:"N",ROTATE_90:"R",INVERTED_180:"I",BOTTOM_UP_270:"B"};scene.Component.prototype.toZpl=function(t,e){var n=this;return new Promise(function(o,r){try{o(n._toZpl(t,e))}catch(i){r(i)}})},scene.Container.prototype.toZpl=function(t){var e=this;return new Promise(function(n,o){var r=e.components.filter(function(t){return"variable"!==t.get("type")}).map(function(e){return e.toZpl(t)});Promise.all(r).then(function(t){n(t.filter(function(t){return!!t}).join("\n"))},function(t){o(t)})})},Object.defineProperty(scene.Component.prototype,"labelingRatio",{get:function(){var t=r.dpi/2.54/10,e=.1;return t*e}}),Object.defineProperty(scene.Component.prototype,"lineColor",{get:function(){var t=this.model,e=t.strokeStyle,n=t.fillStyle;return o(e)||o(n)?"B":"W"}}),Object.defineProperty(scene.Component.prototype,"lineWidth",{get:function(){var t=this.model.lineWidth;return Math.round(t*this.labelingRatio)}}),Object.defineProperty(scene.Component.prototype,"borderThickness",{get:function(){var t=this.model,e=t.lineWidth,n=t.fill,o=this.labelingBounds,r=o.width,i=o.height;return Math.round(n?Math.min(r,i)/2:e*this.labelingRatio)}}),Object.defineProperty(scene.Component.prototype,"fontSize",{get:function(){var t=this.get("fontSize")||i;return t}}),Object.defineProperty(scene.Component.prototype,"labelingTextBounds",{get:function(){var t=this.textBounds,e=t.left,n=t.top,o=t.width,r=t.height;r=this.get("fontSize")||DEFAULT.FONT_SIZE;var i=this.transcoordS2T(e,n),a=this.transcoordS2T(e+o,n+r),e=Math.min(i.x,a.x)*this.labelingRatio,n=Math.min(i.y,a.y)*this.labelingRatio,o=Math.abs(a.x-i.x)*this.labelingRatio,r=Math.abs(a.y-i.y)*this.labelingRatio;return{left:Math.round(e),top:Math.round(n),width:Math.round(o),height:Math.round(r)}}}),Object.defineProperty(scene.Component.prototype,"labelingBounds",{get:function(){var t=this.bounds,e=t.left,n=t.top,o=t.width,r=t.height,i=this.transcoordS2T(e,n),a=this.transcoordS2T(e+o,n+r),e=Math.min(i.x,a.x)*this.labelingRatio,n=Math.min(i.y,a.y)*this.labelingRatio,o=Math.abs(a.x-i.x)*this.labelingRatio,r=Math.abs(a.y-i.y)*this.labelingRatio;return{left:Math.round(e),top:Math.round(n),width:Math.round(o),height:Math.round(r)}}}),Object.defineProperty(scene.Component.prototype,"absoluteRotation",{get:function(){for(var t=0,e=this;e;)t+=e.get("rotation")||0,e=e.parent;return t}}),Object.defineProperty(scene.Component.prototype,"orientation",{get:function(){var t=this.absoluteRotation%(2*Math.PI);return Math.PI*-.25<t&&t<=.25*Math.PI?a.NORMAL:.25*Math.PI<t&&t<=.75*Math.PI?a.ROTATE_90:.75*Math.PI<t&&t<=1.25*Math.PI||-1.25*Math.PI<t&&t<=Math.PI*-.75?a.INVERTED_180:Math.PI<1.25*t&&t<=1.75*Math.PI||Math.PI*-.75<t&&t<=Math.PI*-.25?a.BOTTOM_UP_270:void 0}}),n.Component=scene.Component},{"../../config":1}],5:[function(t,e,n){"use strict";t("./text"),scene.Component.prototype.toZplForEllipse=function(t,e,n){var o=t.top,r=t.left,i=t.width,a=t.height,s=this.model,c=s.fill,u=s.lineWidth,h=[],p=Math.round(u/3),f=c?p:0;return h.push(["^FO"+(r-p),o-p]),h.push(i===a?["^GC"+(i+2*p),n+f,e]:["^GE"+(i+2*p),a+2*p,n+f,e]),h.push(["^FS"]),h.map(function(t){return t.join(",")}).join("\n")+"\n"},scene.Ellipse.prototype._toZpl=function(t,e){if(!e){var n=this.toZplForEllipse(this.labelingBounds,this.lineColor,this.borderThickness);return(t?this.get("text"):this.text)&&(n+=this.toZplForText(t,e)),n}},n.Ellipse=scene.Ellipse},{"./text":13}],6:[function(t,e,n){"use strict";var o=t("../utils/to-grf");scene.ImageView.prototype.toZpl=function(t,e){var n=this;if(!e){var r=this.model.src;return new Promise(function(t,e){r||t(""),o.getGrfCommand(n.labelingBounds,"string"==typeof r?n.app.url(r):r).then(function(e){t(e)},function(){e("Image not found. Check image URL.")})})}},n.Image=scene.ImageView},{"../utils/to-grf":17}],7:[function(t,e,n){"use strict";function o(){scene.Barcode.prototype.draw=function(){}}function r(){scene.Barcode.prototype.draw=i}Object.defineProperty(n,"__esModule",{value:!0}),n.drawBarcodeBefore=o,n.drawBarcodeAfter=r;var i=scene.Barcode.prototype.draw},{}],8:[function(t,e,n){"use strict";function o(){scene.Component.prototype.drawText=function(t){return i.hasVariables(this.get("text"))?void 0:a.call(this,t)}}function r(){scene.Component.prototype.drawText=a}Object.defineProperty(n,"__esModule",{value:!0}),n.drawTextBefore=o,n.drawTextAfter=r;var i=t("../../utils/has-variables"),a=scene.Component.prototype.drawText},{"../../utils/has-variables":15}],9:[function(t,e,n){"use strict";function o(t){t&&i.drawTextBefore(),a.drawBarcodeBefore()}function r(t){a.drawBarcodeAfter(),t&&i.drawTextAfter()}Object.defineProperty(n,"__esModule",{value:!0}),n.beforeDraw=o,n.afterDraw=r;var i=t("./draw-text"),a=t("./barcode-draw")},{"./barcode-draw":7,"./draw-text":8}],10:[function(t,e,n){"use strict";t("./rect"),t("./text"),scene.Component.prototype.toZplForLine=function(t,e,n,o){var r=t.left,i=t.top,a=t.width,s=t.height,c=[["^FO"+r,i],["^GD"+a,s,n,e,o],["^FS"]];return c.map(function(t){return t.join(",")}).join("\n")+"\n"},scene.Line.prototype._toZpl=function(t,e){if(!e){var n,o=this.labelingBounds;if(o.width<.5||o.height<.5)0==o.width?(o.left-=this.borderThickness/2,o.width+=this.borderThickness/2):0==o.height&&(o.top-=this.borderThickness/2,o.height+=this.borderThickness/2),n=this.toZplForRect(o,this.lineColor,this.borderThickness,0);else{var r=this.model,i=r.x1,a=r.x2,s=r.y1,c=r.y2,u=this.transcoordS2T(i,s),h=this.transcoordS2T(a,c),p=(u.x-h.x)*(u.y-h.y)>0?"L":"R";n=this.toZplForLine(o,this.lineColor,this.lineWidth,p)}return(t?this.get("text"):this.text)&&(n+=this.toZplForText(t,e)),n}},n.Line=scene.Line},{"./rect":11,"./text":13}],11:[function(t,e,n){"use strict";t("./text"),scene.Component.prototype.toZplForRect=function(t,e,n,o){var r=t.top,i=t.left,a=t.width,s=t.height,c=this.model,u=c.fill,h=c.lineWidth,p=c.type,f="rect"==p?Math.round(h/3):0,l=u?f:0,d=[["^FO"+(i-f),r-f],["^GB"+(a+2*f),s+2*f,n+l,e,Math.round(8*o/100)],["^FS"]];return d.map(function(t){return t.join(",")}).join("\n")+"\n"},scene.Rect.prototype._toZpl=function(t,e){if(!e){var n=this.model.round,o=void 0===n?0:n,r=this.toZplForRect(this.labelingBounds,this.lineColor,this.borderThickness,o);return(t?this.get("text"):this.text)&&(r+=this.toZplForText(t,e)),r}},n.Rect=scene.Rect},{"./text":13}],12:[function(t,e,n){"use strict";var o=t("../utils/to-grf"),r=t("./interceptors"),i=t("../../config").config;scene.Scene.prototype.toGRF=function(){var t=this.root.bounds,e=this.root.labelingRatio;return t.width=Math.round(t.width*e),t.height=Math.round(t.height*e),o.getGrfCommand(t,this.toDataURL(void 0,void 0,t.width,t.height))},scene.Scene.prototype.toTemplateGRF=function(t){var e=this,n=[];return this.root.traverse(function(t){"variable"!==t.get("type")&&(n.push(new Promise(function(e,n){t.prepare(e,n)})),n.push(new Promise(function(e,n){t.prepareFill(e,n)})))},this),new Promise(function(i,a){Promise.all(n).then(function(){var n=e.root.bounds,s=n.left,c=n.top,u=n.width,h=n.height,p=e.root.labelingRatio,f=Math.round(s*p),l=Math.round(c*p),d=Math.round(u*p),g=Math.round(h*p),b=scene.Component.createCanvas(d*scene.DPPX,g*scene.DPPX),m=e.root.get("translate"),v=e.root.get("scale");e.root.set("translate",{x:0,y:0}),e.root.set("scale",{x:d/u,y:g/h});var y=b.getContext("2d");r.beforeDraw(t),e.root.draw(y),r.afterDraw(t),e.root.set("translate",m),e.root.set("scale",v);var x=[];x.push(o.getGrfCommand({left:f,top:l,width:d,height:g},b.toDataURL())),t&&e.root.components.filter(function(t){return"variable"!==t.get("type")}).forEach(function(e){x.push(e.toZpl(t,!0))}),Promise.all(x).then(function(t){i(t.filter(function(t){return!!t}).join("\n"))},function(t){a(t)})},function(t){console.error(t),a(t)})})},scene.Scene.prototype.toZpl=function(t,e,n,o){var r=this,a=i.dpi;n&&(i.dpi=n);var s=Number(this.root.get("width"))/100;return new Promise(function(n,c){e?r.toTemplateGRF(t).then(function(t){var e=Math.round(s/2.54*i.dpi);n(["^XA","^PW"+e+"\n",o,t,"^XZ"].join("\n")),i.dpi=a},function(t){c(t),i.dpi=a}):r.root.toZpl(t,e).then(function(t){var e=Math.round(s/2.54*i.dpi);n(["^XA","^PW"+e+"\n",o,t,"^XZ"].join("\n")),i.dpi=a},function(t){c(t),i.dpi=a})})},n.Scene=scene.Scene},{"../../config":1,"../utils/to-grf":17,"./interceptors":9}],13:[function(t,e,n){"use strict";var o=t("../utils/has-variables"),r=(t("../../config").config,100);scene.Component.prototype.toZplForText=function(t,e){if(!e||o.hasVariables(this.get("text"))){var n,i=this.model,a=i.textAlign,s=(i.textBaseline,i.fontCode),c=void 0===s?"6":s,u=i.textWrap,h=void 0===u?!1:u,p=this.labelingTextBounds,f=p.left,l=p.top,d=p.width,g=(p.height,this.orientation),b=Math.round((this.lineHeight-this.fontSize)*this.labelingRatio),m=t?this.get("text"):this.text,v=this.fontSize*this.labelingRatio,y=this.fontSize*this.labelingRatio,x=c;switch(a){case"right":n="R";break;case"justify":n="J";break;case"center":n="C";break;case"left":default:n="L"}var M=0;-1!=m.indexOf("\n")&&(m=m.replace(/\n/g,"\\&\n"));var w=[["^FO"+f,l],["^A"+x+g,Math.round(v),Math.round(y)]];return h&&w.push(["^FB"+d,r,b,n,M]),w.push(["^FD"+m]),w.push(["^FS"]),w.map(function(t){return t.join(",")}).join("\n")+"\n"}},scene.Text.prototype._toZpl=function(t,e){return this.toZplForText(t,e)},n.Text=scene.Text},{"../../config":1,"../utils/has-variables":15}],14:[function(t,e,n){"use strict";scene.Variable.prototype._toZpl=function(){return""},n.Variable=scene.Variable},{}],15:[function(t,e,n){"use strict";function o(t){return t?-1!==t.search(/#{(\S*)}/)?!0:-1!==t.search(/\${[^}]*}/)?!0:!1:!1}Object.defineProperty(n,"__esModule",{value:!0}),n.hasVariables=o},{}],16:[function(t,e,n){"use strict";function o(t,e,n){for(var o=[],r=0;e>r;r++)for(var i=0;t>i;i++){var a=4*(t*r+i),s=.21*n[a+c]+.71*n[a+u]+.07*n[a+h];s+=(255-n[a+p])*(255-s)/255,o[a+c]=s,o[a+u]=s,o[a+h]=s,o[a+p]=n[a+p]}return o}function r(t,e,n){for(var o=[],r=0;s>r;r++)o[r]=0;for(var i=0;e>i;i++)for(var a=0;t>a;a++){var u=4*(t*i+a),h=Math.round(n[u+c]);o[h]++}return o}function i(t,e,n){for(var o=r(t,e,n),i=0,a=0;s>a;a++)i+=a*o[a];for(var c=0,u=0,h=0,p=0,f=0,l=t*e,d=0;s>d;d++)if(u+=o[d],0!=u){if(h=l-u,0==h)break;c+=d*o[d];var g=c/u,b=(i-c)/h,m=u*h*(g-b)*(g-b);m>p&&(p=m,f=d)}return f}function a(t,e,n){for(var r=o(t,e,n),a=i(t,e,r),s=[],f=0;e>f;f++)for(var l=0;t>l;l++){var d=4*(f*t+l);r[d]>a?(s[d+c]=255,s[d+u]=255,s[d+h]=255):(s[d+c]=0,s[d+u]=0,s[d+h]=0),s[d+p]=r[d+p]}return s}Object.defineProperty(n,"__esModule",{value:!0}),n.binarize=a;var s=256,c=0,u=1,h=2,p=3},{}],17:[function(t,e,n){"use strict";function o(){function t(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return t()+t()+t()+t()+t()+t()+t()+t()}function r(t){return parseInt(t,2).toString(16).toUpperCase()||""}function i(t,e,n){for(var o="",i=Math.ceil(t/8),a=0;e>a;a++){for(var s="",c=0,u=0;t>u;u++)s+=0==n[4*(t*a+u)+1]?"1":"0",s.length>7&&(o+=r(s.substring(0,4))+r(s.substring(4,8)),s="",c++);if(s.length>0){for(;s.length<8;)s+="0";o+=r(s.substring(0,4))+r(s.substring(4,8)),s="",c++}for(;c++<i;)o+=r("0000")+r("0000");o+="\n"}return i*e+","+i+","+o}function a(t,e,n){var o;"undefined"==typeof document?o=new Canvas(t,e):(o=document.createElement("canvas"),o.width=t,o.height=e);var r=new Image,a=new Promise(function(n,a){r.onload=function(){var a=o.getContext("2d");a.drawImage(r,0,0,this.width,this.height,0,0,t,e);var s=a.getImageData(0,0,t,e),u=s.data,h=i(t,e,c.binarize(t,e,u));"undefined"!=typeof document&&o.remove(),n(h)},r.onerror=function(t){o.remove(),a(t)}});return r.crossOrigin="use-credentials",r.src=n,a}function s(t,e){return new Promise(function(n,r){a(Math.round(t.width),Math.round(t.height),e).then(function(e){var r=o(),i=[["~DG"+r,e],["^FO"+Math.round(t.left),Math.round(t.top)],["^XGR:"+r,1,1],["^PQ1"],["^FS"]],a=i.map(function(t){return t.join(",")}).join("\n")+"\n";n(a)},function(t){r(t)})})}Object.defineProperty(n,"__esModule",{value:!0}),n.getImageGrf=a,n.getGrfCommand=s;var c=t("./rgb-binarize")},{"./rgb-binarize":16}]},{},[2]);