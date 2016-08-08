require('./text');

scene.Component.prototype.toZplForRect = function(bounds, lineColor, borderThickness, round) {
  var {
    top,
    left,
    width,
    height
  } = bounds;

  // 라인이 직선일 때에도 GB로직을 타며 테두리의 좌표값을 계산해 줘야 함.
  if(width == 0){
    top += borderThickness / 2;
  } else if(height == 0){
    left += borderThickness / 2;
  }

  var commands = [
    ['^FO' + left, top],
    ['^GB' + width, height, borderThickness, lineColor, Math.round(round * 8 / 100)],
    ['^FS']
  ];

  return commands.map(command => {
    return command.join(',')
  }).join('\n') + '\n';
};

scene.Rect.prototype._toZpl = function() {
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
  if(this.text)
    zpl += this.toZplForText();

  return zpl;
}

exports.Rect = scene.Rect;
