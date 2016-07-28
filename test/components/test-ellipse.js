import { expect } from 'chai'
import { parseZpl } from '../util'

require('things-scene/things-scene-min')
var { Ellipse } = require('../../src/components/ellipse')

describe('Ellipse', function () {

  describe('그룹에 속하지 않은 경우.', function () {

    var model;

    beforeEach(function () {
      model = {
        cx : 100,
        cy : 150,
        rx : 50,
        ry : 50,
        lineWidth : 10,
        fillStyle : '',
        strokeStyle : '',
        rotation : '',
        text : ''
      };
    });

    it('GC 커맨드를 생성해야 한다.', function () {

      var component = new Ellipse(model, null)
      var result = parseZpl(component.toZpl())
      var bounds = component.bounds

      expect(result[0].command).to.equal('FO');
      expect(result[0].params[0]).to.equal(String(bounds.left));
      expect(result[0].params[1]).to.equal(String(bounds.top));
      expect(result[1].command).to.equal('GC');
      expect(result[2].command).to.equal('FS');
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
