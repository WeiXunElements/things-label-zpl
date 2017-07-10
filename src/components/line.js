/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
require('./rect');
require('./text');

scene.Component.prototype.toZplForLine = function(bounds, lineColor, borderThickness, orientation) {
  var {
    left,
    top,
    width,
    height
  } = bounds;

  var commands = [
    ['^FO'+ left, top],
    ['^GD' + width, height, borderThickness, lineColor, orientation],
    ['^FS']
  ];

  return commands.map(command => {
    return command.join(',')
  }).join('\n') + '\n';
};

scene.Line.prototype._toZpl = function(T, I) {
  /* 이미지 타입이면, ZPL을 생성하지 않고 리턴한다. */
  if(I)
    return;

  var bounds = this.labelingBounds;
  var zpl;

  if(bounds.width < 0.5 || bounds.height < 0.5) {

    // 라인이 직선일 때에도 GB로직을 타며 테두리의 좌표값을 계산해 줘야 함.
    if(bounds.width == 0){
      bounds.left -= this.borderThickness / 2;
      bounds.width += this.borderThickness / 2;
    } else if(bounds.height == 0){
      bounds.top -= this.borderThickness / 2;
      bounds.height += this.borderThickness /2;
    }

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

    zpl = this.toZplForLine(bounds, this.lineColor, this.lineWidth, orientation);
  }

  // build text command
  if((T ? this.get('text') : this.text))
    zpl += this.toZplForText(T, I);

  return zpl;
}

exports.Line = scene.Line;
