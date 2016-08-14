(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var config = {
	fontNo: '6',
	dpi: 203
	// dpi: 300
};

exports.config = config;

},{}],2:[function(require,module,exports){
'use strict';

require('./src/components/component');
require('./src/components/text');
require('./src/components/rect');
require('./src/components/ellipse');
require('./src/components/line');
require('./src/components/image');
require('./src/components/barcode');

},{"./src/components/barcode":3,"./src/components/component":4,"./src/components/ellipse":5,"./src/components/image":6,"./src/components/line":7,"./src/components/rect":8,"./src/components/text":9}],3:[function(require,module,exports){
'use strict';

var config = require('../../config').config;

scene.Barcode.prototype._toZpl = function (T) {
  var _model = this.model;
  var symbol = _model.symbol;
  var _model$scale_w = _model.scale_w;
  var scale_w = _model$scale_w === undefined ? 1 : _model$scale_w;
  var _model$showText = _model.showText;
  var showText = _model$showText === undefined ? 'Y' : _model$showText;
  var _model$textAbove = _model.textAbove;
  var textAbove = _model$textAbove === undefined ? '' : _model$textAbove;
  var _labelingBounds = this.labelingBounds;
  var left = _labelingBounds.left;
  var top = _labelingBounds.top;
  var width = _labelingBounds.width;
  var height = _labelingBounds.height;


  var text = T ? this.get('text') : this.text;
  var orientation = this.orientation;

  var commands = [];

  // ^BY 커맨드 : 바코드의 디폴트 설정.
  // barRatio : wide bar to narrow bar width ratio (no effect on fixed ratio bar codes)
  // 유효값 : 2.0 ~ 3.0
  // 디폴트 값을 3으로 둠.
  // 고정비율 바코드에는 적용되지 않음.
  var barRatio = 2;
  // barHeight : height of bars (in dots)
  // 유효값 : 1 to 32000 Initial Value at Power-up: 10
  // BC 커맨드의 높이 정보가 없을 때 디폴트로 적용됨.
  var barHeight = orientation == 'R' || orientation == 'B' ? width : height;

  commands.push(['^BY' + scale_w, barRatio, barHeight]);
  commands.push(['^FO' + left, top]);

  if (showText && symbol != 'qrcode') {
    barHeight -= scale_w * 6 + 8; // barcode 높이는 문자 뺀 다음의 높이임.
  }

  var dpi = config.dpi; // FIXME

  switch (symbol) {
    case 'code11':
      commands.push(['^B1' + orientation,, barHeight, showText, textAbove]);
      break;
    case 'interleaved2of5':
      commands.push(['^B2' + orientation, barHeight, showText, textAbove]);
      break;
    case 'code39':
      commands.push(['^B3' + orientation,, barHeight, showText, textAbove]);
      break;
    case 'code49':
      commands.push(['^B4' + orientation, barHeight, showText]);
      break;
    case 'planet':
      commands.push(['^B5' + orientation, barHeight, showText, textAbove]);
      break;
    case 'pdf417':
      commands.push(['^B7' + orientation, barHeight,,,,]);
      break;
    case 'ean8':
      commands.push(['^B8' + orientation, barHeight, showText, textAbove]);
      break;
    case 'upce':
      commands.push(['^B9' + orientation, barHeight, showText, textAbove]);
      break;
    case 'code93':
      commands.push(['^BA' + orientation, barHeight, showText, textAbove]);
      break;
    case 'codablock':
      commands.push(['^BB' + orientation, barHeight,,,,]);
      break;
    case 'code128':
      commands.push(['^BC' + orientation, barHeight, showText, textAbove,,]);
      break;
    case 'maxicode':
      commands.push(['^BD' + orientation,, barHeight, showText, textAbove]);
      break;
    case 'ean13':
      commands.push(['^BE' + orientation, barHeight, showText, textAbove]);
      break;
    case 'micropdf417':
      commands.push(['^BF' + '2',,]);
      break;
    case 'industrial2of5':
      commands.push(['^BI' + orientation, barHeight, showText, textAbove]);
      break;
    case 'standard2of5':
      commands.push(['^BJ' + orientation, barHeight, showText, textAbove]);
      break;
    case 'ansicodabar':
      commands.push(['^BK' + orientation,, barHeight, showText, textAbove,,]);
      break;
    case 'logmars':
      commands.push(['^BL' + orientation, barHeight, textAbove]);
      break;
    case 'msi':
      commands.push(['^BM' + orientation,, barHeight, showText, textAbove]);
      break;
    case 'plessey':
      commands.push(['^BP' + orientation,, barHeight, showText, textAbove]);
      break;
    case 'qrcode':
      /*
       * ^BQa,b,c
       * @a field position - Accepted Values: Rotation is not supported.
       *                     ^FW has no effect on rotation.
       *                     Fixed Value: Normal
       * @b model - Accepted Values: 1 (original) and 2 (enhanced – recommended)
       *            Default Value: 2
       * @c magnification factor - Accepted Values: 1 through 10
       *                           Default Value:
       *                              1 on 150 dpi printers
       *                              2 on 200 dpi printers
       *                              3 on 300 dpi printers
       *                              6 on 600 dpi printers
       */
      commands.push(['^BQ' + orientation, 1, 2]);
      break;
    case 'upca':
      commands.push(['^BU' + orientation, barHeight, showText, textAbove]);
      break;
    case 'datamatrix':
      commands.push(['^BX' + '']); // TODO
      break;
    case 'postal':
      commands.push(['^BZ' + orientation, barHeight, showText, textAbove]);
      break;
  }

  if (symbol === 'qrcode') {
    commands.push(['^FDQ', 'A' + text]);
  } else {
    commands.push(['^FD' + text]);
  }

  commands.push(['^FS']);

  var zpl = commands.map(function (command) {
    return command.join(',');
  }).join('\n') + '\n';

  return zpl;
};

exports.Barcode = scene.Barcode;

},{"../../config":1}],4:[function(require,module,exports){
'use strict';

var _toGrf = require('../utils/to-grf');

var ORIENTATION = {
  NORMAL: 'N',
  ROTATE_90: 'R',
  INVERTED_180: 'I',
  BOTTOM_UP_270: 'B'
};

function isBlackColor(color) {
  return color === 'black' || color === '#000' || color === '#000000';
}

var printerDPI = 203;

Object.defineProperty(scene.Component.prototype, "labelingRatio", {

  get: function get() {
    var printerDPMM = printerDPI / 2.54 / 10; // mm 당 프린트 도트 갯수.
    var modelUnit = 0.1; // 모델링에서 사용된 수치값은 0.1mm 단위라는 뜻.

    return printerDPMM * modelUnit;
  }
});

scene.Scene.prototype.toGRF = function () {

  var bounds = this.root.bounds;
  var ratio = this.root.labelingRatio;

  bounds.left = Math.round(bounds.left * ratio);
  bounds.top = Math.round(bounds.top * ratio);
  bounds.width = Math.round(bounds.width * ratio);
  bounds.height = Math.round(bounds.height * ratio);

  return (0, _toGrf.getGrfCommand)(bounds, this.toDataURL(undefined, undefined, bounds.width, bounds.height));
};

scene.Scene.prototype.toZpl = function (T, I) {
  var _this = this;

  var labelWidth = Number(this.root.get('width')) / 100;

  return new Promise(function (resolve, reject) {
    if (I) {
      _this.toGRF().then(function (result) {
        resolve(['^XA', '^PW' + Math.round(labelWidth / 2.54 * printerDPI) + '\n', result, '^XZ'].join('\n'));
      }, function (reason) {
        reject(reason);
      });
    } else {
      _this.root.toZpl(T).then(function (result) {
        resolve(['^XA', '^PW' + Math.round(labelWidth / 2.54 * printerDPI) + '\n', result, '^XZ'].join('\n'));
      }, function (reason) {
        reject(reason);
      });
    }
  });
};

scene.Component.prototype.toZpl = function (T) {
  var _this2 = this;

  return new Promise(function (resolve, reject) {
    try {
      resolve(_this2._toZpl(T));
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * ZPL로 변환한 결과를 리턴한다.
 * @T      boolean template true이면 ZPL 템플릿을 만들며, false이면 최종 ZPL을 만든다.
 * @return promise ZPL 결과를 반환하기 위한 promise 객체
 */
scene.Container.prototype.toZpl = function (T) {
  var _this3 = this;

  return new Promise(function (resolve, reject) {
    var promises = _this3.components.map(function (component) {
      return component.toZpl(T);
    });

    Promise.all(promises).then(function (results) {
      resolve(results.join('\n'));
    }, function (error) {
      reject(error);
    });
  });
};

Object.defineProperty(scene.Component.prototype, "lineColor", {

  get: function get() {
    var _model = this.model;
    var strokeStyle = _model.strokeStyle;
    var fillStyle = _model.fillStyle;


    if (isBlackColor(strokeStyle) || isBlackColor(fillStyle)) return 'B';else return 'W';
  }
});

Object.defineProperty(scene.Component.prototype, "lineWidth", {

  get: function get() {
    var lineWidth = this.model.lineWidth;


    return Math.round(lineWidth * this.labelingRatio);
  }
});

Object.defineProperty(scene.Component.prototype, "borderThickness", {

  get: function get() {
    var _model2 = this.model;
    var fillStyle = _model2.fillStyle;
    var lineWidth = _model2.lineWidth;
    var _labelingBounds = this.labelingBounds;
    var width = _labelingBounds.width;
    var height = _labelingBounds.height;


    if (isBlackColor(fillStyle)) return Math.round(Math.min(width, height) / 2);else return Math.round(lineWidth * this.labelingRatio);
  }
});

Object.defineProperty(scene.Component.prototype, "labelingTextBounds", {

  get: function get() {
    var _textBounds = this.textBounds;
    var left = _textBounds.left;
    var top = _textBounds.top;
    var width = _textBounds.width;
    var height = _textBounds.height;

    /**
     * ZPL 템플릿으로는 프린트 시점에 몇 줄이 될 지 알 수 없으므로,
     * - textBaseline 속성은 무조건 TOP 이라고 전제한다.
     * - text는 무조건 한 줄이라고 전제한다.
     * 따라서, height 값은 무조건 fontSize로 한다.
     *
     * TODO. 무조건 한줄이라는 전제조건이면, textBaseline기능이 계산될 수 있으므로, 개선하자.
     * 또한, 템플릿으로 프린트하지 않는 경우에는 몇줄이 되더라도 계산이 가능하므로, 개선하자.
     */

    height = this.fontSize;

    var p1 = this.transcoordS2T(left, top);
    var p2 = this.transcoordS2T(left + width, top + height);

    var left = Math.min(p1.x, p2.x) * this.labelingRatio;
    var top = Math.min(p1.y, p2.y) * this.labelingRatio;

    var width = Math.abs(p2.x - p1.x) * this.labelingRatio;
    var height = Math.abs(p2.y - p1.y) * this.labelingRatio;

    return {
      left: Math.round(left),
      top: Math.round(top),
      width: Math.round(width),
      height: Math.round(height)
    };
  }
});

Object.defineProperty(scene.Component.prototype, "labelingBounds", {

  get: function get() {
    var _bounds = this.bounds;
    var left = _bounds.left;
    var top = _bounds.top;
    var width = _bounds.width;
    var height = _bounds.height;


    var p1 = this.transcoordS2T(left, top);
    var p2 = this.transcoordS2T(left + width, top + height);

    var left = Math.min(p1.x, p2.x) * this.labelingRatio;
    var top = Math.min(p1.y, p2.y) * this.labelingRatio;

    var width = Math.abs(p2.x - p1.x) * this.labelingRatio;
    var height = Math.abs(p2.y - p1.y) * this.labelingRatio;

    return {
      left: Math.round(left),
      top: Math.round(top),
      width: Math.round(width),
      height: Math.round(height)
    };
  }
});

Object.defineProperty(scene.Component.prototype, "absoluteRotation", {

  get: function get() {

    var rotation = 0;
    var parent = this;

    while (parent) {
      rotation += parent.get('rotation') || 0;
      parent = parent.parent;
    }

    return rotation;
  }
});

Object.defineProperty(scene.Component.prototype, "orientation", {

  get: function get() {
    var rotation = this.absoluteRotation % (Math.PI * 2);

    if (Math.PI * -0.25 < rotation && rotation <= Math.PI * 0.25) return ORIENTATION.NORMAL;else if (Math.PI * 0.25 < rotation && rotation <= Math.PI * 0.75) return ORIENTATION.ROTATE_90;else if (Math.PI * 0.75 < rotation && rotation <= Math.PI * 1.25 || Math.PI * -1.25 < rotation && rotation <= Math.PI * -0.75) return ORIENTATION.INVERTED_180;
    if (Math.PI < rotation * 1.25 && rotation <= Math.PI * 1.75 || Math.PI * -0.75 < rotation && rotation <= Math.PI * -0.25) return ORIENTATION.BOTTOM_UP_270;
  }
});

exports.Component = scene.Component;

},{"../utils/to-grf":11}],5:[function(require,module,exports){
'use strict';

require('./text');

scene.Component.prototype.toZplForEllipse = function (bounds, lineColor, borderThickness) {
  var top = bounds.top;
  var left = bounds.left;
  var width = bounds.width;
  var height = bounds.height;


  var commands = [];

  commands.push(['^FO' + left, top]);
  if (width === height) commands.push(['^GC' + width, borderThickness, lineColor]);else commands.push(['^GE' + width, height, borderThickness, lineColor]);
  commands.push(['^FS']);

  return commands.map(function (command) {
    return command.join(',');
  }).join('\n') + '\n';
};

scene.Ellipse.prototype._toZpl = function (T) {

  var zpl = this.toZplForEllipse(this.labelingBounds, this.lineColor, this.borderThickness);

  // build text command
  if (T ? this.get('text') : this.text) zpl += this.toZplForText(T);

  return zpl;
};

exports.Ellipse = scene.Ellipse;

},{"./text":9}],6:[function(require,module,exports){
'use strict';

var _toGrf = require('../utils/to-grf');

scene.ImageView.prototype.toZpl = function (T) {
  var _this = this;

  var src = this.model.src;


  return new Promise(function (resolve, reject) {
    (0, _toGrf.getGrfCommand)(_this.labelingBounds, _this.app.url(src)).then(function (command) {

      resolve(command);
    }, function (error) {

      reject(error);
    });
  });
};

exports.Image = scene.ImageView;

},{"../utils/to-grf":11}],7:[function(require,module,exports){
'use strict';

require('./rect');
require('./text');

scene.Component.prototype.toZplForLine = function (bounds, lineColor, borderThickness, orientation) {
  var left = bounds.left;
  var top = bounds.top;
  var width = bounds.width;
  var height = bounds.height;


  var commands = [['^FO' + left, top], ['^GD' + width, height, borderThickness, lineColor, orientation], ['^FS']];

  return commands.map(function (command) {
    return command.join(',');
  }).join('\n') + '\n';
};

scene.Line.prototype._toZpl = function (T) {
  var bounds = this.labelingBounds;
  var zpl;

  if (bounds.width < 0.5 || bounds.height < 0.5) {

    // 라인이 직선일 때에도 GB로직을 타며 테두리의 좌표값을 계산해 줘야 함.
    if (width == 0) {
      bounds.left -= this.borderThickness / 2;
      bounds.width += this.borderThickness / 2;
    } else if (height == 0) {
      bounds.top -= this.borderThickness / 2;
      bounds.height += this.borderThickness / 2;
    }

    zpl = this.toZplForRect(bounds, this.lineColor, this.borderThickness, 0);
  } else {
    var _model = this.model;
    var x1 = _model.x1;
    var x2 = _model.x2;
    var y1 = _model.y1;
    var y2 = _model.y2;


    var p1 = this.transcoordS2T(x1, y1);
    var p2 = this.transcoordS2T(x2, y2);

    var orientation = (p1.x - p2.x) * (p1.y - p2.y) > 0 ? 'L' : 'R';

    zpl = this.toZplForLine(bounds, this.lineColor, this.lineWidth, orientation);
  }

  // build text command
  if (T ? this.get('text') : this.text) zpl += this.toZplForText(T);

  return zpl;
};

exports.Line = scene.Line;

},{"./rect":8,"./text":9}],8:[function(require,module,exports){
'use strict';

require('./text');

scene.Component.prototype.toZplForRect = function (bounds, lineColor, borderThickness, round) {
  var top = bounds.top;
  var left = bounds.left;
  var width = bounds.width;
  var height = bounds.height;


  var commands = [['^FO' + left, top], ['^GB' + width, height, borderThickness, lineColor, Math.round(round * 8 / 100)], ['^FS']];

  return commands.map(function (command) {
    return command.join(',');
  }).join('\n') + '\n';
};

scene.Rect.prototype._toZpl = function (T) {
  var _model$round = this.model.round;
  var round = _model$round === undefined ? 0 : _model$round;


  var zpl = this.toZplForRect(this.labelingBounds, this.lineColor, this.borderThickness, round);

  // build text command
  if (T ? this.get('text') : this.text) zpl += this.toZplForText(T);

  return zpl;
};

exports.Rect = scene.Rect;

},{"./text":9}],9:[function(require,module,exports){
'use strict';

var config = require('../../config').config;

var MAX_NUMBER_OF_LINES = 100;

scene.Component.prototype.toZplForText = function (T) {
  var _model = this.model;
  var textWrap = _model.textWrap;
  var textAlign = _model.textAlign;
  var textBaseline = _model.textBaseline;
  var _labelingTextBounds = this.labelingTextBounds;
  var left = _labelingTextBounds.left;
  var top = _labelingTextBounds.top;
  var width = _labelingTextBounds.width;
  var height = _labelingTextBounds.height;


  var orientation = this.orientation;
  var lineSpace = Math.round((this.lineHeight - this.fontSize) * this.labelingRatio);
  var text = T ? this.get('text') : this.text;
  var charHeight = Math.round(this.fontSize * this.labelingRatio);
  var charWidth = Math.round(this.fontSize * this.labelingRatio);

  var fontNo = config.fontNo || 'A';

  if (textWrap) {

    var justification;

    switch (textAlign) {
      case 'right':
        justification = 'R';
        break;
      case 'justify':
        justification = 'J';
        break;
      case 'center':
        justification = 'C';
        break;
      case 'left':
      default:
        justification = 'L';
        break;
    }

    /* hangingIndent기능은 지원하지 않는다. */
    var hangingIndent = 0;

    var commands = [['^FO' + left, top],
    // ['^A@'+orientation, charHeight, charWidth * 0.75],
    ['^A' + fontNo + orientation, charHeight, charWidth], // FIXME
    ['^FB' + width, MAX_NUMBER_OF_LINES, lineSpace, justification, hangingIndent], ['^FD' + text], ['^FS']];
  } else {
    var commands = [['^FO' + left, top],
    // ['^A@' + orientation, charHeight, charWidth * 0.75],
    ['^A' + fontNo + orientation, charHeight, charWidth], ['^FD' + text], ['^FS']];
  }

  return commands.map(function (command) {
    return command.join(',');
  }).join('\n') + '\n';
};

scene.Text.prototype._toZpl = function (T) {

  return this.toZplForText(T);
};

exports.Text = scene.Text;

},{"../../config":1}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.binarize = binarize;
var HISTOGRAM_LENGH = 256;
var R = 0;
var G = 1;
var B = 2;
var A = 3;

function toGrays(width, height, data) {
  var grays = [];

  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var idx = 4 * (width * y + x);
      var luminance = data[idx + R] * 0.21 + data[idx + G] * 0.71 + data[idx + B] * 0.07;

      // Alpha 값이 낮을 수록 luminance가 높아지는 것으로 본다.
      luminance = luminance + (255 - data[idx + A]) * (255 - luminance) / 255;

      grays[idx + R] = luminance;
      grays[idx + G] = luminance;
      grays[idx + B] = luminance;
      grays[idx + A] = data[idx + A];
    }
  }

  return grays;
}

function getHistogram(width, height, data) {
  var histogram = [];

  for (var i = 0; i < HISTOGRAM_LENGH; i++) {
    histogram[i] = 0;
  }for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var idx = 4 * (width * y + x);
      var red = Math.round(data[idx + R]);
      histogram[red]++;
    }
  }return histogram;
}

function getThreshold(width, height, data) {
  var histogram = getHistogram(width, height, data);

  var sum = 0;
  for (var i = 0; i < HISTOGRAM_LENGH; i++) {
    sum += i * histogram[i];
  }var sumB = 0;
  var wB = 0;
  var wF = 0;

  var max = 0;
  var threshold = 0;
  var total = width * height;

  for (var _i = 0; _i < HISTOGRAM_LENGH; _i++) {
    wB += histogram[_i];
    if (wB == 0) continue;

    wF = total - wB;

    if (wF == 0) break;

    sumB += _i * histogram[_i];
    var mB = sumB / wB;
    var mF = (sum - sumB) / wF;

    var between = wB * wF * (mB - mF) * (mB - mF);
    if (between > max) {
      max = between;
      threshold = _i;
    }
  }

  return threshold;
}

function binarize(width, height, data) {
  var grays = toGrays(width, height, data);
  var threshold = getThreshold(width, height, grays);

  var binarized = [];

  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var idx = 4 * (y * width + x);

      if (grays[idx] > threshold) {
        binarized[idx + R] = 255;
        binarized[idx + G] = 255;
        binarized[idx + B] = 255;
      } else {
        binarized[idx + R] = 0;
        binarized[idx + G] = 0;
        binarized[idx + B] = 0;
      }

      binarized[idx + A] = grays[idx + A];
    }
  }

  return binarized;
}

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getImageGrf = getImageGrf;
exports.getGrfCommand = getGrfCommand;

