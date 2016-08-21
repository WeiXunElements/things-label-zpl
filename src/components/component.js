import { getGrfCommand } from '../utils/to-grf'

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
    var printerDPMM = printerDPI / 2.54 / 10; // mm 당 프린트 도트 갯수.
    var modelUnit = 0.1; // 모델링에서 사용된 수치값은 0.1mm 단위라는 뜻.

    return printerDPMM * modelUnit;
  }
});

/**
 * 이미지 기반의 ZPL 커맨드를 만드는 메쏘드이다.
 * 내부 컴포넌트 중에서 바코드 라벨과 변수화된 텍스트를 제외하고는 모두 GRF 이미지로 만들어진다.
 */
scene.Scene.prototype.toGRF = function() {

  var bounds = this.root.bounds;
  var ratio = this.root.labelingRatio;

  bounds.width = Math.round(bounds.width * ratio);
  bounds.height = Math.round(bounds.height * ratio);

  return getGrfCommand(bounds, this.toDataURL(undefined, undefined, bounds.width, bounds.height));
}

// 이 API는 위의 toGRF로 통합될 예정임.
scene.Scene.prototype.toTemplateGRF = function() {

  // 1. Scene의 바운드를 구한다.
  var {
    left,
    top,
    width,
    height
  } = this.root.bounds;
  var ratio = this.root.labelingRatio;

  var print_left = Math.round(left * ratio);
  var print_top = Math.round(top * ratio);
  var print_width = Math.round(width * ratio);
  var print_height = Math.round(height * ratio);

  // 2. pending 객체를 만든다.

  var pending = {
    promise: [],
    ready: () => {

    },
    done: () => {

    }
  };

  // 3. Scene의 바운드에 근거하여, 오프스크린 캔바스를 만들고, 프린트 높이/폭만큼 캔바스의 크기를 설정한다.

  var canvas = document.createElement("canvas");

  canvas.width = print_width * scene.DPPX;
  canvas.height = print_height * scene.DPPX;

  // 4. 모델레이어의 원래 위치와 스케일을 저장한다.
  var translate = this.model_layer.get('translate');
  var scale = this.model_layer.get('scale');

  this.model_layer.set('translate', {x: 0, y: 0});
  this.model_layer.set('scale', {x: print_width / width, y: print_height / height});

  // 5. 오프스크린 캔바스의 Context2D를 구한뒤, 모델레이어를 그 위에 그린다.
  //    이 때, 위에서 준비한 펜딩객체를 넘겨준다.
  var context = canvas.getContext('2d');
  this.model_layer.draw(context, pending);

  return new Promise((resolve, reject) => {
    var promises = this.components.map(component => {
      return component.toZpl(T);
    });

    // 6. pending 객체가 다 완료되면, 해당 컨텍스트에 다시한번 그린다. 이 때는 펜딩객체는 필요없다.
    //    그런 다음. GRF 이미지를 구하고, 모델레이어의 원래 위치와 스케일로 되돌린다.
    Promise.all(pending.promises).then(results => {

      scene.root.draw(context);

      this.model_layer.set('translate', translate);
      this.model_layer.set('scale', scale);

      canvas.remove();

      var command = getGrfCommand({
        left: print_left,
        top: print_top,
        width: print_width,
        height: print_height
      }, canvas.toDataURL());

      resolve(command)
    }, error => {
      console.error(error);

      this.model_layer.set('translate', translate);
      this.model_layer.set('scale', scale);

      canvas.remove();

      reject(error);
    });
  });
}

scene.Scene.prototype.toZpl = function(T, I) {

  var labelWidth = Number(this.root.get('width')) / 100;

  return new Promise((resolve, reject) => {
    if(I) {
      this.toGRF().then(result => {
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
    } else {
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
    }
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

    return Math.round(lineWidth * this.labelingRatio);
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
      return Math.round(Math.min(width, height) / 2);
    else
      return Math.round(lineWidth * this.labelingRatio);
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

    /**
     * ZPL 템플릿으로는 프린트 시점에 몇 줄이 될 지 알 수 없으므로,
     * - textBaseline 속성은 무조건 TOP 이라고 전제한다.
     * - text는 무조건 한 줄이라고 전제한다.
     * 따라서, height 값은 무조건 fontSize로 한다.
     *
     * TODO. 무조건 한줄이라는 전제조건이면, textBaseline기능이 계산될 수 있으므로, 개선하자.
     * 또한, 템플릿으로 프린트하지 않는 경우에는 몇줄이 되더라도 계산이 가능하므로, 개선하자.
     */
    height = this.fontSize;

    var p1 = this.transcoordS2T(left, top);
    var p2 = this.transcoordS2T(left + width, top + height);

    var left = Math.min(p1.x, p2.x) * this.labelingRatio;
    var top = Math.min(p1.y, p2.y) * this.labelingRatio;

    var width = Math.abs(p2.x - p1.x) * this.labelingRatio;
    var height = Math.abs(p2.y - p1.y) * this.labelingRatio;

    return {
      left: Math.round(left),
      top: Math.round(top),
      width: Math.round(width),
      height: Math.round(height)
    };
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

    return {
      left: Math.round(left),
      top: Math.round(top),
      width: Math.round(width),
      height: Math.round(height)
    };
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
