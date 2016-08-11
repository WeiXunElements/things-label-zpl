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

var printerDPI = 203;

Object.defineProperty(scene.Component.prototype, "labelingRatio", {

  get: function() {
    var printerDPMM = printerDPI / 2.54 / 10;
    var modelUnit = 0.1; // 모델링에서 사용된 수치값은 0.1mm 단위라는 뜻.

    return printerDPMM * modelUnit;
  }
});

scene.Scene.prototype.toZpl = function(T) {

  var labelWidth = Number(this.root.get('width')) / 100;

  return new Promise((resolve, reject) => {
    this.root.toZpl(T).then(result => {
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

scene.Component.prototype.toZpl = function(T) {

  return new Promise((resolve, reject) => {
    try {
      resolve(this._toZpl(T))
    } catch(error) {
      reject(error);
    }
  });
}

/**
 * ZPL로 변환한 결과를 리턴한다.
 * @T      boolean template true이면 ZPL 템플릿을 만들며, false이면 최종 ZPL을 만든다.
 * @return promise ZPL 결과를 반환하기 위한 promise 객체
 */
scene.Container.prototype.toZpl = function(T) {

  return new Promise((resolve, reject) => {
    var promises = this.components.map(component => {
      return component.toZpl(T);
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

Object.defineProperty(scene.Component.prototype, "lineWidth", {

  get: function() {
    var {
      lineWidth
    } = this.model;

    return lineWidth * this.labelingRatio;;
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
      return lineWidth * this.labelingRatio;;
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

    var left = Math.min(p1.x, p2.x) * this.labelingRatio;
    var top = Math.min(p1.y, p2.y) * this.labelingRatio;

    var width = Math.abs(p2.x - p1.x) * this.labelingRatio;
    var height = Math.abs(p2.y - p1.y) * this.labelingRatio;

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

    var left = Math.min(p1.x, p2.x) * this.labelingRatio;
    var top = Math.min(p1.y, p2.y) * this.labelingRatio;

    var width = Math.abs(p2.x - p1.x) * this.labelingRatio;
    var height = Math.abs(p2.y - p1.y) * this.labelingRatio;

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
