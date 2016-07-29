import { expect } from 'chai'
import { parseZpl } from '../util'

var { Ellipse } = require('../../src/components/ellipse')

describe('Ellipse', function () {

  describe('그룹에 속하지 않은 경우.', function () {

    var model, scene_model;

    beforeEach(function () {
      model = {
        id: 'target',
        type: 'ellipse',
        cx : 50,
        cy : 100,
        rx : 150,
        ry : 200,
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

    it('rx와 ry가 같으면 GC 커맨드를 생성해야 한다.', function () {
      model.rx = 100;
      model.ry = 100;
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
      expect(result[1].command).to.equal('GC');
      expect(result[2].command).to.equal('FS');
    });

    it('rx와 ry가 다르면 GE 커맨드를 생성해야 한다.', function () {

      var test_scene = scene.create({
        target: {style:{}},
        model: scene_model
      });

      var component = test_scene.findFirst('#target')
      var result = parseZpl(component.toZpl())

      expect(result[1].command).to.equal('GE');
      expect(result[1].params[0]).to.equal(String(model.rx * 2));
      expect(result[1].params[1]).to.equal(String(model.ry * 2));
    });

    it('fillStyle이 검은색이 아닌 경우 lineWidth는 모델의 lineWidth값을 반환한다.', function () {
      model.fillStyle = '#ffffff';
      var test_scene = scene.create({
        target: {style:{}},
        model: scene_model
      });

      var component = test_scene.findFirst('#target')
      var result = parseZpl(component.toZpl())
      expect(result[1].params[2]).to.equal(String(model.lineWidth));
    });

    it('fillStyle이 검은색일 경우에는 lineWidth의 값은 rx와 ry중 큰 값으로 변환한다.', function () {
      model.fillStyle = '#000000';
      var test_scene = scene.create({
        target: {style:{}},
        model: scene_model
      });

      var component = test_scene.findFirst('#target')
      var result = parseZpl(component.toZpl())
      expect(result[1].params[2]).to.equal(String(Math.max(model.rx, model.ry)));
    });

    it('strokeStyle은 fillStyle이 없는 때, 흰색이면 W, 아니면 B 로 변환되어야 한다.', function () {
      model.fillStyle = '#000000';
      var test_scene = scene.create({
        target: {style:{}},
        model: scene_model
      });

      var component = test_scene.findFirst('#target')
      var result = parseZpl(component.toZpl())

      // TODO

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
