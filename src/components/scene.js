import { getGrfCommand } from '../utils/to-grf'

import { beforeDraw, afterDraw } from './interceptors'

var config = require('../../config').config

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
scene.Scene.prototype.toTemplateGRF = function(T) {
  // 1. pending 객체를 만든다.

  var pendings = [];

  // 2. scene의 모든 컴포넌트에 대해서 prepare(resolve, reject)와 prepareFill(resolve, reject)를 호출한다.
  // ... traverse => pending promises를 채운다.
  this.root.traverse((component) => {
    pendings.push(new Promise((resolve, reject) => {
      component.prepare(resolve, reject);
    }));

    pendings.push(new Promise((resolve, reject) => {
      component.prepareFill(resolve, reject);
    }));
  }, this);

  // 3. 최종 promise 객체를 넘긴다.
  return new Promise((resolve, reject) => {

    // 4. pending 객체가 다 완료되면, 해당 컨텍스트에 다시한번 그린다. 이 때는 펜딩객체는 필요없다.
    //    그런 다음. GRF 이미지를 구하고, 모델레이어의 원래 위치와 스케일로 되돌린다.
    Promise.all(pendings).then(results => {

      // 5. Scene의 바운드를 구한다.
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

      // 3. Scene의 바운드에 근거하여, 오프스크린 캔바스를 만들고, 프린트 높이/폭만큼 캔바스의 크기를 설정한다.
      var canvas = scene.Component.createCanvas(print_width * scene.DPPX, print_height * scene.DPPX);

      // 4. 모델레이어의 원래 위치와 스케일을 저장한다.
      var translate = this.root.get('translate');
      var scale = this.root.get('scale');

      this.root.set('translate', {x: 0, y: 0});
      this.root.set('scale', {x: print_width / width, y: print_height / height});

      // 5. 오프스크린 캔바스의 Context2D를 구한뒤, 모델레이어를 그 위에 그린다.
      //    이 때, 위에서 준비한 펜딩객체를 넘겨준다.
      var context = canvas.getContext('2d');

      beforeDraw(T); // 그려야 할 것들만 그린다.
      this.root.draw(context);
      afterDraw(T);

      this.root.set('translate', translate);
      this.root.set('scale', scale);

      var promises = [];

      promises.push(getGrfCommand({
        left: print_left,
        top: print_top,
        width: print_width,
        height: print_height
      }, canvas.toDataURL()));

      if(T) {
        this.root.forEach(component => {
          promises.push(component.toZpl(T, true)); // [T]emplate, [I]mage 파라미터를 패스한다.
        });
      }

      Promise.all(promises).then(results => {

        resolve(results.filter(result => {
          return !!result;
        }).join('\n'));
      }, error => {

        reject(error);
      })
    }, error => {
      console.error(error);

      reject(error);
    });
  });
}

scene.Scene.prototype.toZpl = function(T, I, dpi) {

  /* 기본 DPI를 저장. 완료후에 복구. */
  var origin_dpi = config.dpi;

  if(dpi)
    config.dpi = dpi;

  var labelWidth = Number(this.root.get('width')) / 100;

  return new Promise((resolve, reject) => {
    if(I) { // 이미지(GRF) 타입인 경우.
      this.toTemplateGRF(T).then(result => {
        let widthInDots = Math.round(labelWidth / 2.54 * config.dpi);

        resolve([
            '^XA',
            '^PW' + widthInDots + '\n',
            result,
            '^XZ'
          ].join('\n')
        );

        config.dpi = origin_dpi;
      }, reason => {
        reject(reason);

        config.dpi = origin_dpi;
      });

    } else { // ZPL 타입인 경우.
      this.root.toZpl(T, I).then(result => {
        let widthInDots = Math.round(labelWidth / 2.54 * config.dpi);

        resolve([
            '^XA',
            '^PW' + widthInDots + '\n',
            result,
            '^XZ'
          ].join('\n')
        );

        config.dpi = origin_dpi;
      }, reason => {
        reject(reason);

        config.dpi = origin_dpi;
      });
    }
  });
}

exports.Scene = scene.Scene;
