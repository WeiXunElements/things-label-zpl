var config = require('../../config').config
var Line = require('./line').Line
var textTranscoord = require('./transcoord').textTranscoord
var transcoordS2P = require('./transcoord').transcoordS2P
var rotateCase = require('./transcoord').rotateCase

const MAX_NUMBER_OF_LINES = 10;

scene.Component.prototype.toZplForText = function() {
  // text 에서는 left, top만 위치를 결정함, width, height는 의미가 없음.
  var {
    text = '',
    textType,
    charWidth,
    charHeight,
    underline,
    strike,

    hangingIndent,
    lineSpace
  } = this.model

  if (!width) {
    this.model.width = charWidth * text.length;
  }

  if (!height || height === '') {
    this.model.height = charHeight;
  }

  var startPoint = textTranscoord(this.model)
  left = startPoint.x;
  top = startPoint.y;

  // left += group ? group.left || 0 : 0;
  // top += group ? group.top || 0 : 0;

  var rotate = rotation || '';
  // rotate += group ? group.rotation || 0 : 0;

  var textAlign = this.model.textAlign || '';

  rotate = rotateCase(rotation);

  var fontNo = config.fontNo || 0;
  if (textType === 'W' || textType === 'w') {
    switch(textAlign) {
      case 'right':
        textAlign = 'R';
        break;
      case 'justified':
        textAlign = 'J';
        break;
      case 'center':
        textAlign = 'C';
        break;
      case 'left':
      default:
        textAlign = 'L';
        break;
    }

    var commands = [
      ['^FO' + left, top],
      // ['^A@'+rotate, charHeight, charWidth * 0.75],
      ['^A' + fontNo + rotate, charHeight, charWidth], // FIXME
      ['^FB' + width, MAX_NUMBER_OF_LINES, lineSpace, textAlign, hangingIndent],
      ['^FD' + text],
      ['^FS']
    ];
  } else {
    var commands = [
      ['^FO'+left, top],
      // ['^A@' + rotate, charHeight, charWidth * 0.75],
      ['^A'+fontNo+rotate, charHeight, charWidth],
      ['^FD'+text],
      ['^FS']
    ];
  }

  var zpl = '';
  zpl += lineZpl.call(this, rotate);
  commands.forEach(c => {
    zpl += c.join(',') + '\n'
  });

  return zpl;
}

scene.Text.prototype.toZpl = function() {
  return this.toZplForText()
}

/*
 * 텍스트와 관련된 라인을 그린다. (underline, strike)
 * 필수 기능은 아니라고 생각한다. (삭제 고려)
 */
function lineZpl(rotate) {
  var {
    left,
    top,
    width,
    textWidth,
    charHeight,
    lineCount = 1,

    underline,
    strike,
  } = this.model;

  textWidth = textWidth || width;

  var x = left;

  var points = [];
  var zpl = '';
  if (underline) {
    let y = top;
    for (let i = 0; i < lineCount; i++) {
      y += charHeight;
      points.push({x1: x, x2: x+textWidth, y1: y, y2: y});
    }
  }

  if (strike) {
    let y = top + charHeight/2;
    for (let i = 0; i < lineCount; i++) {
      points.push({x1: x, x2: x+textWidth, y1: y, y2: y});
      y += charHeight;
    }
  }

  var rotatePoints = points.map((point) => {
    let sp = transcoordS2P(point.x1, point.y1, this.model);
    let ep = transcoordS2P(point.x2, point.y2, this.model);

    return { x1: sp.x, x2: ep.x, y1: sp.y, y2: ep.y };
  });

  rotatePoints.forEach((point) => {
    let line = new Line(point);
    zpl += line.toZpl(null /*group*/);
  });

  return zpl;
}

/*
 * 텍스트와 관련된 라인을 그릴 때, 텍스트의 방향에 따라서 라인의 시작/종료 위치를 결정한다.
 */
function rotateLine(rotate, x, textWidth, y, ty, lineIndex) {
  /*
   * N = normal
   * R = rotated 90 degrees (clockwise)
   * I = inverted 180 degrees
   * B = read from bottom up, 270 degrees
  */
  switch(rotate) {
    case 'R':
      return {x1: x, x2: x, y1: y, y2: y+textWidth};
      break;
    case 'I':
      return {x1: x, x2: x+textWidth, y1: y, y2: y};
      break;
    case 'B':
      return {x1: x+ty, x2: x+ty, y1: y, y2: y+textWidth};
      break;
    case 'N':
    default:
      return {x1: x, x2: x+textWidth, y1: y+ty, y2: y+ty};
      break;
  }
}

exports.Text = scene.Text;
