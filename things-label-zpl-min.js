!function t(e,n,o){function r(s,a){if(!n[s]){if(!e[s]){var c="function"==typeof require&&require;if(!a&&c)return c(s,!0);if(i)return i(s,!0);var h=new Error("Cannot find module '"+s+"'");throw h.code="MODULE_NOT_FOUND",h}var u=n[s]={exports:{}};e[s][0].call(u.exports,function(t){var n=e[s][1][t];return r(n?n:t)},u,u.exports,t,e,n,o)}return n[s].exports}for(var i="function"==typeof require&&require,s=0;s<o.length;s++)r(o[s]);return r}({1:[function(t,e,n){"use strict";var o={fontNo:"6",dpi:203};n.config=o},{}],2:[function(t){"use strict";t("./src/components/component"),t("./src/components/text"),t("./src/components/rect"),t("./src/components/ellipse"),t("./src/components/line"),t("./src/components/image"),t("./src/components/barcode")},{"./src/components/barcode":3,"./src/components/component":4,"./src/components/ellipse":5,"./src/components/image":6,"./src/components/line":7,"./src/components/rect":8,"./src/components/text":9}],3:[function(t,e,n){"use strict";var o=t("../../config").config;scene.Barcode.prototype._toZpl=function(t){var e=this.model,n=e.symbol,r=e.scale_w,i=void 0===r?1:r,s=e.showText,a=void 0===s?"Y":s,c=e.textAbove,h=void 0===c?"":c,u=this.labelingBounds,p=u.left,l=u.top,f=(u.width,u.height),d=t?this.get("text"):this.text,b=this.orientation,g=[],m=3,v=f;g.push(["^BY"+i,m,v]),g.push(["^FO"+p,l]),a&&"qrcode"!=n&&(f-=6*i+8);o.dpi;switch(n){case"code11":g.push(["^B1"+b,,f,a,h]);break;case"interleaved2of5":g.push(["^B2"+b,f,a,h]);break;case"code39":g.push(["^B3"+b,,f,a,h]);break;case"code49":g.push(["^B4"+b,f,a]);break;case"planet":g.push(["^B5"+b,f,a,h]);break;case"pdf417":g.push(["^B7"+b,f,,,,]);break;case"ean8":g.push(["^B8"+b,f,a,h]);break;case"upce":g.push(["^B9"+b,f,a,h]);break;case"code93":g.push(["^BA"+b,f,a,h]);break;case"codablock":g.push(["^BB"+b,f,,,,]);break;case"code128":g.push(["^BC"+b,f,a,h,,]);break;case"maxicode":g.push(["^BD"+b,,f,a,h]);break;case"ean13":g.push(["^BE"+b,f,a,h]);break;case"micropdf417":g.push(["^BF2",,]);break;case"industrial2of5":g.push(["^BI"+b,f,a,h]);break;case"standard2of5":g.push(["^BJ"+b,f,a,h]);break;case"ansicodabar":g.push(["^BK"+b,,f,a,h,,]);break;case"logmars":g.push(["^BL"+b,f,h]);break;case"msi":g.push(["^BM"+b,,f,a,h]);break;case"plessey":g.push(["^BP"+b,,f,a,h]);break;case"qrcode":g.push(["^BQ"+b,2,Math.round(f/19.54)]);break;case"upca":g.push(["^BU"+b,f,a,h]);break;case"datamatrix":g.push(["^BX"]);break;case"postal":g.push(["^BZ"+b,f,a,h])}g.push("qrcode"===n?["^FDQ","A"+d]:["^FD"+d]),g.push(["^FS"]);var x=g.map(function(t){return t.join(",")}).join("\n")+"\n";return x},n.Barcode=scene.Barcode},{"../../config":1}],4:[function(t,e,n){"use strict";function o(t){return"black"===t||"#000"===t||"#000000"===t}var r={NORMAL:"N",ROTATE_90:"R",INVERTED_180:"I",BOTTOM_UP_270:"B"},i=203;Object.defineProperty(scene.Component.prototype,"labelingRatio",{get:function(){var t=i/2.54/10,e=.1;return t*e}}),scene.Scene.prototype.toZpl=function(t){var e=this,n=Number(this.root.get("width"))/100;return new Promise(function(o,r){e.root.toZpl(t).then(function(t){o(["^XA","^PW"+Math.round(n/2.54*i)+"\n",t,"^XZ"].join("\n"))},function(t){r(t)})})},scene.Component.prototype.toZpl=function(t){var e=this;return new Promise(function(n,o){try{n(e._toZpl(t))}catch(r){o(r)}})},scene.Container.prototype.toZpl=function(t){var e=this;return new Promise(function(n,o){var r=e.components.map(function(e){return e.toZpl(t)});Promise.all(r).then(function(t){n(t.join("\n"))},function(t){o(t)})})},Object.defineProperty(scene.Component.prototype,"lineColor",{get:function(){var t=this.model,e=t.strokeStyle,n=t.fillStyle;return o(e)||o(n)?"B":"W"}}),Object.defineProperty(scene.Component.prototype,"lineWidth",{get:function(){var t=this.model.lineWidth;return t*this.labelingRatio}}),Object.defineProperty(scene.Component.prototype,"borderThickness",{get:function(){var t=this.model,e=t.fillStyle,n=t.lineWidth,r=this.labelingBounds,i=r.width,s=r.height;return o(e)?Math.min(i,s)/2:n*this.labelingRatio}}),Object.defineProperty(scene.Component.prototype,"labelingTextBounds",{get:function(){var t=this.textBounds,e=t.left,n=t.top,o=t.width,r=t.height,i=this.transcoordS2T(e,n),s=this.transcoordS2T(e+o,n+r),e=Math.min(i.x,s.x)*this.labelingRatio,n=Math.min(i.y,s.y)*this.labelingRatio,o=Math.abs(s.x-i.x)*this.labelingRatio,r=Math.abs(s.y-i.y)*this.labelingRatio;return{left:e,top:n,width:o,height:r}}}),Object.defineProperty(scene.Component.prototype,"labelingBounds",{get:function(){var t=this.bounds,e=t.left,n=t.top,o=t.width,r=t.height,i=this.transcoordS2T(e,n),s=this.transcoordS2T(e+o,n+r),e=Math.min(i.x,s.x)*this.labelingRatio,n=Math.min(i.y,s.y)*this.labelingRatio,o=Math.abs(s.x-i.x)*this.labelingRatio,r=Math.abs(s.y-i.y)*this.labelingRatio;return{left:e,top:n,width:o,height:r}}}),Object.defineProperty(scene.Component.prototype,"absoluteRotation",{get:function(){for(var t=0,e=this;e;)t+=e.get("rotation")||0,e=e.parent;return t}}),Object.defineProperty(scene.Component.prototype,"orientation",{get:function(){var t=this.absoluteRotation%(2*Math.PI);return Math.PI*-.25<t&&t<=.25*Math.PI?r.NORMAL:.25*Math.PI<t&&t<=.75*Math.PI?r.ROTATE_90:.75*Math.PI<t&&t<=1.25*Math.PI||-1.25*Math.PI<t&&t<=Math.PI*-.75?r.INVERTED_180:Math.PI<1.25*t&&t<=1.75*Math.PI||Math.PI*-.75<t&&t<=Math.PI*-.25?r.BOTTOM_UP_270:void 0}}),n.Component=scene.Component},{}],5:[function(t,e,n){"use strict";t("./text"),scene.Component.prototype.toZplForEllipse=function(t,e,n){var o=t.top,r=t.left,i=t.width,s=t.height,a=[];return a.push(["^FO"+r,o]),a.push(i===s?["^GC"+i,n,e]:["^GE"+i,s,n,e]),a.push(["^FS"]),a.map(function(t){return t.join(",")}).join("\n")+"\n"},scene.Ellipse.prototype._toZpl=function(t){var e=this.toZplForEllipse(this.labelingBounds,this.lineColor,this.borderThickness);return(t?this.get("text"):this.text)&&(e+=this.toZplForText(t)),e},n.Ellipse=scene.Ellipse},{"./text":9}],6:[function(t,e,n){"use strict";function o(){function t(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return t()+t()+t()+t()+t()+t()+t()+t()}function r(t){var e=t.model.src,n=t.labelingBounds,o=(n.top,n.left,n.width),r=n.height;o=Math.round(o),r=Math.round(r);var i;"undefined"==typeof document?i=new Canvas(o,r):(i=document.createElement("canvas"),i.width=o,i.height=r);var c=new Image,h=new Promise(function(t,e){c.onload=function(){var e=i.getContext("2d");e.drawImage(c,0,0,this.width,this.height,0,0,o,r);var n=e.getImageData(0,0,o,r),h=n.data,u=s(o,r,a.binarize(o,r,h));t(u)},c.onerror=function(t){e(t)}});return c.crossOrigin="use-credentials",c.src=t.app.url(e),h}function i(t){return parseInt(t,2).toString(16).toUpperCase()||""}function s(t,e,n){for(var o="",r=Math.ceil(t/8),s=0;e>s;s++){for(var a="",c=0,h=0;t>h;h++)a+=0==n[4*(t*s+h)+1]?"1":"0",a.length>7&&(o+=i(a.substring(0,4))+i(a.substring(4,8)),a="",c++);if(a.length>0){for(;a.length<8;)a+="0";o+=i(a.substring(0,4))+i(a.substring(4,8)),a="",c++}for(;c++<r;)o+=i("0000")+i("0000");o+="\n"}return r*e+","+r+","+o}var a=t("../utils/rgb-binarize");scene.ImageView.prototype.toZpl=function(){var t=this.labelingBounds,e=t.top,n=t.left,i=this;return new Promise(function(t,s){r(i).then(function(r){var i=o(),s=[["~DG"+i,r],["^FO"+n,e],["^XGR:"+i,1,1],["^PQ1"],["^FS"]],a=s.map(function(t){return t.join(",")}).join("\n")+"\n";t(a)},function(t){s(t)})})},n.Image=scene.ImageView},{"../utils/rgb-binarize":10}],7:[function(t,e,n){"use strict";t("./rect"),t("./text"),scene.Component.prototype.toZplForLine=function(t,e,n,o){var r=t.left,i=t.top,s=t.width,a=t.height,c=[["^FO"+r,i],["^GD"+s,a,n,e,o],["^FS"]];return c.map(function(t){return t.join(",")}).join("\n")+"\n"},scene.Line.prototype._toZpl=function(t){var e,n=this.labelingBounds;if(n.width<.5||n.height<.5)0==width?(n.left-=this.borderThickness/2,n.width+=this.borderThickness/2):0==height&&(n.top-=this.borderThickness/2,n.height+=this.borderThickness/2),e=this.toZplForRect(n,this.lineColor,this.borderThickness,0);else{var o=this.model,r=o.x1,i=o.x2,s=o.y1,a=o.y2,c=this.transcoordS2T(r,s),h=this.transcoordS2T(i,a),u=(c.x-h.x)*(c.y-h.y)>0?"L":"R";e=this.toZplForLine(n,this.lineColor,this.lineWidth,u)}return(t?this.get("text"):this.text)&&(e+=this.toZplForText(t)),e},n.Line=scene.Line},{"./rect":8,"./text":9}],8:[function(t,e,n){"use strict";t("./text"),scene.Component.prototype.toZplForRect=function(t,e,n,o){var r=t.top,i=t.left,s=t.width,a=t.height,c=[["^FO"+i,r],["^GB"+s,a,n,e,Math.round(8*o/100)],["^FS"]];return c.map(function(t){return t.join(",")}).join("\n")+"\n"},scene.Rect.prototype._toZpl=function(t){var e=this.model.round,n=void 0===e?0:e,o=this.toZplForRect(this.labelingBounds,this.lineColor,this.borderThickness,n);return(t?this.get("text"):this.text)&&(o+=this.toZplForText(t)),o},n.Rect=scene.Rect},{"./text":9}],9:[function(t,e,n){"use strict";var o=t("../../config").config,r=100;scene.Component.prototype.toZplForText=function(t){var e=this.model,n=e.textWrap,i=e.textAlign,s=(e.textBaseline,this.labelingTextBounds),a=s.left,c=s.top,h=s.width,u=(s.height,this.orientation),p=(this.lineHeight-this.fontSize)*this.labelingRatio,l=t?this.get("text"):this.text,f=this.fontSize*this.labelingRatio,d=this.fontSize*this.labelingRatio,b=o.fontNo||"A";if(n){var g;switch(i){case"right":g="R";break;case"justify":g="J";break;case"center":g="C";break;case"left":default:g="L"}var m=0,v=[["^FO"+a,c],["^A"+b+u,f,d],["^FB"+h,r,p,g,m],["^FD"+l],["^FS"]]}else var v=[["^FO"+a,c],["^A"+b+u,f,d],["^FD"+l],["^FS"]];return v.map(function(t){return t.join(",")}).join("\n")+"\n"},scene.Text.prototype._toZpl=function(t){return this.toZplForText(t)},n.Text=scene.Text},{"../../config":1}],10:[function(t,e,n){"use strict";function o(t,e,n){for(var o=[],r=0;e>r;r++)for(var i=0;t>i;i++){var s=4*(t*r+i),a=.21*n[s+c]+.71*n[s+h]+.07*n[s+u];a+=(255-n[s+p])*(255-a)/255,o[s+c]=a,o[s+h]=a,o[s+u]=a,o[s+p]=n[s+p]}return o}function r(t,e,n){for(var o=[],r=0;a>r;r++)o[r]=0;for(var i=0;e>i;i++)for(var s=0;t>s;s++){var h=4*(t*i+s),u=Math.round(n[h+c]);o[u]++}return o}function i(t,e,n){for(var o=r(t,e,n),i=0,s=0;a>s;s++)i+=s*o[s];for(var c=0,h=0,u=0,p=0,l=0,f=t*e,d=0;a>d;d++)if(h+=o[d],0!=h){if(u=f-h,0==u)break;c+=d*o[d];var b=c/h,g=(i-c)/u,m=h*u*(b-g)*(b-g);m>p&&(p=m,l=d)}return l}function s(t,e,n){for(var r=o(t,e,n),s=i(t,e,r),a=[],l=0;e>l;l++)for(var f=0;t>f;f++){var d=4*(l*t+f);r[d]>s?(a[d+c]=255,a[d+h]=255,a[d+u]=255):(a[d+c]=0,a[d+h]=0,a[d+u]=0),a[d+p]=r[d+p]}return a}Object.defineProperty(n,"__esModule",{value:!0}),n.binarize=s;var a=256,c=0,h=1,u=2,p=3},{}]},{},[2]);