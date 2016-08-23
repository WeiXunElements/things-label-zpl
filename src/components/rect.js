require('./text');

scene.Component.prototype.toZplForRect = function(bounds, lineColor, borderThickness, round) {
  var {
    top,
    left,
    width,
    height
  } = bounds;

  var commands = [
    ['^FO' + left, top],
    ['^GB' + width, height, borderThickness, lineColor, Math.round(round * 8 / 100)],
    ['^FS']
  ];

  return commands.map(command => {
    return command.join(',')
  }).join('\n') + '\n';
};

scene.Rect.prototype._toZpl = function(T, I) {

  /* 이미지 타입이면, ZPL을 생성하지 않고 리턴한다. */
  if(I)
    return;

  var {
    round = 0
  } = this.model

  var zpl = this.toZplForRect(
    this.labelingBounds,
    this.lineColor,
    this.borderThickness,
    round
  );

  // build text command
  if((T ? this.get('text') : this.text))
    zpl += this.toZplForText(T, I);

  return zpl;
}

exports.Rect = scene.Rect;
