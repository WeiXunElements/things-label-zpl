/*
 * Copyright © Shenzhen Weixun All rights reserved.
 */
import { hasVariables } from "../../utils/has-variables";

var original_drawText = scene.Component.prototype.drawText;

export function drawTextBefore() {
  scene.Component.prototype.drawText = function (context) {
    if (hasVariables(this.get("text"))) return;
    return original_drawText.call(this, context);
  };
}

export function drawTextAfter() {
  scene.Component.prototype.drawText = original_drawText;
}
