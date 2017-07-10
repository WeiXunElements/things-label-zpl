/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
require('./text');

scene.Component.prototype.toZplForRect = function(bounds, lineColor, borderThickness, round) {
  var {
    top,
    left,
    width,
    height
  } = bounds;

  var {
    fill,
    lineWidth,
    type
  } = this.model;

  /*  라인일때는 기존 로직 유지, 아무것도 더하지 않고 사각형 일때는 테두리만큼 좌표를 빼고 크기를 더해야 한다.
   *  (ZPL은 테두리가 안으로 커지고 캔버스는 양쪽으로 커지기 때문)
   */
  var borderCulc = type == 'rect' ? Math.round(lineWidth / 3) : 0
  var caseFill = fill ? borderCulc : 0

  var commands = [
    ['^FO' + (left - borderCulc), top - borderCulc],
    ['^GB' + (width + borderCulc * 2), height + borderCulc * 2, borderThickness + caseFill, lineColor, Math.round(round * 8 / 100)],
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
