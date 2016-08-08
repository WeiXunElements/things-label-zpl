import { expect } from 'chai'
import { parseZpl } from '../util'

require('../../src/components/line');

describe('Line', function () {

  describe('그룹에 속하지 않은 경우.', function () {

    var model, scene_model;

    beforeEach(function () {
      model = {
        id: 'target',
        type: 'line',
        x1 : 50,
        y1 : 100,
        x2 : 100,
        y2 : 150,
        lineWidth : 10,
        strokeStyle : 'black',
        rotation : ''
      };

      scene_model = {
        unit: 'mm',
        width: 800,
        height: 400,
        components: [model]
      }
    });

    it('수평 또는 수직라인인 경우에 GB 커맨드를 생성해야 한다.', function () {
      model.x1 = 100;
      model.y1 = 100;
      model.x2 = 200;
      model.y2 = 100;

      var test_scene = scene.create({
        target: {style:{}},
        model: scene_model
      });

      var component = test_scene.findFirst('#target')
      var result = parseZpl(component._toZpl())

      expect(result[0].command).to.equal('FO');
      expect(result[0].params[0]).to.equal(String(model.x1));
      expect(result[0].params[1]).to.equal(String(model.y1));
      expect(result[1].command).to.equal('GB');
      expect(result[2].command).to.equal('FS');
    });

    it('사선인 경우에는 GD 커맨드를 생성해야 한다.', function () {

      model.x1 = 200;
      model.y1 = 100;
      model.x2 = 100;
      model.y2 = 200;

      var test_scene = scene.create({
        target: {style:{}},
        model: scene_model
      });

      var component = test_scene.findFirst('#target');
      var result = parseZpl(component._toZpl());

      expect(result[0].command).to.equal('FO');
      expect(result[0].params[0]).to.equal(String(100));
      expect(result[0].params[1]).to.equal(String(100));
      expect(result[1].command).to.equal('GD');
      expect(result[1].params[4]).to.equal('R');
      expect(result[2].command).to.equal('FS');
    });
  });
});
