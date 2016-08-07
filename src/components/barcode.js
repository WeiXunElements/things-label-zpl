var config = require('../../config').config

scene.Barcode.prototype.toZpl = function() {
	var {
		symbol = '',
		scale_w = 1,
		showText = 'Y',
		textAbove = '',
		text = ''
	} = this.model;

  var {
    left,
    top,
    width,
    height
  } = this.labelingBounds;

	var orientation = this.orientation;

	var commands = [];

	commands.push(['^BY' + scale_w, 3])
  commands.push('^FO' + left + ',' + top)

	if (showText && symbol != 'qrcode') {
		height -= (scale_w * 6 + 8);	// barcode 높이는 문자 뺀 다음의 높이임.
	}

	var dpi = config.dpi;	// FIXME

  switch(symbol) {
  case 'code11'          :
    commands.push(['^B1' + orientation, , height, showText, textAbove]);
    break;
  case 'interleaved2of5' :
    commands.push(['^B2' + orientation, height, showText, textAbove, ]);
    break;
  case 'code39'          :
    commands.push(['^B3' + orientation, , height, showText, textAbove]);
    break;
  case 'code49'          :
    commands.push(['^B4' + orientation, height, showText,]);
    break;
  case 'planet'          :
    commands.push(['^B5' + orientation, height, showText, textAbove]);
    break;
  case 'pdf417'          :
    commands.push(['^B7' + orientation, height, , , , ]);
    break;
  case 'ean8'            :
    commands.push(['^B8' + orientation, height, showText, textAbove]);
    break;
  case 'upce'            :
    commands.push(['^B9' + orientation, height, showText, textAbove, ]);
    break;
  case 'code93'          :
    commands.push(['^BA' + orientation, height, showText, textAbove, ]);
    break;
  case 'codablock'       :
    commands.push(['^BB' + orientation, height, , , , ]);
    break;
  case 'code128'         :
    commands.push(['^BC' + orientation, height, showText, textAbove, , ]);
    break;
  case 'maxicode'        :
    commands.push(['^BD' + orientation, , height, showText, textAbove]);
    break;
  case 'ean13'           :
    commands.push(['^BE' + orientation, height, showText, textAbove]);
    break;
  case 'micropdf417'     :
    commands.push(['^BF' + '2', , ]);
    break;
  case 'industrial2of5'  :
    commands.push(['^BI' + orientation, height, showText, textAbove]);
    break;
  case 'standard2of5'    :
    commands.push(['^BJ' + orientation, height, showText, textAbove]);
    break;
  case 'ansicodabar'     :
    commands.push(['^BK' + orientation, , height, showText, textAbove, , ]);
    break;
  case 'logmars'         :
    commands.push(['^BL' + orientation, height, textAbove]);
    break;
  case 'msi'             :
    commands.push(['^BM' + orientation, , height, showText, textAbove, ]);
    break;
  case 'plessey'         :
    commands.push(['^BP' + orientation, , height, showText, textAbove]);
    break;
  case 'qrcode'          :
    commands.push(['^BQ' + orientation, 2, Math.round(height / 19.54)]);
    break;
  case 'upca'            :
    commands.push(['^BU' + orientation, height, showText, textAbove, ]);
    break;
  case 'datamatrix'      :
    commands.push(['^BX' + '']); // TODO
    break;
  case 'postal'          :
    commands.push(['^BZ' + orientation, height, showText, textAbove]);
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
  }).join('\n') + '\n\n';

	return zpl;
}

exports.Barcode = scene.Barcode;
