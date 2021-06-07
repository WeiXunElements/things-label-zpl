/*
 * Copyright © Shenzhen Weixun All rights reserved.
 */
global.Canvas = require("canvas");
global.Image = Canvas.Image;
global.screen = {
  width: 1280,
  height: 800,
};

require("things-scene-core/things-scene-min");
global.bwip = require("bwip/bwip-min");
require("things-scene-barcode/things-scene-barcode-min");

scene.Barcode = scene.Component.register("barcode");

export function parseZpl(zpl) {
  var lines = zpl.split("\n").filter((line) => {
    return line.length > 0 && (line[0] == "^" || line[0] == "~");
  });

  return lines.map((line) => {
    if (line[0] !== "^" && line[0] !== "~")
      throw new Error("빵글이나 물결이 없다.");

    var params;
    var command = line.substr(1, 2);

    if (command[0] == "A" && command != "A@") {
      command = "A";
      params = line.substr(2).split(",");
    } else {
      params = line.substr(3).split(",");
    }

    return {
      command,
      params,
    };
  });
}
