/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
import { drawTextBefore, drawTextAfter } from './draw-text'
import { drawBarcodeBefore, drawBarcodeAfter } from './barcode-draw'

export function beforeDraw(T) {
  if(T) // [T]emplate화 하는 경우에만, drawText를 인터셉트한다.
    drawTextBefore();

  drawBarcodeBefore();
}

export function afterDraw(T) {
  drawBarcodeAfter();

  if(T) // [T]emplate화 하는 경우에만, drawText 인터셉트를 복구한다.
    drawTextAfter();
}
