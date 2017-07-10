/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
var original_draw = scene.Barcode.prototype.draw;

export function drawBarcodeBefore() {
  // 바코드는 GRF 이미지를 그릴 때 무조건 스킵한다.
  scene.Barcode.prototype.draw = function(context) {
    return;
  }
}

export function drawBarcodeAfter() {
  scene.Barcode.prototype.draw = original_draw;
}
