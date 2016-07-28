var T = require('./text')
var shapeTranscoord = require('./transcoord').shapeTranscoord
var rotateCase = require('./transcoord').rotateCase

scene.Rect.prototype.toZpl = function() {
  var {
    lineWidth,
    fillStyle,
    strokeStyle,
    rotation,
    round = 0,  // 0 ~ 100
    text
  } = this.model

  var {
    width,
    height,
    left,
    top
  } = this.bounds

  var rotate = rotateCase(rotation);

  switch(rotate) {
    case 'N':
    case 'I':
    default:
      break;
    case 'R':
    case 'B':
      let tmp = width;
      width = height;
      height = tmp;

      let startPoint = shapeTranscoord(this.model);
      left = startPoint.x;
      top = startPoint.y;
      break;
  }


  if (strokeStyle === 'white' || strokeStyle === '#fff'
    || (strokeStyle === '#ffffff')) {
    strokeStyle = 'W';
  } else {
    strokeStyle = 'B'
  }

  if (fillStyle) {
    if (fillStyle === 'white' || fillStyle === '#fff'
      || (fillStyle === '#ffffff')) {
      fillStyle = 'W';
    } else {
      fillStyle = 'B'
    }

    lineWidth = height;
    strokeStyle = fillStyle;
  }

  // left += group ? group.left || 0 : 0;
  // top += group ? group.top || 0 : 0;

  var commands = [
    ['^FO' + left, top],
    ['^GB' + width||'', height||'', lineWidth||'', strokeStyle||'', Math.round(round * 8 / 100)],
    ['^FS']
  ];

  var zpl = commands.map(command => {
    return command.join(',')
  }).join('\n') + '\n\n';

  // make text command
  if (text) {
    // var texts = new T.Text(this.model);
    zpl += this.toZplForText();
  }

  return zpl;
}

exports.Rect = scene.Rect;
