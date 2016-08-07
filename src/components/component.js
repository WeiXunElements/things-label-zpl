const ORIENTATION = {
  NORMAL: 'N',
  ROTATE_90: 'R',
  INVERTED_180: 'I',
  BOTTOM_UP_270: 'B'
}

function isBlackColor(color) {
  return color === 'black' ||
    color === '#000' ||
    color === '#000000';
}

scene.Scene.prototype.toZpl = function() {
  return [
    '^XA',
    '^PW' + (80 / 2.54 * 203) + '\n',
    this.root.toZpl(),
    '^XZ'
  ].join('\n');
}

scene.Component.prototype.toZpl = function() {

  return '';
}

scene.Container.prototype.toZpl = function() {

  return this.components.map(component => {
    return component.toZpl();
  }).join();
}

Object.defineProperty(scene.Component.prototype, "lineColor", {

  get: function() {
    var {
      strokeStyle,
      fillStyle
    } = this.model;

    if(isBlackColor(strokeStyle) || isBlackColor(fillStyle))
      return 'B';
    else
      return 'W';
  }
});

Object.defineProperty(scene.Component.prototype, "borderThickness", {

  get: function() {
    var {
      fillStyle,
      lineWidth
    } = this.model;

    var {
      width,
      height
    } = this.labelingBounds;

    if(isBlackColor(fillStyle))
      return Math.min(width, height) / 2;
    else
      return lineWidth;
  }
});

Object.defineProperty(scene.Component.prototype, "textBounds", {

  get: function() {
    var {
      left,
      top,
      width,
      height
    } = this.bounds;

    left += this.paddingLeft || 0;
    top += this.paddingTop || 0;
    width -= (this.paddingLeft || 0) + (this.paddingRight || 0);
    height -= (this.paddingTop || 0) + (this.paddingBottom || 0);

    return {left, top, width, height};
  }
});

Object.defineProperty(scene.Component.prototype, "labelingTextBounds", {

  get: function() {
    var {
      left,
      top,
      width,
      height
    } = this.textBounds;

    left += this.paddingLeft || 0;
    top += this.paddingTop || 0;
    width -= (this.paddingLeft || 0) + (this.paddingRight || 0);
    height -= (this.paddingTop || 0) + (this.paddingBottom || 0);

    return {left, top, width, height};
  }
});

Object.defineProperty(scene.Component.prototype, "labelingBounds", {

  get: function() {
    var {
      left,
      top,
      width,
      height
    } = this.bounds;

    var p1 = this.transcoordS2T(left, top);
    var p2 = this.transcoordS2T(left + width, top + height);

    var left = Math.min(p1.x, p2.x);
    var top = Math.min(p1.y, p2.y);

    var width = Math.abs(p2.x - p1.x);
    var height = Math.abs(p2.y - p1.y);

    return {left, top, width, height};
  }
});

Object.defineProperty(scene.Component.prototype, "absoluteRotation", {

  get: function() {

    var rotation = 0;
    var parent = this;

    while(parent) {
      rotation += parent.get('rotation') || 0;
      parent = parent.parent;
    }

    return rotation;
  }
});

Object.defineProperty(scene.Component.prototype, "orientation", {

  get: function() {
    var rotation = this.absoluteRotation % (Math.PI * 2);

    if (Math.PI * -0.25 < rotation && rotation <= Math.PI * 0.25)
      return ORIENTATION.NORMAL;
    else if (Math.PI * 0.25 < rotation && rotation <= Math.PI * 0.75)
      return ORIENTATION.ROTATE_90;
    else if ((Math.PI * 0.75 < rotation && rotation <= Math.PI * 1.25)
      || (Math.PI * -1.25 < rotation && rotation <= Math.PI * -0.75))
      return ORIENTATION.INVERTED_180;
    if ((Math.PI < rotation * 1.25 && rotation <= Math.PI * 1.75)
      || (Math.PI * -0.75 < rotation && rotation <= Math.PI * -0.25))
      return ORIENTATION.BOTTOM_UP_270;
  }
});

exports.Component = scene.Component;
