/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
require('./text');

scene.Component.prototype.toZplForEllipse = function(bounds, lineColor, borderThickness) {
  var {
    top,
    left,
    width,
    height,
  } = bounds;

  var {
    fill,
    lineWidth
  } = this.model;

  var commands = [];

  var borderCulc = Math.round(lineWidth / 3)
  var caseFill = fill ? borderCulc : 0

  commands.push(['^FO' + (left - borderCulc), top - borderCulc]);
  if(width === height)
    commands.push(['^GC' + (width + borderCulc * 2), borderThickness + caseFill, lineColor]);
  else
    commands.push(['^GE' + (width + borderCulc * 2), (height + borderCulc * 2), borderThickness + caseFill, lineColor]);
  commands.push(['^FS']);

  return commands.map(command => {
    return command.join(',')
  }).join('\n') + '\n';
};

scene.Ellipse.prototype._toZpl = function(T, I) {

  /* 이미지 타입이면, ZPL을 생성하지 않고 리턴한다. */
  if(I)
    return;

  var zpl = this.toZplForEllipse(
    this.labelingBounds,
    this.lineColor,
    this.borderThickness
  );

  // build text command
  if((T ? this.get('text') : this.text))
    zpl += this.toZplForText(T, I);

	return zpl;
}

exports.Ellipse = scene.Ellipse;