var _rgbBinarize = require('./rgb-binarize');

function getGuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}

function binToHex(nibble) {
  return parseInt(nibble, 2).toString(16).toUpperCase() || '';
}

function buildImageGrf(width, height, data) {

  var grfData = "";
  var bytesPerLine = Math.ceil(width / 8);

  for (var y = 0; y < height; y++) {
    var nibble = "";
    var bytes = 0;

    for (var x = 0; x < width; x++) {
      nibble += data[4 * (width * y + x) + 1] == 0 ? '1' : '0';

      if (nibble.length > 7) {
        grfData += binToHex(nibble.substring(0, 4)) + binToHex(nibble.substring(4, 8));
        nibble = "";
        bytes++;
      }
    }

    if (nibble.length > 0) {
      while (nibble.length < 8) {
        nibble += '0';
      }grfData += binToHex(nibble.substring(0, 4)) + binToHex(nibble.substring(4, 8));
      nibble = '';
      bytes++;
    }

    while (bytes++ < bytesPerLine) {
      grfData += binToHex('0000') + binToHex('0000');
    }grfData += "\n";
  }

  return bytesPerLine * height + ',' + bytesPerLine + ',' + grfData;
}

function getImageGrf(width, height, src) {

  var canvas;

  if (typeof document == 'undefined') {
    canvas = new Canvas(width, height);
  } else {
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
  }

  var image = new Image();

  var promise = new Promise(function (resolve, reject) {
    image.onload = function () {
      var context = canvas.getContext('2d');

      console.log('image size, target size', this.width, this.height, width, height);
      context.drawImage(image, 0, 0, this.width, this.height, 0, 0, width, height);

      var _context$getImageData = context.getImageData(0, 0, width, height);

      var data = _context$getImageData.data;


      var grf = buildImageGrf(width, height, (0, _rgbBinarize.binarize)(width, height, data));

      canvas.remove();

      resolve(grf);
    };

    image.onerror = function (error) {
      canvas.remove();

      reject(error);
    };
  });

  image.crossOrigin = "use-credentials";
  image.src = src;

  return promise;
}

function getGrfCommand(bounds, src) {
  return new Promise(function (resolve, reject) {

    getImageGrf(Math.round(bounds.width), Math.round(bounds.height), src).then(function (grf) {

      var guid = getGuid();
      var commands = [['~DG' + guid, grf], ['^FO' + Math.round(bounds.left), Math.round(bounds.top)], ['^XG' + 'R:' + guid, 1, 1], ['^PQ' + 1], ['^FS']];

      var result = commands.map(function (command) {
        return command.join(',');
      }).join('\n') + '\n';

      resolve(result);
    }, function (error) {
      reject(error);
    });
  });
}

},{"./rgb-binarize":10}]},{},[2]);
