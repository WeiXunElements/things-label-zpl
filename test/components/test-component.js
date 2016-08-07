import { expect } from 'chai'
import { parseZpl } from '../util'

require('../../src/components/component');

describe('Component', function () {

  describe('orientation', function () {

    var component_model, group_model, scene_model;
    var test_scene;

    beforeEach(function () {
      component_model = {
        id: 'target',
        type: 'rect',
        left : 150,
        top : 50,
        width : 100,
        height : 200,
        lineWidth : 10,
        fillStyle : 'B',
        strokeStyle : '',
        rotation : '',
        text : ''
      };

      group_model = {
        type: 'group',
        left: 100,
        top: 150,
        width: 250,
        height: 350,
        components: [component_model]
      };

      scene_model = {
        unit: 'mm',
        width: 800,
        height: 400,
        components: [group_model]
      }
    });

    afterEach(function() {
    });

    it('rotation이 없는 경우의 orientation은 "N" 이어야 한다.', function() {
      test_scene = scene.create({
        target: {style:{}},
        model: scene_model
      });

      var component = test_scene.findFirst('#target')

      expect(component.orientation).to.equal('N');
    });

    it('rotation값이 360도인 경우의 orientation은 "N" 이어야 한다.', function() {
      component_model.rotation = Math.PI * 2;

      test_scene = scene.create({
        target: {style:{}},
        model: scene_model
      });

      var component = test_scene.findFirst('#target')

      expect(component.orientation).to.equal('N');
    });

    it('rotation값이 90도주변인 경우의 orientation은 "R" 이어야 한다.', function() {
      component_model.rotation = Math.PI / 2 + 0.05;

      test_scene = scene.create({
        target: {style:{}},
        model: scene_model
      });

      var component = test_scene.findFirst('#target')

      expect(component.orientation).to.equal('R');
    });

    it('상위 컨테이너의 회전각이 모두 적용된 최종 rotation에 대한 orientation이 반환되어야 한다 (I).', function() {
      group_model.rotation = Math.PI / 2 + 0.05;
      component_model.rotation = Math.PI / 2 + 0.05;

      test_scene = scene.create({
        target: {style:{}},
        model: scene_model
      });

      var component = test_scene.findFirst('#target')

      expect(component.orientation).to.equal('I');
    });

    it('상위 컨테이너의 회전각이 모두 적용된 최종 rotation에 대한 orientation이 반환되어야 한다 (II).', function() {
      scene_model.rotation = Math.PI / 2 + 0.05;
      group_model.rotation = Math.PI / 2 + 0.05;
      component_model.rotation = Math.PI / 2 + 0.05;

      test_scene = scene.create({
        target: {style:{}},
        model: scene_model
      });

      var component = test_scene.findFirst('#target')

      expect(component.orientation).to.equal('B');
    });
  });
});
