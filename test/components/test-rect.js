/*
 * Copyright © Shenzhen Weixun All rights reserved.
 */
import { expect } from "chai";
import { parseZpl } from "../util";

require("../../src/components/rect");

describe("Rect", function () {
  describe("그룹에 속하지 않은 경우.", function () {
    var model, scene_model;

    beforeEach(function () {
      model = {
        id: "target",
        type: "rect",
        left: 150,
        top: 50,
        width: 100,
        height: 200,
        lineWidth: 10,
        fillStyle: "black",
        strokeStyle: "",
        rotation: "",
        text: "",
      };

      scene_model = {
        unit: "mm",
        width: 800,
        height: 400,
        components: [model],
      };
    });

    it("GB 커맨드를 생성해야 한다.", function () {
      var test_scene = scene.create({
        model: scene_model,
      });

      var component = test_scene.findFirst("#target");
      var result = parseZpl(component._toZpl());
      var bounds = component.labelingBounds;

      expect(result[0].command).to.equal("FO");
      expect(result[0].params[0]).to.equal(String(bounds.left));
      expect(result[0].params[1]).to.equal(String(bounds.top));
      expect(result[1].command).to.equal("GB");
      expect(result[2].command).to.equal("FS");
    });

    it("round 값 100은 GB커맨드의 5번째 파라미터가 8로 변환되어야 한다.", function () {
      // FIXME

      model.round = 100; // 최대치 100%

      var test_scene = scene.create({
        model: scene_model,
      });

      var component = test_scene.findFirst("#target");
      var result = parseZpl(component._toZpl());

      expect(result[1].params[4]).to.equal("8");
    });

    it("round 값 50은 GB커맨드의 5번째 파라미터가 4로 변환되어야 한다.", function () {
      // FIXME

      model.round = 50; // 최대치 100%

      var test_scene = scene.create({
        model: scene_model,
      });

      var component = test_scene.findFirst("#target");
      var result = parseZpl(component._toZpl());

      expect(result[1].params[4]).to.equal("4");
    });

    it("border-thickness는 fillStyle이 검은색이 아닐 때만, 3번째 파라미터로 변환되어야 한다.", function () {
      model.fillStyle = "white";
      var test_scene = scene.create({
        model: scene_model,
      });

      var component = test_scene.findFirst("#target");
      var result = parseZpl(component._toZpl());

      expect(result[1].params[2]).to.equal(String(component.lineWidth));
    });

    it("fillStyle이 없을 때, strokeStyle이 흰색이면 W, 아니면 B 로 변환되어야 한다.", function () {
      model.fillStyle = "";
      model.strokeStyle = "#fff";
      var test_scene = scene.create({
        model: scene_model,
      });

      var component = test_scene.findFirst("#target");
      var result = parseZpl(component._toZpl());

      expect(result[1].params[3]).to.equal("W");
    });
  });

  describe("회전된 경우", function () {
    var model, scene_model;

    beforeEach(function () {
      model = {
        id: "target",
        type: "rect",
        left: 150,
        top: 50,
        width: 100,
        height: 200,
        lineWidth: 10,
        fillStyle: "B",
        strokeStyle: "",
        rotation: "",
        text: "",
      };

      scene_model = {
        unit: "mm",
        width: 800,
        height: 400,
        components: [model],
      };
    });

    it("회전이 90이나 270도일 경우 width와 height의 값이 서로 바뀌어야 한다.", function () {
      model.rotation = Math.PI * 0.5; // 90도
      var test_scene = scene.create({
        model: scene_model,
      });

      var component = test_scene.findFirst("#target");
      var result = parseZpl(component._toZpl());
      var bounds = component.labelingBounds;

      expect(result[1].params[0]).to.equal(String(bounds.width));
      expect(result[1].params[1]).to.equal(String(bounds.height));
    });

    it("border-thickness는 fillStyle이 검은색일 때, 90과 270도 일때는 width와 height중 작은 값의 절반이 되어야 한다.", function () {
      model.fillStyle = "black";
      model.rotation = Math.PI * 0.5; // 90도
      model.fill = true;

      var test_scene = scene.create({
        model: scene_model,
      });

      var component = test_scene.findFirst("#target");
      var result = parseZpl(component._toZpl());
      var bounds = component.labelingBounds;

      expect(result[1].params[2]).to.equal(
        String(Math.min(bounds.width, bounds.height) / 2)
      );
    });

    it("border-thickness는 fillStyle이 검은색일 때, 0과 180도 일때는 width와 height중 작은 값의 절반이 되어야 한다.", function () {
      model.fillStyle = "black";
      model.rotation = Math.PI * 1; // 180도
      model.fill = true;

      var test_scene = scene.create({
        model: scene_model,
      });

      var component = test_scene.findFirst("#target");
      var result = parseZpl(component._toZpl());
      var bounds = component.labelingBounds;

      expect(result[1].params[2]).to.equal(
        String(Math.min(bounds.width, bounds.height) / 2)
      );
    });
  });

  // describe('그룹에 속한 경우', function () {
  //
  //   var foo, bar;
  //
  //   beforeEach(function () {
  //     foo = {a: 32, b: {aa: 33, bb: 94}};
  //     bar = {c: 44};
  //   });
  //
  //   it('생성된 커맨드의 X값이 어떠어떠해야한다.222', function () {
  //     expect(foo.a).to.equal(32);
  //   });
  //
  // });
});
