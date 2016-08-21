import { expect } from 'chai'
import { parseZpl } from '../util'

require('../../src/components/text');

describe('Text', function () {

  describe('그룹에 속하지 않은 경우.', function () {

    var model, scene_model;

    beforeEach(function () {
      model = {
        id: 'target',
        type: 'text',
        left : 150,
        top : 50,
        width : 200,
        height : 200,
        fontSize: 20,
        text : 'ABCDEFG BBBBBBBB CCCCCCCC'
      };

      scene_model = {
        unit: 'mm',
        width: 800,
        height: 400,
        components: [model]
      }
    });

    it('textWrap인 경우 A, FB 커맨드를 생성해야 한다.', function () {
      model.textWrap = true;

      var test_scene = scene.create({
        model: scene_model
      });

      var component = test_scene.findFirst('#target');
      var result = parseZpl(component._toZpl());
      var bounds = component.labelingBounds;

      expect(result[0].command).to.equal('FO');
      expect(result[0].params[0]).to.equal(String(bounds.left));
      expect(result[0].params[1]).to.equal(String(bounds.top));
      expect(result[1].command).to.equal('A');
      expect(result[2].command).to.equal('FB');
      expect(result[3].command).to.equal('FD');
      expect(result[4].command).to.equal('FS');
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
