import { hasVariables } from '../utils/has-variables'
var config = require('../../config').config

const MAX_NUMBER_OF_LINES = 100;

scene.Component.prototype.toZplForText = function(T, I) {

  /* 이미지 타입이며, 변수가 없는 경우는 그냥 리턴한다. */
  if(I && !hasVariables(this.get('text')))
    return;

  var {
    textWrap,
    textAlign,
    textBaseline,
    fontCode = '1'
  } = this.model

  var {
    left,
    top,
    width,
    height
  } = this.labelingTextBounds;

  var orientation = this.orientation;
  var lineSpace = Math.round((this.lineHeight - this.fontSize) * this.labelingRatio);
  var text = T ? this.get('text') : this.text;
  var charHeight = this.fontSize * this.labelingRatio;
  var charWidth = this.fontSize * this.labelingRatio;

  var fontNo = fontCode; //config.fontNo || 'A';

  if(textWrap) {

    var justification;

    switch(textAlign) {
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

    var commands = [
      ['^FO' + left, top],
      // ['^A@'+orientation, charHeight, charWidth * 0.75],
      ['^A' + fontNo + orientation, charHeight, charWidth], // FIXME
      ['^FB' + width, MAX_NUMBER_OF_LINES, lineSpace, justification, hangingIndent],
      ['^FD' + text],
      ['^FS']
    ];
  } else {
    var commands = [
      ['^FO' + left, top],
      // ['^A@' + orientation, charHeight, charWidth * 0.75],
      ['^A' + fontNo + orientation, charHeight, charWidth],
      ['^FD' + text],
      ['^FS']
    ];
  }

  return commands.map(command => {
    return command.join(',')
  }).join('\n') + '\n';
}

scene.Text.prototype._toZpl = function(T, I) {

  return this.toZplForText(T, I)
}

exports.Text = scene.Text;
