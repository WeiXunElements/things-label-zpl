require('./text');

scene.Component.prototype.toZplForEllipse = function(bounds, lineColor, borderThickness) {
  var {
    top,
    left,
    width,
    height
  } = bounds;

  var commands = [];

  commands.push(['^FO' + left, top]);
  if(width === height)
    commands.push(['^GC' + width, borderThickness, lineColor]);
  else
    commands.push(['^GE' + width, height, borderThickness, lineColor]);
  commands.push(['^FS']);

  return commands.map(command => {
    return command.join(',')
  }).join('\n') + '\n';
};

scene.Ellipse.prototype.toZpl = function() {

  var zpl = this.toZplForEllipse(
    this.labelingBounds,
    this.lineColor,
    this.borderThickness
  );

  // build text command
  if(this.text)
    zpl += this.toZplForText();

  // console.log(zpl);
	return zpl;
}

exports.Ellipse = scene.Ellipse;
