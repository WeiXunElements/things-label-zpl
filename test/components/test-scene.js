import { expect } from 'chai'
import { parseZpl } from '../util'

require('../../src/components/component');
require('../../src/components/text');
require('../../src/components/barcode');
require('../../src/components/rect');
require('../../src/components/ellipse');
require('../../src/components/line');
require('../../src/components/image');

describe('ZPL Builder', function () {

  describe('컨테이너가 없는 경우.', function () {

    var model;

    beforeEach(function () {
      model = {
        id: 'root',
        width: 150,
        height: 150,
        unit: 'cm',
        fillStyle: 'lightgray',
        components: [{
          id: 'target',
          type: 'text',
          left : 150,
          top : 50,
          width : 200,
          height : 200,
          fontSize: 20,
          fontColor: 'black',
          textAlign: 'center',
          textWrap: false,
          text : 'ABCDEFG BBBBBBBB CCCCCCCC'
        }, {
          type: 'rect',
          top: 5,
          left: 5,
          width: 100,
          height: 20,
          alpha: 1,
          lineWidth: 1,
          strokeStyle: 'black',
          // lineHeight: 6,
          textAlign: 'justify',
          textBaseline: 'middle',
          textWrap: true,
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          fontColor: 'rgba(0, 0, 255, 0.5)',
          fontSize: 10,
          text: `QWERTYUIOP ASDFGHJKL ZXC234567`

        }, {
          type: 'rect',
          id: 'first',
          name: '첫번째 사각형',
          left: 15,
          top: 15,
          rotation: Math.PI / 2,
          width: 20,
          height: 20,
          strokeStyle: 'black',
          lineWidth: 1,
          fillStyle: 'red'
        }, {
          type: 'rect',
          id: 'second',
          name: '두번째 사각형',
          left: 15,
          top: 30,
          rotation: 0,
          width: 20,
          height: 20,
          strokeStyle: 'black',
          lineWidth: 0.5,
          fillStyle: 'blue'
        }, {
          type: 'rect',
          id: 'third',
          name: '세번째 사각형',
          left: 15,
          top: 50,
          rotation: 0,
          width: 20,
          height: 20,
          strokeStyle: 'black',
          lineWidth: 0.5,
          fillStyle: 'green'
        }, {
          type: 'container',
          left: 30,
          top: 20,
          width: 120,
          height: 120,
          strokeStyle: 'blue',
          lineWidth: '1',
          locked: true,
          components: [{
            type: 'container',
            left: 10,
            top: 10,
            width: 80,
            height: 80,
            strokeStyle: 'green',
            lineWidth: '1',
            components: [{
              type: 'ellipse',
              name: 'select layer 테스트용 원',
              cx: 45,
              cy: 30,
              rotation: Math.PI * 3 / 2,
              rx: 20,
              ry: 24,
              strokeStyle: 'black',
              lineWidth: 1
            }, {
              type: 'line',
              name: 'select layer 테스트용 라인',
              x1: 10,
              y1: 10,
              x2: 60,
              y2: 60,
              strokeStyle: 'black',
              lineWidth: 1
            }]
          }]
        }]
      };
    });

    it('GB 커맨드를 생성해야 한다.', function (done) {
      var test_scene = scene.create({
        target: {style:{}},
        model
      });

      test_scene.toZpl().then(result => {
        console.log(result);
        expect(true).to.equal(true);

        done();
      }, error => {
        console.error(error);
        expect(true).to.equal(false);

        done();
      });

    });

  });
});
