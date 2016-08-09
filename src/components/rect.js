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
