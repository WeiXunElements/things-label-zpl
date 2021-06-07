/*
 * Copyright © Shenzhen Weixun All rights reserved.
 */
import { getGrfCommand } from "../utils/to-grf";

scene.ImageView.prototype.toZpl = function (T, I) {
  /* 이미지 타입이면, ZPL을 생성하지 않고 리턴한다. */
  if (I) return;

  var { src } = this.model;

  return new Promise((resolve, reject) => {
    if (!src) resolve("");

    getGrfCommand(
      this.labelingBounds,
      typeof src === "string" ? this.app.url(src) : src
    ).then(
      (command) => {
        resolve(command);
      },
      (error) => {
        reject("Image not found. Check image URL.");
      }
    );
  });
};

exports.Image = scene.ImageView;
