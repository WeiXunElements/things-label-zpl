var config = require('../../config').config

const MAX_NUMBER_OF_LINES = 10;

scene.Component.prototype.toZplForText = function() {
  // text 에서는 left, top만 위치를 결정함, width, height는 의미가 없음.
  var {
    textWrap,
    textAlign,
    textBaseline
  } = this.model

  var {
    left,
    top,
    width,
    height
  } = this.labelingTextBounds;

  var orientation = this.orientation;
  var lineSpace = this.lineHeight - this.fontSize;
  var text = this.text;
  var charHeight = this.fontSize;
  var charWidth = this.fontSize;

  var fontNo = config.fontNo || 'A';
  var justification;

  if(textWrap) {
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

scene.Text.prototype.toZpl = function() {

  return this.toZplForText()
}

exports.Text = scene.Text;
