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

require('./src/components/scene');

},{"./src/components/barcode":3,"./src/components/component":4,"./src/components/ellipse":5,"./src/components/image":6,"./src/components/line":10,"./src/components/rect":11,"./src/components/scene":12,"./src/components/text":13}],3:[function(require,module,exports){
'use strict';

var config = require('../../config').config;

var qrScaleTable = {
	'1': 2,
	'2': 3,
	'3': 5,
	'4': 6,
	'5': 8,
	'6': 10
};

var TWO_D_BARCODES = ['qrcode', 'pdf417', 'micropdf417', 'datamatrix', 'maxicode', 'code49'];

function textOffsetCorrection(symbol) {
	switch (symbol) {
		case 'ean8':
			if (barWidth == 1) left += 20;else if (barWidth == 2) left += 25;else if (barWidth == 3) left += 25;else if (barWidth == 4) left += 35;else if (barWidth == 5) left += 20;else if (barWidth == 6) left += 50;else if (barWidth == 7) left += 50;else if (barWidth == 8) left += 75;else if (barWidth == 9) left += 75;
			break;
		case 'ean13':
			if (barWidth == 1) left += 20;else if (barWidth == 2) left += 25;else if (barWidth == 3) left += 25;else if (barWidth == 4) left += 35;else if (barWidth == 5) left += 20;else if (barWidth == 6) left += 50;else if (barWidth == 7) left += 50;else if (barWidth == 8) left += 75;else if (barWidth == 9) left += 75;
			break;
		case 'upce':
			break;
		case 'upca':
			break;
	}
}

if ((symbol == 'ean8' || symbol == 'ean13' || symbol == 'upce' || symbol == 'upca') && showText) {
	textOffsetCorrection(symbol);
}

scene.Barcode.prototype._toZpl = function (T, I) {
	var _model = this.model;
	var symbol = _model.symbol;
	var _model$scale_w = _model.scale_w;
	var scale_w = _model$scale_w === undefined ? 1 : _model$scale_w;
	var _model$showText = _model.showText;
	var showText = _model$showText === undefined ? true : _model$showText;
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
	var barWidth = scale_w;

	// if(symbol == 'code93') // scale_w를 0.9로 했을때 1.8은 2로 해야함... 나머지는 소수점 제거.
	// 	barWidth += 0.2;
	// else if(symbol == 'upca')
	// 	barWidth = barWidth >= 4 ? barWidth - 1 : barWidth;
	// else if(symbol == 'upce')
	// 	barWidth = barWidth >= 5 ? barWidth - 1 : barWidth;
	// else if(symbol == 'msi')
	// 	barWidth = barWidth >= 3 ? barWidth - 1 : barWidth;


	// 스케일이 1 아래로는 무조건 1, 나머지는 소수점 제거
	barWidth = barWidth < 1 ? 1 : Math.floor(barWidth);

	// bwip은 left좌표를 끝의 숫자 중심으로 그리는데 실제는 바코드 기준으로 그림. 바코드가 커질수록 숫자가 왼쪽으로 튀어 나오는 현상때문에 x좌표를 숫자만큼 밀어줘야함
	if ((symbol == 'ean8' || symbol == 'ean13' || symbol == 'upce' || symbol == 'upca') && showText) {
		if (barWidth == 1) left += 20;else if (barWidth == 2) left += 25;else if (barWidth == 3) left += 25;else if (barWidth == 4) left += 35;else if (barWidth == 5) left += 20;else if (barWidth == 6) left += 50;else if (barWidth == 7) left += 50;else if (barWidth == 8) left += 75;else if (barWidth == 9) left += 75;
	}

	commands.push(['^BY' + barWidth, barRatio, barHeight]);
	commands.push(['^FO' + left, top]);

	if (showText && TWO_D_BARCODES.indexOf(symbol) == -1) {
		barHeight -= scale_w * 6 + 8; // barcode 높이는 문자 뺀 다음의 높이임.
	}

	var dpi = config.dpi; // FIXME

	showText = showText ? 'Y' : 'N';

	switch (symbol) {
		case 'code11':
			commands.push(['^B1' + orientation,, barHeight, showText, textAbove]);
			break;
		case 'interleaved2of5':
			commands.push(['^B2' + orientation, barHeight, showText, textAbove, 'N']);
			break;
		case 'code39':
			// 2번째 값을 'Y'로 주면 출력 시 맨 뒤에 다른 문자 한개가 추가로 붙음. (bwip에서는 무조건 'Y'로 그림)
			commands.push(['^B3' + orientation, 'N', barHeight, showText, textAbove]);
			break;
		case 'code49':
			// 높이를 맞출 수 없음 (보류)
			commands.push(['^B4' + orientation, barHeight, showText]);
			break;
		case 'planet':
			// 뒤에 이상한 한글자가 안없어짐, 속성에는 조절을 할 수 있는 속성이 메뉴얼에도 없음.
			commands.push(['^B5' + orientation, barHeight, showText, textAbove]);
			break;
		case 'pdf417':
			// 세로 크기가 안맞음
			commands.push(['^B7' + orientation, barHeight,,,,]);
			break;
		case 'ean8':
			// 항상 무조건 7글자 여야함
			// 스케일은 7일때 script는 6으로 찍혀야 크기가 비슷함
			commands.push(['^B8' + orientation, barHeight, showText, textAbove]);
			break;
		case 'upce':
			// 보류...  텍스트가 너무 안맞음
			commands.push(['^B9' + orientation, barHeight, showText, textAbove]);
			break;
		case 'code93':
			// 크기가 안맞음
			commands.push(['^BA' + orientation, barHeight, showText, textAbove]);
			break;
		case 'codablock':
			// 바코드 출력해도 아무것도 안나옴
			// 비윕에서 그려주는 걸 찍으면 code128로 인식함
			commands.push(['^BB' + orientation, barHeight,,,,]);
			break;
		case 'code128':
			commands.push(['^BC' + orientation, barHeight, showText, textAbove,,]);
			break;
		case 'maxicode':
			// 바코드 출력해도 아무것도 안나옴
			commands.push(['^BD' + orientation,, barHeight, showText, textAbove]);
			break;
		case 'ean13':
			// bwip에서는 텍스트가 12자리 미만이면 그려지지 않음. 8개만 입력했을때 bwip은 X 표시가 뜨지만 스크립트 출력은 잘됨
			commands.push(['^BE' + orientation, barHeight, showText, textAbove]);
			break;
		case 'micropdf417':
			// 높이 대략적인 계산, 3번째 값은 type속성으로, 2가 제일 비슷함.
			commands.push(['^BF' + orientation, barHeight, '2']);
			break;
		case 'industrial2of5':
			// bwip에서 지원하지 않는 바코드.
			commands.push(['^BI' + orientation, barHeight, showText, textAbove]);
			break;
		case 'standard2of5':
			// bwip에서 지원하지 않는 바코드.
			commands.push(['^BJ' + orientation, barHeight, showText, textAbove]);
			break;
		case 'ansicodabar':
			// bwip에서 지원하지 않는 바코드.
			commands.push(['^BK' + orientation,, barHeight, showText, textAbove,,]);
			break;
		case 'logmars':
			// bwip에서 지원하지 않는 바코드.
			commands.push(['^BL' + orientation, barHeight, textAbove]);
			break;
		case 'msi':
			// planet과 마찬가지로 뒤에 한글자가 안없어짐
			commands.push(['^BM' + orientation,, barHeight, showText, textAbove, 'N', 'N']);
			break;
		case 'plessey':
			// bwip이 CheckDigit가 되어 있는 상태로만 그려짐
			commands.push(['^BP' + orientation, 'Y', barHeight, showText, textAbove]);
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
			// QR의 Scale이 6보다 크면 그 이상 크기가 없기 때문에 무조건 6으로 고정
			barWidth = qrScaleTable[Math.round(scale_w)] ? qrScaleTable[scale_w] : qrScaleTable['6'];
			commands.push(['^BQ' + orientation, 2, barWidth]);
			break;
		case 'upca':
			// 사이즈 양옆으로 커짐
			commands.push(['^BU' + orientation, barHeight, showText, textAbove]);
			break;
		case 'datamatrix':
			commands.push(['^BX' + '']); // TODO
			break;
		case 'postal':
			// bwip에서 지원하지 않는 바코드.
			commands.push(['^BZ' + orientation, barHeight, showText, textAbove]);
			break;
	}

	if (symbol === 'qrcode') {
		commands.push(['^FDQ', 'A' + text]);
		commands.push(['^FS']);
	} else if (symbol === 'code39') {
		// ^FS가 텍스트와 같은 줄에 있지 않으면 텍스트가 나오지 않는 바코드가 있음(ex : code39)
		commands.push(['^FD' + text + '^FS']);
	} else {
		commands.push(['^FD' + text]);
		commands.push(['^FS']);
	}

	var zpl = commands.map(function (command) {
		return command.join(',');
	}).join('\n') + '\n';

	return zpl;
};

exports.Barcode = scene.Barcode;

},{"../../config":1}],4:[function(require,module,exports){
'use strict';

var config = require('../../config').config;

var DEFAULT_FONT_SIZE = 15;

var ORIENTATION = {
  NORMAL: 'N',
  ROTATE_90: 'R',
  INVERTED_180: 'I',
  BOTTOM_UP_270: 'B'
};

function isBlackColor(color) {
  return color === 'black' || color === '#000' || color === '#000000';
}

scene.Component.prototype.toZpl = function (T, I) {
  var _this = this;

  return new Promise(function (resolve, reject) {
    try {
      resolve(_this._toZpl(T, I));
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
  var _this2 = this;

  return new Promise(function (resolve, reject) {
    var promises = _this2.components.map(function (component) {
      return component.toZpl(T);
    });

    Promise.all(promises).then(function (results) {
      resolve(results.filter(function (result) {
        return !!result;
      }).join('\n'));
    }, function (error) {
      reject(error);
    });
  });
};

Object.defineProperty(scene.Component.prototype, "labelingRatio", {

  get: function get() {
    var printerDPMM = config.dpi / 2.54 / 10; // mm 당 프린트 도트 갯수.
    var modelUnit = 0.1; // 모델링에서 사용된 수치값은 0.1mm 단위라는 뜻.

    return printerDPMM * modelUnit;
  }
});

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
    var lineWidth = _model2.lineWidth;
    var fill = _model2.fill;
    var _labelingBounds = this.labelingBounds;
    var width = _labelingBounds.width;
    var height = _labelingBounds.height;


    if (fill) return Math.round(Math.min(width, height) / 2);else return Math.round(lineWidth * this.labelingRatio);
  }
});

Object.defineProperty(scene.Component.prototype, "fontSize", {
  get: function get() {
    var fontSize = this.get('fontSize') || DEFAULT_FONT_SIZE;

    return fontSize;
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

    height = this.get('fontSize') || DEFAULT.FONT_SIZE; //this.fontSize;

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

},{"../../config":1}],5:[function(require,module,exports){
'use strict';

require('./text');

scene.Component.prototype.toZplForEllipse = function (bounds, lineColor, borderThickness) {
  var top = bounds.top;
  var left = bounds.left;
  var width = bounds.width;
  var height = bounds.height;
  var _model = this.model;
  var fill = _model.fill;
  var lineWidth = _model.lineWidth;


  var commands = [];

  var borderCulc = Math.round(lineWidth / 3);
  var caseFill = fill ? borderCulc : 0;

  commands.push(['^FO' + (left - borderCulc), top - borderCulc]);
  if (width === height) commands.push(['^GC' + (width + borderCulc * 2), borderThickness + caseFill, lineColor]);else commands.push(['^GE' + (width + borderCulc * 2), height + borderCulc * 2, borderThickness + caseFill, lineColor]);
  commands.push(['^FS']);

  return commands.map(function (command) {
    return command.join(',');
  }).join('\n') + '\n';
};

scene.Ellipse.prototype._toZpl = function (T, I) {

  /* 이미지 타입이면, ZPL을 생성하지 않고 리턴한다. */
  if (I) return;

  var zpl = this.toZplForEllipse(this.labelingBounds, this.lineColor, this.borderThickness);

  // build text command
  if (T ? this.get('text') : this.text) zpl += this.toZplForText(T, I);

  return zpl;
};

exports.Ellipse = scene.Ellipse;

},{"./text":13}],6:[function(require,module,exports){
'use strict';

var _toGrf = require('../utils/to-grf');

scene.ImageView.prototype.toZpl = function (T, I) {
  var _this = this;

  /* 이미지 타입이면, ZPL을 생성하지 않고 리턴한다. */
  if (I) return;

  var src = this.model.src;


  return new Promise(function (resolve, reject) {
    (0, _toGrf.getGrfCommand)(_this.labelingBounds, typeof src === 'string' ? _this.app.url(src) : src).then(function (command) {

      resolve(command);
    }, function (error) {

      reject(error);
    });
  });
};

exports.Image = scene.ImageView;

},{"../utils/to-grf":16}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawBarcodeBefore = drawBarcodeBefore;
exports.drawBarcodeAfter = drawBarcodeAfter;
var original_draw = scene.Barcode.prototype.draw;

function drawBarcodeBefore() {
  // 바코드는 GRF 이미지를 그릴 때 무조건 스킵한다.
  scene.Barcode.prototype.draw = function (context) {
    return;
  };
}

function drawBarcodeAfter() {
  scene.Barcode.prototype.draw = original_draw;
}

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawTextBefore = drawTextBefore;
exports.drawTextAfter = drawTextAfter;

var _hasVariables = require('../../utils/has-variables');

var original_drawText = scene.Component.prototype.drawText;

function drawTextBefore() {
  scene.Component.prototype.drawText = function (context) {
    if ((0, _hasVariables.hasVariables)(this.get('text'))) return;
    return original_drawText.call(this, context);
  };
}

function drawTextAfter() {
  scene.Component.prototype.drawText = original_drawText;
}

},{"../../utils/has-variables":14}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.beforeDraw = beforeDraw;
exports.afterDraw = afterDraw;

var _drawText = require('./draw-text');

var _barcodeDraw = require('./barcode-draw');

function beforeDraw(T) {
  if (T) // [T]emplate화 하는 경우에만, drawText를 인터셉트한다.
    (0, _drawText.drawTextBefore)();

  (0, _barcodeDraw.drawBarcodeBefore)();
}

function afterDraw(T) {
  (0, _barcodeDraw.drawBarcodeAfter)();

  if (T) // [T]emplate화 하는 경우에만, drawText 인터셉트를 복구한다.
    (0, _drawText.drawTextAfter)();
}

},{"./barcode-draw":7,"./draw-text":8}],10:[function(require,module,exports){
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

scene.Line.prototype._toZpl = function (T, I) {
  /* 이미지 타입이면, ZPL을 생성하지 않고 리턴한다. */
  if (I) return;

  var bounds = this.labelingBounds;
  var zpl;

  if (bounds.width < 0.5 || bounds.height < 0.5) {

    // 라인이 직선일 때에도 GB로직을 타며 테두리의 좌표값을 계산해 줘야 함.
    if (bounds.width == 0) {
      bounds.left -= this.borderThickness / 2;
      bounds.width += this.borderThickness / 2;
    } else if (bounds.height == 0) {
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
  if (T ? this.get('text') : this.text) zpl += this.toZplForText(T, I);

  return zpl;
};

exports.Line = scene.Line;

},{"./rect":11,"./text":13}],11:[function(require,module,exports){
'use strict';

require('./text');

scene.Component.prototype.toZplForRect = function (bounds, lineColor, borderThickness, round) {
  var top = bounds.top;
  var left = bounds.left;
  var width = bounds.width;
  var height = bounds.height;
  var _model = this.model;
  var fill = _model.fill;
  var lineWidth = _model.lineWidth;
  var type = _model.type;

  /*  라인일때는 기존 로직 유지, 아무것도 더하지 않고 사각형 일때는 테두리만큼 좌표를 빼고 크기를 더해야 한다.
   *  (ZPL은 테두리가 안으로 커지고 캔버스는 양쪽으로 커지기 때문)
   */

  var borderCulc = type == 'rect' ? Math.round(lineWidth / 3) : 0;
  var caseFill = fill ? borderCulc : 0;

  var commands = [['^FO' + (left - borderCulc), top - borderCulc], ['^GB' + (width + borderCulc * 2), height + borderCulc * 2, borderThickness + caseFill, lineColor, Math.round(round * 8 / 100)], ['^FS']];

  return commands.map(function (command) {
    return command.join(',');
  }).join('\n') + '\n';
};

scene.Rect.prototype._toZpl = function (T, I) {

  /* 이미지 타입이면, ZPL을 생성하지 않고 리턴한다. */
  if (I) return;

  var _model$round = this.model.round;
  var round = _model$round === undefined ? 0 : _model$round;


  var zpl = this.toZplForRect(this.labelingBounds, this.lineColor, this.borderThickness, round);

  // build text command
  if (T ? this.get('text') : this.text) zpl += this.toZplForText(T, I);

  return zpl;
};

exports.Rect = scene.Rect;

},{"./text":13}],12:[function(require,module,exports){
'use strict';

var _toGrf = require('../utils/to-grf');

var _interceptors = require('./interceptors');

var config = require('../../config').config;

/**
 * 이미지 기반의 ZPL 커맨드를 만드는 메쏘드이다.
 * 내부 컴포넌트 중에서 바코드 라벨과 변수화된 텍스트를 제외하고는 모두 GRF 이미지로 만들어진다.
 */
scene.Scene.prototype.toGRF = function () {

  var bounds = this.root.bounds;
  var ratio = this.root.labelingRatio;

  bounds.width = Math.round(bounds.width * ratio);
  bounds.height = Math.round(bounds.height * ratio);

  return (0, _toGrf.getGrfCommand)(bounds, this.toDataURL(undefined, undefined, bounds.width, bounds.height));
};

// 이 API는 위의 toGRF로 통합될 예정임.
scene.Scene.prototype.toTemplateGRF = function (T) {
  var _this = this;

  // 1. pending 객체를 만든다.

  var pendings = [];

  // 2. scene의 모든 컴포넌트에 대해서 prepare(resolve, reject)와 prepareFill(resolve, reject)를 호출한다.
  // ... traverse => pending promises를 채운다.
  this.root.traverse(function (component) {
    pendings.push(new Promise(function (resolve, reject) {
      component.prepare(resolve, reject);
    }));

    pendings.push(new Promise(function (resolve, reject) {
      component.prepareFill(resolve, reject);
    }));
  }, this);

  // 3. 최종 promise 객체를 넘긴다.
  return new Promise(function (resolve, reject) {

    // 4. pending 객체가 다 완료되면, 해당 컨텍스트에 다시한번 그린다. 이 때는 펜딩객체는 필요없다.
    //    그런 다음. GRF 이미지를 구하고, 모델레이어의 원래 위치와 스케일로 되돌린다.
    Promise.all(pendings).then(function (results) {

      // 5. Scene의 바운드를 구한다.
      var _root$bounds = _this.root.bounds;
      var left = _root$bounds.left;
      var top = _root$bounds.top;
      var width = _root$bounds.width;
      var height = _root$bounds.height;

      var ratio = _this.root.labelingRatio;

      var print_left = Math.round(left * ratio);
      var print_top = Math.round(top * ratio);
      var print_width = Math.round(width * ratio);
      var print_height = Math.round(height * ratio);

      // 3. Scene의 바운드에 근거하여, 오프스크린 캔바스를 만들고, 프린트 높이/폭만큼 캔바스의 크기를 설정한다.
      var canvas = scene.Component.createCanvas(print_width * scene.DPPX, print_height * scene.DPPX);

      // 4. 모델레이어의 원래 위치와 스케일을 저장한다.
      var translate = _this.root.get('translate');
      var scale = _this.root.get('scale');

      _this.root.set('translate', { x: 0, y: 0 });
      _this.root.set('scale', { x: print_width / width, y: print_height / height });

      // 5. 오프스크린 캔바스의 Context2D를 구한뒤, 모델레이어를 그 위에 그린다.
      //    이 때, 위에서 준비한 펜딩객체를 넘겨준다.
      var context = canvas.getContext('2d');

      (0, _interceptors.beforeDraw)(T); // 그려야 할 것들만 그린다.
      _this.root.draw(context);
      (0, _interceptors.afterDraw)(T);

      _this.root.set('translate', translate);
      _this.root.set('scale', scale);

      var promises = [];

      promises.push((0, _toGrf.getGrfCommand)({
        left: print_left,
        top: print_top,
        width: print_width,
        height: print_height
      }, canvas.toDataURL()));

      if (T) {
        _this.root.forEach(function (component) {
          promises.push(component.toZpl(T, true)); // [T]emplate, [I]mage 파라미터를 패스한다.
        });
      }

      Promise.all(promises).then(function (results) {

        resolve(results.filter(function (result) {
          return !!result;
        }).join('\n'));
      }, function (error) {

        reject(error);
      });
    }, function (error) {
      console.error(error);

      reject(error);
    });
  });
};

scene.Scene.prototype.toZpl = function (T, I, dpi) {
  var _this2 = this;

  /* 기본 DPI를 저장. 완료후에 복구. */
  var origin_dpi = config.dpi;

  if (dpi) config.dpi = dpi;

  var labelWidth = Number(this.root.get('width')) / 100;

  return new Promise(function (resolve, reject) {
    if (I) {
      // 이미지(GRF) 타입인 경우.
      _this2.toTemplateGRF(T).then(function (result) {
        var widthInDots = Math.round(labelWidth / 2.54 * config.dpi);

        resolve(['^XA', '^PW' + widthInDots + '\n', result, '^XZ'].join('\n'));

        config.dpi = origin_dpi;
      }, function (reason) {
        reject(reason);

        config.dpi = origin_dpi;
      });
    } else {
      // ZPL 타입인 경우.
      _this2.root.toZpl(T, I).then(function (result) {
        var widthInDots = Math.round(labelWidth / 2.54 * config.dpi);

        resolve(['^XA', '^PW' + widthInDots + '\n', result, '^XZ'].join('\n'));

        config.dpi = origin_dpi;
      }, function (reason) {
        reject(reason);

        config.dpi = origin_dpi;
      });
    }
  });
};

exports.Scene = scene.Scene;

},{"../../config":1,"../utils/to-grf":16,"./interceptors":9}],13:[function(require,module,exports){
'use strict';

var _hasVariables = require('../utils/has-variables');

var config = require('../../config').config;

var MAX_NUMBER_OF_LINES = 100;

scene.Component.prototype.toZplForText = function (T, I) {

  /* 이미지 타입이며, 변수가 없는 경우는 그냥 리턴한다. */
  if (I && !(0, _hasVariables.hasVariables)(this.get('text'))) return;

  var _model = this.model;
  var textAlign = _model.textAlign;
  var textBaseline = _model.textBaseline;
  var _model$fontCode = _model.fontCode;
  var fontCode = _model$fontCode === undefined ? '6' : _model$fontCode;
  var _labelingTextBounds = this.labelingTextBounds;
  var left = _labelingTextBounds.left;
  var top = _labelingTextBounds.top;
  var width = _labelingTextBounds.width;
  var height = _labelingTextBounds.height;


  var orientation = this.orientation;
  var lineSpace = Math.round((this.lineHeight - this.fontSize) * this.labelingRatio);
  var text = T ? this.get('text') : this.text;
  var charHeight = this.fontSize * this.labelingRatio;
  var charWidth = this.fontSize * this.labelingRatio;

  var fontNo = fontCode; //config.fontNo || 'A';


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

  // ^FB가 있을때에 \&는 개행 명령어임.
  if (text.indexOf('\n') != -1) text = text.replace(/\n/g, '\\&\n');

  var commands = [['^FO' + left, top],
  // ['^A@'+orientation, charHeight, charWidth * 0.75],
  ['^A' + fontNo + orientation, Math.round(charHeight), Math.round(charWidth)], // FIXME
  ['^FB' + width, MAX_NUMBER_OF_LINES, lineSpace, justification, hangingIndent], ['^FD' + text], ['^FS']];

  return commands.map(function (command) {
    return command.join(',');
  }).join('\n') + '\n';
};

scene.Text.prototype._toZpl = function (T, I) {

  return this.toZplForText(T, I);
};

exports.Text = scene.Text;

},{"../../config":1,"../utils/has-variables":14}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasVariables = hasVariables;
function hasVariables(text) {
  if (!text) return false;

  // 내부 속성용 변수 표현이 있는 지 확인한다.
  if (text.search(/#{(\S*)}/) !== -1) return true;

  // 변수용 변수 표현이 있는 지 확인한다.
  if (text.search(/\${[^}]*}/) !== -1) return true;

  return false;
}

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

      context.drawImage(image, 0, 0, this.width, this.height, 0, 0, width, height);

      var _context$getImageData = context.getImageData(0, 0, width, height);

      var data = _context$getImageData.data;


      var grf = buildImageGrf(width, height, (0, _rgbBinarize.binarize)(width, height, data));

      typeof document !== 'undefined' && canvas.remove();

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

},{"./rgb-binarize":15}]},{},[2]);
