/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
import { expect } from 'chai'
import { parseZpl } from '../util'

var { Rect } = require('../../src/components/barcode')
require('../../src/components/text')

describe('Barcode', function () {

  describe('그룹에 속하지 않은 경우.', function () {

    var model, scene_model;

    beforeEach(function () {
      model = {
        id: 'target',
        type: 'barcode',
        left : 150,
        top : 50,
        width : 100,
        height : 200,
        symbol: 'code39',
        lineWidth : 10,
        fillStyle : '',
        strokeStyle : '',
        rotation : '',
        text : '12345678'
      };

      scene_model = {
        unit: 'mm',
        width: 800,
        height: 400,
        components: [model]
      }
    });

    it('code11 바코드는 B1 커맨드를 생성해야 한다.', function () {
      model.symbol = 'code11';
      model.text = '1234567890';

      var test_scene = scene.create({
        model: scene_model
      });

      var component = test_scene.findFirst('#target')
      var result = parseZpl(component._toZpl())
      var bounds = component.labelingBounds

      expect(result[0].command).to.equal('BY');
      expect(result[1].command).to.equal('FO');
      expect(result[1].params[0]).to.equal(String(bounds.left));
      expect(result[1].params[1]).to.equal(String(bounds.top));
      expect(result[2].command).to.equal('B1');
      expect(result[3].command).to.equal('FD');
      expect(result[4].command).to.equal('FS');
    });

    it('interleaved2of5 바코드는 B2 커맨드를 생성해야 한다.', function () {
      model.symbol = 'interleaved2of5';
      model.text = '1234567890';

      var test_scene = scene.create({
        model: scene_model
      });

      var component = test_scene.findFirst('#target')
      var result = parseZpl(component._toZpl())
      var bounds = component.labelingBounds

      expect(result[0].command).to.equal('BY');
      expect(result[1].command).to.equal('FO');
      expect(result[1].params[0]).to.equal(String(bounds.left));
      expect(result[1].params[1]).to.equal(String(bounds.top));
      expect(result[2].command).to.equal('B2');
      expect(result[3].command).to.equal('FD');
      expect(result[4].command).to.equal('FS');
    });

    it('code39 바코드는 B3 커맨드를 생성해야 한다.', function () {
      model.symbol = 'code39';
      model.text = '1234567890';

      var test_scene = scene.create({
        model: scene_model
      });

      var component = test_scene.findFirst('#target')
      var result = parseZpl(component._toZpl())
      var bounds = component.labelingBounds

      expect(result[0].command).to.equal('BY');
      expect(result[1].command).to.equal('FO');
      expect(result[1].params[0]).to.equal(String(bounds.left));
      expect(result[1].params[1]).to.equal(String(bounds.top));
      expect(result[2].command).to.equal('B3');
      expect(result[3].command).to.equal('FD');
      // expect(result[4].command).to.equal('FS');
    });

    it('code49 바코드는 B4 커맨드를 생성해야 한다.', function () {
      model.symbol = 'code49';
      model.text = '1234567890';

      var test_scene = scene.create({
        model: scene_model
      });

      var component = test_scene.findFirst('#target')
      var result = parseZpl(component._toZpl())
      var bounds = component.labelingBounds

      expect(result[0].command).to.equal('BY');
      expect(result[1].command).to.equal('FO');
      expect(result[1].params[0]).to.equal(String(bounds.left));
      expect(result[1].params[1]).to.equal(String(bounds.top));
      expect(result[2].command).to.equal('B4');
      expect(result[3].command).to.equal('FD');
      expect(result[4].command).to.equal('FS');
    });

    it('planet 바코드는 B5 커맨드를 생성해야 한다.', function () {
      model.symbol = 'planet';
      model.text = '1234567890';

      var test_scene = scene.create({
        model: scene_model
      });

      var component = test_scene.findFirst('#target')
      var result = parseZpl(component._toZpl())
      var bounds = component.labelingBounds

      expect(result[0].command).to.equal('BY');
      expect(result[1].command).to.equal('FO');
      expect(result[1].params[0]).to.equal(String(bounds.left));
      expect(result[1].params[1]).to.equal(String(bounds.top));
      expect(result[2].command).to.equal('B5');
      expect(result[3].command).to.equal('FD');
      expect(result[4].command).to.equal('FS');
    });

    it('pdf417 바코드는 B7 커맨드를 생성해야 한다.', function () {
      model.symbol = 'pdf417';
      model.text = 'ABCDEFGHIJKLMNOP';

      var test_scene = scene.create({
        model: scene_model
      });

      var component = test_scene.findFirst('#target')
      var result = parseZpl(component._toZpl())
      var bounds = component.labelingBounds

      expect(result[0].command).to.equal('BY');
      expect(result[1].command).to.equal('FO');
      expect(result[1].params[0]).to.equal(String(bounds.left));
      expect(result[1].params[1]).to.equal(String(bounds.top));
      expect(result[2].command).to.equal('B7');
      expect(result[3].command).to.equal('FD');
      expect(result[4].command).to.equal('FS');
    });

    it('ean8 바코드는 B8 커맨드를 생성해야 한다.', function () {
      model.symbol = 'ean8';
      model.text = 'ABCDEFGHIJKLMNOP';

      var test_scene = scene.create({
        model: scene_model
      });

      var component = test_scene.findFirst('#target')
      var result = parseZpl(component._toZpl())
      var bounds = component.labelingBounds

      expect(result[0].command).to.equal('BY');
      expect(result[1].command).to.equal('FO');
      expect(result[1].params[0]).to.equal(String(bounds.left));
      expect(result[1].params[1]).to.equal(String(bounds.top));
      expect(result[2].command).to.equal('B8');
      expect(result[3].command).to.equal('FD');
      expect(result[4].command).to.equal('FS');
    });

    it('upce 바코드는 B9 커맨드를 생성해야 한다.', function () {
      model.symbol = 'upce';
      model.text = 'ABCDEFGHIJKLMNOP';

      var test_scene = scene.create({
        model: scene_model
      });

      var component = test_scene.findFirst('#target')
      var result = parseZpl(component._toZpl())
      var bounds = component.labelingBounds

      expect(result[0].command).to.equal('BY');
      expect(result[1].command).to.equal('FO');
      expect(result[1].params[0]).to.equal(String(bounds.left));
      expect(result[1].params[1]).to.equal(String(bounds.top));
      expect(result[2].command).to.equal('B9');
      expect(result[3].command).to.equal('FD');
      expect(result[4].command).to.equal('FS');
    });

    it('code93 바코드는 BA 커맨드를 생성해야 한다.', function () {
      model.symbol = 'code93';
      model.text = 'ABCDEFGHIJKLMNOP';

      var test_scene = scene.create({
        model: scene_model
      });

      var component = test_scene.findFirst('#target')
      var result = parseZpl(component._toZpl())
      var bounds = component.labelingBounds

      expect(result[0].command).to.equal('BY');
      expect(result[1].command).to.equal('FO');
      expect(result[1].params[0]).to.equal(String(bounds.left));
      expect(result[1].params[1]).to.equal(String(bounds.top));
      expect(result[2].command).to.equal('BA');
      expect(result[3].command).to.equal('FD');
      expect(result[4].command).to.equal('FS');
    });

    it('codablock 바코드는 BB 커맨드를 생성해야 한다.', function () {
      model.symbol = 'codablock';
      model.text = 'ABCDEFGHIJKLMNOP';

      var test_scene = scene.create({
        model: scene_model
      });

      var component = test_scene.findFirst('#target')
      var result = parseZpl(component._toZpl())
      var bounds = component.labelingBounds

      expect(result[0].command).to.equal('BY');
      expect(result[1].command).to.equal('FO');
      expect(result[1].params[0]).to.equal(String(bounds.left));
      expect(result[1].params[1]).to.equal(String(bounds.top));
      expect(result[2].command).to.equal('BB');
      expect(result[3].command).to.equal('FD');
      expect(result[4].command).to.equal('FS');
    });

    it('code128 바코드는 BC 커맨드를 생성해야 한다.', function () {
      model.symbol = 'code128';
      model.text = 'ABCDEFGHIJKLMNOP';

      var test_scene = scene.create({
        model: scene_model
      });

      var component = test_scene.findFirst('#target')
      var result = parseZpl(component._toZpl())
      var bounds = component.labelingBounds

      expect(result[0].command).to.equal('BY');
      expect(result[1].command).to.equal('FO');
      expect(result[1].params[0]).to.equal(String(bounds.left));
      expect(result[1].params[1]).to.equal(String(bounds.top));
      expect(result[2].command).to.equal('BC');
      expect(result[3].command).to.equal('FD');
      expect(result[4].command).to.equal('FS');
    });

    it('qrcode 바코드는 BQ 커맨드를 생성해야 한다.', function () {
      model.symbol = 'qrcode';
      model.text = 'http://hatiolab.com';

      var test_scene = scene.create({
        model: scene_model
      });

      var component = test_scene.findFirst('#target')
      var result = parseZpl(component._toZpl())
      var bounds = component.labelingBounds

      expect(result[0].command).to.equal('BY');
      expect(result[1].command).to.equal('FO');
      expect(result[1].params[0]).to.equal(String(bounds.left));
      expect(result[1].params[1]).to.equal(String(bounds.top));
      expect(result[2].command).to.equal('BQ');
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
