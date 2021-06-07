/*
 * Copyright © Shenzhen Weixun All rights reserved.
 */
import { expect } from "chai";
import { parseZpl } from "../util";

const fs = require("fs");

require("../../src/components/image");

describe("Image", function () {
  describe("그룹에 속하지 않은 경우.", function () {
    var model, scene_model;

    beforeEach(function () {
      model = {
        id: "target",
        type: "image-view",
        left: 150,
        top: 50,
        width: 600,
        height: 200,
        lineWidth: 10,
        fillStyle: "",
        strokeStyle: "",
        rotation: "",
      };

      scene_model = {
        unit: "mm",
        width: 800,
        height: 400,
        components: [model],
      };
    });

    // ['~DG'+guid, imageGrf],
    // ['^FO'+left, top],
    // ['^XG'+'R:'+guid, 1, 1],
    // ['^PQ'+1],

    it("~DG 커맨드로 이미지를 등록하고, ^XG 커맨드로 이미지를 그려야 한다.", function (done) {
      fs.readFile(
        __dirname + "/" + "../images/logo.png",
        function (err, buffer) {
          if (err) {
            console.error(err);

            expect(false).to.be.true;
            done();
          }

          model.src = buffer;

          var test_scene = scene.create({
            model: scene_model,
          });

          var component = test_scene.findFirst("#target");
          component.toZpl().then(
            function (zpl) {
              var result = parseZpl(zpl);

              expect(result[0].command).to.equal("DG");
              expect(result[1].command).to.equal("FO");
              expect(result[2].command).to.equal("XG");
              expect(result[3].command).to.equal("PQ");

              // console.log(zpl);

              done();
            },
            function (error) {
              console.error(error);

              expect(false).to.be.true;
              done();
            }
          );
        }
      );
    });
  });

  describe("회전된 경우", function () {
    var foo, bar;

    beforeEach(function () {
      foo = { a: 32, b: { aa: 33, bb: 94 } };
      bar = { c: 44 };
    });

    it("생성된 커맨드의 X값이 어떠어떠해야한다.", function () {
      expect(foo.a).to.equal(32);
    });
  });

  describe("그룹에 속한 경우", function () {
    var foo, bar;

    beforeEach(function () {
      foo = { a: 32, b: { aa: 33, bb: 94 } };
      bar = { c: 44 };
    });

    it("생성된 커맨드의 X값이 어떠어떠해야한다.222", function () {
      expect(foo.a).to.equal(32);
    });
  });
});
