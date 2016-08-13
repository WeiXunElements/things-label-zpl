var config = require('../../config').config

scene.Barcode.prototype._toZpl = function(T) {
	var {
		symbol,
		scale_w = 1,
		showText = 'Y',
		textAbove = ''
	} = this.model;

  var {
    left,
    top,
    width,
    height
  } = this.labelingBounds;

  var text = T ? this.get('text') : this.text;
	var orientation = this.orientation;

	var commands = [];

  // ^BY 커맨드 : 바코드의 디폴트 설정.
  // barRatio : wide bar to narrow bar width ratio (no effect on fixed ratio bar codes)
  // 유효값 : 2.0 ~ 3.0
  // 디폴트 값을 3으로 둠.
  // 고정비율 바코드에는 적용되지 않음.
  var barRatio = 2;
  // barHeight : height of bars (in dots)
  // 유효값 : 1 to 32000 Initial Value at Power-up: 10
  // BC 커맨드의 높이 정보가 없을 때 디폴트로 적용됨.
  var barHeight = (orientation == 'R' || orientation == 'B') ? width : height;

	commands.push(['^BY' + scale_w, barRatio, barHeight]);
  commands.push(['^FO' + left, top]);

	if (showText && symbol != 'qrcode') {
		barHeight -= (scale_w * 6 + 8);	// barcode 높이는 문자 뺀 다음의 높이임.
	}

	var dpi = config.dpi;	// FIXME

  switch(symbol) {
  case 'code11'          :
    commands.push(['^B1' + orientation, , barHeight, showText, textAbove]);
    break;
  case 'interleaved2of5' :
    commands.push(['^B2' + orientation, barHeight, showText, textAbove, ]);
    break;
  case 'code39'          :
    commands.push(['^B3' + orientation, , barHeight, showText, textAbove]);
    break;
  case 'code49'          :
    commands.push(['^B4' + orientation, barHeight, showText,]);
    break;
  case 'planet'          :
    commands.push(['^B5' + orientation, barHeight, showText, textAbove]);
    break;
  case 'pdf417'          :
    commands.push(['^B7' + orientation, barHeight, , , , ]);
    break;
  case 'ean8'            :
    commands.push(['^B8' + orientation, barHeight, showText, textAbove]);
    break;
  case 'upce'            :
    commands.push(['^B9' + orientation, barHeight, showText, textAbove, ]);
    break;
  case 'code93'          :
    commands.push(['^BA' + orientation, barHeight, showText, textAbove, ]);
    break;
  case 'codablock'       :
    commands.push(['^BB' + orientation, barHeight, , , , ]);
    break;
  case 'code128'         :
    commands.push(['^BC' + orientation, barHeight, showText, textAbove, , ]);
    break;
  case 'maxicode'        :
    commands.push(['^BD' + orientation, , barHeight, showText, textAbove]);
    break;
  case 'ean13'           :
    commands.push(['^BE' + orientation, barHeight, showText, textAbove]);
    break;
  case 'micropdf417'     :
    commands.push(['^BF' + '2', , ]);
    break;
  case 'industrial2of5'  :
    commands.push(['^BI' + orientation, barHeight, showText, textAbove]);
    break;
  case 'standard2of5'    :
    commands.push(['^BJ' + orientation, barHeight, showText, textAbove]);
    break;
  case 'ansicodabar'     :
    commands.push(['^BK' + orientation, , barHeight, showText, textAbove, , ]);
    break;
  case 'logmars'         :
    commands.push(['^BL' + orientation, barHeight, textAbove]);
    break;
  case 'msi'             :
    commands.push(['^BM' + orientation, , barHeight, showText, textAbove, ]);
    break;
  case 'plessey'         :
    commands.push(['^BP' + orientation, , barHeight, showText, textAbove]);
    break;
  case 'qrcode'          :
    /*
     * ^BQa,b,c
     * @a field position - Accepted Values: Rotation is not supported.
     *                     ^FW has no effect on rotation.
     *                     Fixed Value: Normal
     * @b model - Accepted Values: 1 (original) and 2 (enhanced – recommended)
     *            Default Value: 2
     * @c magnification factor - Accepted Values: 1 through 10
     *                           Default Value:
     *                              1 on 150 dpi printers
     *                              2 on 200 dpi printers
     *                              3 on 300 dpi printers
     *                              6 on 600 dpi printers
     */
    commands.push(['^BQ' + orientation, 1, 2]);
    break;
  case 'upca'            :
    commands.push(['^BU' + orientation, barHeight, showText, textAbove, ]);
    break;
  case 'datamatrix'      :
    commands.push(['^BX' + '']); // TODO
    break;
  case 'postal'          :
    commands.push(['^BZ' + orientation, barHeight, showText, textAbove]);
    break;
  }

	if (symbol === 'qrcode') {
		commands.push(['^FDQ', 'A' + text]);
	} else {
		commands.push(['^FD' + text]);
	}

	commands.push(['^FS'])

  var zpl = commands.map(command => {
    return command.join(',')
  }).join('\n') + '\n';

	return zpl;
}

exports.Barcode = scene.Barcode;
