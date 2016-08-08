require('./rect');
require('./text');

scene.Component.prototype.toZplForLine = function(bounds, lineColor, borderThickness, orientation) {
  var {
    left,
    top,
    width,
    height
  } = bounds;

  top += borderThickness / 2;
  left += borderThickness / 2;
  
  if(orientation == 'L')
    width -= borderThickness * 2;
  else if(orientation == 'R')
    width -= borderThickness;

  borderThickness *= 2;

  var commands = [
    ['^FO'+left, top],
    ['^GD' + width, height, borderThickness, lineColor, orientation],
    ['^FS']
  ];

  return commands.map(command => {
    return command.join(',')
  }).join('\n') + '\n';
};

scene.Line.prototype._toZpl = function() {
  var bounds = this.labelingBounds;
  var zpl;

  if(bounds.width == 0 || bounds.height == 0) {
    zpl = this.toZplForRect(
      bounds,
      this.lineColor,
      this.borderThickness,
      0
    );
  } else {

    var {
      x1,
      x2,
      y1,
      y2
    } = this.model;

    var p1 = this.transcoordS2T(x1, y1);
    var p2 = this.transcoordS2T(x2, y2);

    var orientation = (p1.x - p2.x) * (p1.y - p2.y) > 0 ? 'L' : 'R';

    zpl = this.toZplForLine(bounds, this.lineColor, this.borderThickness, orientation);
  }

  // build text command
  if(this.text)
    zpl += this.toZplForText();

  return zpl;
}

exports.Line = scene.Line;
