!function t(e,n,o){function r(s,a){if(!n[s]){if(!e[s]){var c="function"==typeof require&&require;if(!a&&c)return c(s,!0);if(i)return i(s,!0);var u=new Error("Cannot find module '"+s+"'");throw u.code="MODULE_NOT_FOUND",u}var h=n[s]={exports:{}};e[s][0].call(h.exports,function(t){var n=e[s][1][t];return r(n?n:t)},h,h.exports,t,e,n,o)}return n[s].exports}for(var i="function"==typeof require&&require,s=0;s<o.length;s++)r(o[s]);return r}({1:[function(t,e,n){"use strict";var o={fontNo:"6",dpi:203};n.config=o},{}],2:[function(t){"use strict";t("./src/components/component"),t("./src/components/text"),t("./src/components/rect"),t("./src/components/ellipse"),t("./src/components/line"),t("./src/components/image"),t("./src/components/barcode"),t("./src/components/variable"),t("./src/components/scene")},{"./src/components/barcode":3,"./src/components/component":4,"./src/components/ellipse":5,"./src/components/image":6,"./src/components/line":10,"./src/components/rect":11,"./src/components/scene":12,"./src/components/text":13,"./src/components/variable":14}],3:[function(t,e,n){"use strict";function o(t,e){switch(t){case"upce":case"ean13":if(1==e)return 20;if(2==e)return 25;if(3==e)return 25;if(4==e)return 35;if(5==e)return 20;if(6==e)return 50;if(7==e)return 50;if(8==e)return 75;if(9==e)return 75;break;case"upca":if(1==e)return 10;if(2==e)return 20;if(3==e)return 25;if(4==e)return 18;if(5==e)return 28;if(6==e)return 58;if(7==e)return 90;if(8==e)return 92;if(9==e)return 95}}var r=t("../../config").config,i={1:2,2:3,3:5,4:6,5:8,6:10},s=["qrcode","pdf417","micropdf417","datamatrix","maxicode","code49"];scene.Barcode.prototype._toZpl=function(t){var e=this.model,n=e.symbol,a=e.scale_w,c=void 0===a?1:a,u=e.showText,h=void 0===u?!0:u,p=e.textAbove,f=void 0===p?"":p,l=this.labelingBounds,d=l.left,g=l.top,b=l.width,m=l.height,v=t?this.get("text"):this.text,y=this.orientation,x=[],M=2,w="R"==y||"B"==y?b:m,B=c;B=1>B?1:Math.floor(B),"ean13"!=n&&"upce"!=n&&"upca"!=n||!h||(d+=Number(o(n,B))),x.push(["^BY"+B,M]),x.push("qrcode"==n?["^FO"+d,g-10]:["^FO"+d,g]),h&&-1==s.indexOf(n)&&(w-=6*c+8);r.dpi;switch(h=h?"Y":"N",n){case"code11":x.push(["^B1"+y,,w,h,f]);break;case"interleaved2of5":x.push(["^B2"+y,w,h,f,"N"]);break;case"code39":x.push(["^B3"+y,"N",w,h,f]);break;case"code49":x.push(["^B4"+y,w,h]);break;case"planet":x.push(["^B5"+y,w,h,f]);break;case"pdf417":x.push(["^B7"+y,w,,,,]);break;case"ean8":x.push(["^B8"+y,w,h,f]);break;case"upce":x.push(["^B9"+y,w,h,f]);break;case"code93":x.push(["^BA"+y,w,h,f]);break;case"codablock":x.push(["^BB"+y,w,,,,]);break;case"code128":x.push(["^BC"+y,w,h,f,,]);break;case"maxicode":x.push(["^BD"+y,,w,h,f]);break;case"ean13":x.push(["^BE"+y,w,h,f]);break;case"micropdf417":x.push(["^BF"+y,w,"2"]);break;case"industrial2of5":x.push(["^BI"+y,w,h,f]);break;case"standard2of5":x.push(["^BJ"+y,w,h,f]);break;case"ansicodabar":x.push(["^BK"+y,,w,h,f,,]);break;case"logmars":x.push(["^BL"+y,w,f]);break;case"msi":x.push(["^BM"+y,,w,h,f,"N","N"]);break;case"plessey":x.push(["^BP"+y,"Y",w,h,f]);break;case"qrcode":B=i[Math.round(c)]?i[c]:i[6],x.push(["^BQ"+y,2,B]);break;case"upca":x.push(["^BU"+y,w,h,f]);break;case"datamatrix":x.push(["^BX"]);break;case"postal":x.push(["^BZ"+y,w,h,f])}"qrcode"===n?(x.push(["^FDQ","A"+v]),x.push(["^FS"])):"code39"===n?x.push(["^FD"+v+"^FS"]):"upca"==n&&7==v.length?(x.push(["^FD"+v.slice(0,6)+"0000"+v.slice(6)]),x.push(["^FS"])):(x.push(["^FD"+v]),x.push(["^FS"]));var P=x.map(function(t){return t.join(",")}).join("\n")+"\n";return P},n.Barcode=scene.Barcode},{"../../config":1}],4:[function(t,e,n){"use strict";function o(t){return"black"===t||"#000"===t||"#000000"===t}var r=t("../../config").config,i=15,s={NORMAL:"N",ROTATE_90:"R",INVERTED_180:"I",BOTTOM_UP_270:"B"};scene.Component.prototype.toZpl=function(t,e){var n=this;return new Promise(function(o,r){try{o(n._toZpl(t,e))}catch(i){r(i)}})},scene.Container.prototype.toZpl=function(t){var e=this;return new Promise(function(n,o){var r=e.components.filter(function(t){return"variable"!==t.get("type")}).map(function(e){return e.toZpl(t)});Promise.all(r).then(function(t){n(t.filter(function(t){return!!t}).join("\n"))},function(t){o(t)})})},Object.defineProperty(scene.Component.prototype,"labelingRatio",{get:function(){var t=r.dpi/2.54/10,e=.1;return t*e}}),Object.defineProperty(scene.Component.prototype,"lineColor",{get:function(){var t=this.model,e=t.strokeStyle,n=t.fillStyle;return o(e)||o(n)?"B":"W"}}),Object.defineProperty(scene.Component.prototype,"lineWidth",{get:function(){var t=this.model.lineWidth;return Math.round(t*this.labelingRatio)}}),Object.defineProperty(scene.Component.prototype,"borderThickness",{get:function(){var t=this.model,e=t.lineWidth,n=t.fill,o=this.labelingBounds,r=o.width,i=o.height;return Math.round(n?Math.min(r,i)/2:e*this.labelingRatio)}}),Object.defineProperty(scene.Component.prototype,"fontSize",{get:function(){var t=this.get("fontSize")||i;return t}}),Object.defineProperty(scene.Component.prototype,"labelingTextBounds",{get:function(){var t=this.textBounds,e=t.left,n=t.top,o=t.width,r=t.height;r=this.get("fontSize")||DEFAULT.FONT_SIZE;var i=this.transcoordS2T(e,n),s=this.transcoordS2T(e+o,n+r),e=Math.min(i.x,s.x)*this.labelingRatio,n=Math.min(i.y,s.y)*this.labelingRatio,o=Math.abs(s.x-i.x)*this.labelingRatio,r=Math.abs(s.y-i.y)*this.labelingRatio;return{left:Math.round(e),top:Math.round(n),width:Math.round(o),height:Math.round(r)}}}),Object.defineProperty(scene.Component.prototype,"labelingBounds",{get:function(){var t=this.bounds,e=t.left,n=t.top,o=t.width,r=t.height,i=this.transcoordS2T(e,n),s=this.transcoordS2T(e+o,n+r),e=Math.min(i.x,s.x)*this.labelingRatio,n=Math.min(i.y,s.y)*this.labelingRatio,o=Math.abs(s.x-i.x)*this.labelingRatio,r=Math.abs(s.y-i.y)*this.labelingRatio;return{left:Math.round(e),top:Math.round(n),width:Math.round(o),height:Math.round(r)}}}),Object.defineProperty(scene.Component.prototype,"absoluteRotation",{get:function(){for(var t=0,e=this;e;)t+=e.get("rotation")||0,e=e.parent;return t}}),Object.defineProperty(scene.Component.prototype,"orientation",{get:function(){var t=this.absoluteRotation%(2*Math.PI);return Math.PI*-.25<t&&t<=.25*Math.PI?s.NORMAL:.25*Math.PI<t&&t<=.75*Math.PI?s.ROTATE_90:.75*Math.PI<t&&t<=1.25*Math.PI||-1.25*Math.PI<t&&t<=Math.PI*-.75?s.INVERTED_180:Math.PI<1.25*t&&t<=1.75*Math.PI||Math.PI*-.75<t&&t<=Math.PI*-.25?s.BOTTOM_UP_270:void 0}}),n.Component=scene.Component},{"../../config":1}],5:[function(t,e,n){"use strict";t("./text"),scene.Component.prototype.toZplForEllipse=function(t,e,n){var o=t.top,r=t.left,i=t.width,s=t.height,a=this.model,c=a.fill,u=a.lineWidth,h=[],p=Math.round(u/3),f=c?p:0;return h.push(["^FO"+(r-p),o-p]),h.push(i===s?["^GC"+(i+2*p),n+f,e]:["^GE"+(i+2*p),s+2*p,n+f,e]),h.push(["^FS"]),h.map(function(t){return t.join(",")}).join("\n")+"\n"},scene.Ellipse.prototype._toZpl=function(t,e){if(!e){var n=this.toZplForEllipse(this.labelingBounds,this.lineColor,this.borderThickness);return(t?this.get("text"):this.text)&&(n+=this.toZplForText(t,e)),n}},n.Ellipse=scene.Ellipse},{"./text":13}],6:[function(t,e,n){"use strict";var o=t("../utils/to-grf");scene.ImageView.prototype.toZpl=function(t,e){var n=this;if(!e){var r=this.model.src;return new Promise(function(t,e){r||t(""),o.getGrfCommand(n.labelingBounds,"string"==typeof r?n.app.url(r):r).then(function(e){t(e)},function(){e("Image not found. Check image URL.")})})}},n.Image=scene.ImageView},{"../utils/to-grf":17}],7:[function(t,e,n){"use strict";function o(){scene.Barcode.prototype.draw=function(){}}function r(){scene.Barcode.prototype.draw=i}Object.defineProperty(n,"__esModule",{value:!0}),n.drawBarcodeBefore=o,n.drawBarcodeAfter=r;var i=scene.Barcode.prototype.draw},{}],8:[function(t,e,n){"use strict";function o(){scene.Component.prototype.drawText=function(t){return i.hasVariables(this.get("text"))?void 0:s.call(this,t)}}function r(){scene.Component.prototype.drawText=s}Object.defineProperty(n,"__esModule",{value:!0}),n.drawTextBefore=o,n.drawTextAfter=r;var i=t("../../utils/has-variables"),s=scene.Component.prototype.drawText},{"../../utils/has-variables":15}],9:[function(t,e,n){"use strict";function o(t){t&&i.drawTextBefore(),s.drawBarcodeBefore()}function r(t){s.drawBarcodeAfter(),t&&i.drawTextAfter()}Object.defineProperty(n,"__esModule",{value:!0}),n.beforeDraw=o,n.afterDraw=r;var i=t("./draw-text"),s=t("./barcode-draw")},{"./barcode-draw":7,"./draw-text":8}],10:[function(t,e,n){"use strict";t("./rect"),t("./text"),scene.Component.prototype.toZplForLine=function(t,e,n,o){var r=t.left,i=t.top,s=t.width,a=t.height,c=[["^FO"+r,i],["^GD"+s,a,n,e,o],["^FS"]];return c.map(function(t){return t.join(",")}).join("\n")+"\n"},scene.Line.prototype._toZpl=function(t,e){if(!e){var n,o=this.labelingBounds;if(o.width<.5||o.height<.5)0==o.width?(o.left-=this.borderThickness/2,o.width+=this.borderThickness/2):0==o.height&&(o.top-=this.borderThickness/2,o.height+=this.borderThickness/2),n=this.toZplForRect(o,this.lineColor,this.borderThickness,0);else{var r=this.model,i=r.x1,s=r.x2,a=r.y1,c=r.y2,u=this.transcoordS2T(i,a),h=this.transcoordS2T(s,c),p=(u.x-h.x)*(u.y-h.y)>0?"L":"R";n=this.toZplForLine(o,this.lineColor,this.lineWidth,p)}return(t?this.get("text"):this.text)&&(n+=this.toZplForText(t,e)),n}},n.Line=scene.Line},{"./rect":11,"./text":13}],11:[function(t,e,n){"use strict";t("./text"),scene.Component.prototype.toZplForRect=function(t,e,n,o){var r=t.top,i=t.left,s=t.width,a=t.height,c=this.model,u=c.fill,h=c.lineWidth,p=c.type,f="rect"==p?Math.round(h/3):0,l=u?f:0,d=[["^FO"+(i-f),r-f],["^GB"+(s+2*f),a+2*f,n+l,e,Math.round(8*o/100)],["^FS"]];return d.map(function(t){return t.join(",")}).join("\n")+"\n"},scene.Rect.prototype._toZpl=function(t,e){if(!e){var n=this.model.round,o=void 0===n?0:n,r=this.toZplForRect(this.labelingBounds,this.lineColor,this.borderThickness,o);return(t?this.get("text"):this.text)&&(r+=this.toZplForText(t,e)),r}},n.Rect=scene.Rect},{"./text":13}],12:[function(t,e,n){"use strict";var o=t("../utils/to-grf"),r=t("./interceptors"),i=t("../../config").config;scene.Scene.prototype.toGRF=function(){var t=this.root.bounds,e=this.root.labelingRatio;return t.width=Math.round(t.width*e),t.height=Math.round(t.height*e),o.getGrfCommand(t,this.toDataURL(void 0,void 0,t.width,t.height))},scene.Scene.prototype.toTemplateGRF=function(t){var e=this,n=[];return this.root.traverse(function(t){"variable"!==t.get("type")&&(n.push(new Promise(function(e,n){t.prepare(e,n)})),n.push(new Promise(function(e,n){t.prepareFill(e,n)})))},this),new Promise(function(i,s){Promise.all(n).then(function(){var n=e.root.bounds,a=n.left,c=n.top,u=n.width,h=n.height,p=e.root.labelingRatio,f=Math.round(a*p),l=Math.round(c*p),d=Math.round(u*p),g=Math.round(h*p),b=scene.Component.createCanvas(d*scene.DPPX,g*scene.DPPX),m=e.root.get("translate"),v=e.root.get("scale");e.root.set("translate",{x:0,y:0}),e.root.set("scale",{x:d/u,y:g/h});var y=b.getContext("2d");r.beforeDraw(t),e.root.draw(y),r.afterDraw(t),e.root.set("translate",m),e.root.set("scale",v);var x=[];x.push(o.getGrfCommand({left:f,top:l,width:d,height:g},b.toDataURL())),t&&e.root.forEach(function(e){x.push(e.toZpl(t,!0))}),Promise.all(x).then(function(t){i(t.filter(function(t){return!!t}).join("\n"))},function(t){s(t)})},function(t){console.error(t),s(t)})})},scene.Scene.prototype.toZpl=function(t,e,n){var o=this,r=i.dpi;n&&(i.dpi=n);var s=Number(this.root.get("width"))/100;return new Promise(function(n,a){e?o.toTemplateGRF(t).then(function(t){var e=Math.round(s/2.54*i.dpi);n(["^XA","^PW"+e+"\n",t,"^XZ"].join("\n")),i.dpi=r},function(t){a(t),i.dpi=r}):o.root.toZpl(t,e).then(function(t){var e=Math.round(s/2.54*i.dpi);n(["^XA","^PW"+e+"\n",t,"^XZ"].join("\n")),i.dpi=r},function(t){a(t),i.dpi=r})})},n.Scene=scene.Scene},{"../../config":1,"../utils/to-grf":17,"./interceptors":9}],13:[function(t,e,n){"use strict";var o=t("../utils/has-variables"),r=(t("../../config").config,100);scene.Component.prototype.toZplForText=function(t,e){if(!e||o.hasVariables(this.get("text"))){var n,i=this.model,s=i.textAlign,a=(i.textBaseline,i.fontCode),c=void 0===a?"6":a,u=i.textWrap,h=void 0===u?!1:u,p=this.labelingTextBounds,f=p.left,l=p.top,d=p.width,g=(p.height,this.orientation),b=Math.round((this.lineHeight-this.fontSize)*this.labelingRatio),m=t?this.get("text"):this.text,v=this.fontSize*this.labelingRatio,y=this.fontSize*this.labelingRatio,x=c;switch(s){case"right":n="R";break;case"justify":n="J";break;case"center":n="C";break;case"left":default:n="L"}var M=0;-1!=m.indexOf("\n")&&(m=m.replace(/\n/g,"\\&\n"));var w=[["^FO"+f,l],["^A"+x+g,Math.round(v),Math.round(y)]];return h&&w.push(["^FB"+d,r,b,n,M]),w.push(["^FD"+m]),w.push(["^FS"]),w.map(function(t){return t.join(",")}).join("\n")+"\n"}},scene.Text.prototype._toZpl=function(t,e){return this.toZplForText(t,e)},n.Text=scene.Text},{"../../config":1,"../utils/has-variables":15}],14:[function(){"use strict";scene.Variable.prototype._toZpl=function(){return""}},{}],15:[function(t,e,n){"use strict";function o(t){return t?-1!==t.search(/#{(\S*)}/)?!0:-1!==t.search(/\${[^}]*}/)?!0:!1:!1}Object.defineProperty(n,"__esModule",{value:!0}),n.hasVariables=o},{}],16:[function(t,e,n){"use strict";function o(t,e,n){for(var o=[],r=0;e>r;r++)for(var i=0;t>i;i++){var s=4*(t*r+i),a=.21*n[s+c]+.71*n[s+u]+.07*n[s+h];a+=(255-n[s+p])*(255-a)/255,o[s+c]=a,o[s+u]=a,o[s+h]=a,o[s+p]=n[s+p]}return o}function r(t,e,n){for(var o=[],r=0;a>r;r++)o[r]=0;for(var i=0;e>i;i++)for(var s=0;t>s;s++){var u=4*(t*i+s),h=Math.round(n[u+c]);o[h]++}return o}function i(t,e,n){for(var o=r(t,e,n),i=0,s=0;a>s;s++)i+=s*o[s];for(var c=0,u=0,h=0,p=0,f=0,l=t*e,d=0;a>d;d++)if(u+=o[d],0!=u){if(h=l-u,0==h)break;c+=d*o[d];var g=c/u,b=(i-c)/h,m=u*h*(g-b)*(g-b);m>p&&(p=m,f=d)}return f}function s(t,e,n){for(var r=o(t,e,n),s=i(t,e,r),a=[],f=0;e>f;f++)for(var l=0;t>l;l++){var d=4*(f*t+l);r[d]>s?(a[d+c]=255,a[d+u]=255,a[d+h]=255):(a[d+c]=0,a[d+u]=0,a[d+h]=0),a[d+p]=r[d+p]}return a}Object.defineProperty(n,"__esModule",{value:!0}),n.binarize=s;var a=256,c=0,u=1,h=2,p=3},{}],17:[function(t,e,n){"use strict";function o(){function t(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return t()+t()+t()+t()+t()+t()+t()+t()}function r(t){return parseInt(t,2).toString(16).toUpperCase()||""}function i(t,e,n){for(var o="",i=Math.ceil(t/8),s=0;e>s;s++){for(var a="",c=0,u=0;t>u;u++)a+=0==n[4*(t*s+u)+1]?"1":"0",a.length>7&&(o+=r(a.substring(0,4))+r(a.substring(4,8)),a="",c++);if(a.length>0){for(;a.length<8;)a+="0";o+=r(a.substring(0,4))+r(a.substring(4,8)),a="",c++}for(;c++<i;)o+=r("0000")+r("0000");o+="\n"}return i*e+","+i+","+o}function s(t,e,n){var o;"undefined"==typeof document?o=new Canvas(t,e):(o=document.createElement("canvas"),o.width=t,o.height=e);var r=new Image,s=new Promise(function(n,s){r.onload=function(){var s=o.getContext("2d");s.drawImage(r,0,0,this.width,this.height,0,0,t,e);var a=s.getImageData(0,0,t,e),u=a.data,h=i(t,e,c.binarize(t,e,u));"undefined"!=typeof document&&o.remove(),n(h)},r.onerror=function(t){o.remove(),s(t)}});return r.crossOrigin="use-credentials",r.src=n,s}function a(t,e){return new Promise(function(n,r){s(Math.round(t.width),Math.round(t.height),e).then(function(e){var r=o(),i=[["~DG"+r,e],["^FO"+Math.round(t.left),Math.round(t.top)],["^XGR:"+r,1,1],["^PQ1"],["^FS"]],s=i.map(function(t){return t.join(",")}).join("\n")+"\n";n(s)},function(t){r(t)})})}Object.defineProperty(n,"__esModule",{value:!0}),n.getImageGrf=s,n.getGrfCommand=a;var c=t("./rgb-binarize")},{"./rgb-binarize":16}]},{},[2]);