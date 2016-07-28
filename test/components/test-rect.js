import { expect } from 'chai'
import { parseZpl } from '../util'

var { Rect } = require('../../src/components/rect')

describe('Rect', function () {

  describe('그룹에 속하지 않은 경우.', function () {

    var model, scene_model;

    beforeEach(function () {
      model = {
        id: 'target',
        type: 'rect',
        left : 150,
        top : 50,
        width : 100,
        height : 200,
        lineWidth : 10,
        fillStyle : '',
        strokeStyle : '',
        rotation : '',
        text : ''
      };

      scene_model = {
        unit: 'mm',
        width: 800,
        height: 400,
        components: [model]
      }
    });

    it('GB 커맨드를 생성해야 한다.', function () {
      var test_scene = scene.create({
        target: {style:{}},
        model: scene_model
      });

      var component = test_scene.findFirst('#target')
      var result = parseZpl(component.toZpl())
      var bounds = component.bounds

      expect(result[0].command).to.equal('FO');
      expect(result[0].params[0]).to.equal(String(bounds.left));
      expect(result[0].params[1]).to.equal(String(bounds.top));
      expect(result[1].command).to.equal('GB');
      expect(result[2].command).to.equal('FS');
    });

    it('round 값 100은 GB커맨드의 5번째 파라미터가 8로 변환되어야 한다.', function () {    // FIXME

      model.round = 100 // 최대치 100%

      var test_scene = scene.create({
        target: {style:{}},
        model: scene_model
      });

      var component = test_scene.findFirst('#target')
      var result = parseZpl(component.toZpl())

      expect(result[1].params[4]).to.equal('8');
    });

    it('round 값 50은 GB커맨드의 5번째 파라미터가 4로 변환되어야 한다.', function () {    // FIXME

      model.round = 50 // 최대치 100%

      var test_scene = scene.create({
        target: {style:{}},
        model: scene_model
      });

      var component = test_scene.findFirst('#target')
      var result = parseZpl(component.toZpl())

      expect(result[1].params[4]).to.equal('4');
    });

  });

  describe('회전된 경우', function () {

    var foo, bar;

    beforeEach(function () {
      foo = {a: 32, b: {aa: 33, bb: 94}};
      bar = {c: 44};
    });

    it('생성된 커맨드의 X값이 어떠어떠해야한다.', function () {
      expect(foo.a).to.equal(32);
    });

  });

  describe('그룹에 속한 경우', function () {

    var foo, bar;

    beforeEach(function () {
      foo = {a: 32, b: {aa: 33, bb: 94}};
      bar = {c: 44};
    });

    it('생성된 커맨드의 X값이 어떠어떠해야한다.222', function () {
      expect(foo.a).to.equal(32);
    });

  });
});
