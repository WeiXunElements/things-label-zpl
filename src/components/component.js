const ORIENTATION = {
  NORMAL: 'N',
  ROTATE_90: 'R',
  INVERTED_180: 'I',
  BOTTOM_UP_270: 'B'
}

var printerDPI = 203;
var printerDPMM = printerDPI / 2.54 / 10;
var modelUnit = 0.1; // 모델링에서 사용된 수치값은 0.1mm 단위라는 뜻.
var labelingRatio = printerDPMM * modelUnit;

function isBlackColor(color) {
  return color === 'black' ||
    color === '#000' ||
    color === '#000000';
}

scene.Scene.prototype.toZpl = function() {

  var labelWidth = Number(this.root.get('width')) / 100;

  return new Promise((resolve, reject) => {
    this.root.toZpl().then(result => {
      resolve([
          '^XA',
          '^PW' + Math.round(labelWidth / 2.54 * printerDPI) + '\n',
          result,
          '^XZ'
        ].join('\n')
      );
    }, reason => {
      reject(reason);
    });
  });
}

scene.Component.prototype.toZpl = function() {

  return new Promise((resolve, reject) => {
    try {
      resolve(this._toZpl())
    } catch(error) {
      reject(error);
    }
  });
}

scene.Container.prototype.toZpl = function() {

  return new Promise((resolve, reject) => {
    var promises = this.components.map(component => {
      return component.toZpl();
    });

    Promise.all(promises).then(results => {
      resolve(results.join('\n'));
    }, error => {
      reject(error);
    });
  });
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
      return lineWidth * labelingRatio;;
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

    var p1 = this.transcoordS2T(left, top);
    var p2 = this.transcoordS2T(left + width, top + height);

    var left = Math.min(p1.x, p2.x) * labelingRatio;
    var top = Math.min(p1.y, p2.y) * labelingRatio;

    var width = Math.abs(p2.x - p1.x) * labelingRatio;
    var height = Math.abs(p2.y - p1.y) * labelingRatio;

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

    var left = Math.min(p1.x, p2.x) * labelingRatio;
    var top = Math.min(p1.y, p2.y) * labelingRatio;

    var width = Math.abs(p2.x - p1.x) * labelingRatio;
    var height = Math.abs(p2.y - p1.y) * labelingRatio;

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
