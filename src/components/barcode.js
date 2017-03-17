var config = require('../../config').config

var qrScaleTable = {
	'1': 2,
	'2': 3,
	'3': 5,
	'4': 6,
	'5': 8,
	'6': 10
}

var TWO_D_BARCODES = [
	'qrcode',
	'pdf417',
	'micropdf417',
	'datamatrix',
	'maxicode',
	'code49'
];

function textOffsetCorrection(symbol, barWidth) {
	switch(symbol){
		case 'upce':
		case 'ean13':
			if(barWidth == 1)
				return 20
			else if(barWidth == 2)
				return 25
			else if(barWidth == 3)
				return 25
			else if(barWidth == 4)
				return 35
			else if(barWidth == 5)
				return 20
			else if(barWidth == 6)
				return 50
			else if(barWidth == 7)
				return 50
			else if(barWidth == 8)
				return 75
			else if(barWidth == 9)
				return 75
			break;
		case 'upca':
			if(barWidth == 1)
				return 10
			else if(barWidth == 2)
				return 20
			else if(barWidth == 3)
				return 25
			else if(barWidth == 4)
				return 18
			else if(barWidth == 5)
				return 28
			else if(barWidth == 6)
				return 58
			else if(barWidth == 7)
				return 90
			else if(barWidth == 8)
				return 92
			else if(barWidth == 9)
				return 95
			break;
	}
}

scene.Barcode.prototype._toZpl = function(T, I) {

	var {
		symbol,
		scale_w = 1,
		showText = true,
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
	var barWidth = scale_w;


	// 스케일이 1 아래로는 무조건 1, 나머지는 소수점 제거
	barWidth = barWidth < 1 ? 1 : Math.floor(barWidth);

	// bwip은 left좌표를 끝의 숫자 중심으로 그리는데 실제는 바코드 기준으로 그림. 바코드가 커질수록 숫자가 왼쪽으로 튀어 나오는 현상때문에 x좌표를 숫자만큼 밀어줘야함
	if((symbol == 'ean13' || symbol == 'upce' || symbol == 'upca') && showText){
		left += Number(textOffsetCorrection(symbol, barWidth))
	}

  commands.push(['^BY' + barWidth, barRatio]);
  commands.push(['^FO' + left, top]);

	if (showText && TWO_D_BARCODES.indexOf(symbol) == -1) {
		barHeight -= (scale_w * 6 + 8);	// barcode 높이는 문자 뺀 다음의 높이임.
	}

	var dpi = config.dpi;	// FIXME

	showText = showText ? 'Y' : 'N'

  switch(symbol) {
  case 'code11'          :
    commands.push(['^B1' + orientation, , barHeight, showText, textAbove]);
    break;
  case 'interleaved2of5' :
    commands.push(['^B2' + orientation, barHeight, showText, textAbove, 'N' ]);
    break;
  case 'code39'          :
		// 2번째 값을 'Y'로 주면 출력 시 맨 뒤에 다른 문자 한개가 추가로 붙음. (bwip에서는 무조건 'Y'로 그림)
    commands.push(['^B3' + orientation, 'N', barHeight, showText, textAbove]);
    break;
  case 'code49'          :	// 높이를 맞출 수 없음 (보류)
    commands.push(['^B4' + orientation, barHeight, showText,]);
    break;
  case 'planet'          :
		// 뒤에 이상한 한글자가 안없어짐, 속성에는 조절을 할 수 있는 속성이 메뉴얼에도 없음.
    commands.push(['^B5' + orientation, barHeight, showText, textAbove]);
    break;
  case 'pdf417'          :
		// 세로 크기가 안맞음
    commands.push(['^B7' + orientation, barHeight, , , , ]);
    break;
  case 'ean8'            :
		// 항상 무조건 7글자 여야함
		// 스케일은 7일때 script는 6으로 찍혀야 크기가 비슷함
    commands.push(['^B8' + orientation, barHeight, showText, textAbove]);
    break;
  case 'upce'            :
		// 보류...  텍스트가 너무 안맞음
    commands.push(['^B9' + orientation, barHeight, showText, textAbove, ]);
    break;
  case 'code93'          :
	// 크기가 안맞음
    commands.push(['^BA' + orientation, barHeight, showText, textAbove, ]);
    break;
  case 'codablock'       :
		// 바코드 출력해도 아무것도 안나옴
		// 비윕에서 그려주는 걸 찍으면 code128로 인식함
    commands.push(['^BB' + orientation, barHeight, , , , ]);
    break;
  case 'code128'         :
    commands.push(['^BC' + orientation, barHeight, showText, textAbove, , ]);
    break;
  case 'maxicode'        :
	// 바코드 출력해도 아무것도 안나옴
    commands.push(['^BD' + orientation, , barHeight, showText, textAbove]);
    break;
  case 'ean13'           :
		// bwip에서는 텍스트가 12자리 미만이면 그려지지 않음. 8개만 입력했을때 bwip은 X 표시가 뜨지만 스크립트 출력은 잘됨
    commands.push(['^BE' + orientation, barHeight, showText, textAbove]);
    break;
  case 'micropdf417'     :
		// 높이 대략적인 계산, 3번째 값은 type속성으로, 2가 제일 비슷함.
    commands.push(['^BF' + orientation, barHeight, '2']);
    break;
  case 'industrial2of5'  :	// bwip에서 지원하지 않는 바코드.
    commands.push(['^BI' + orientation, barHeight, showText, textAbove]);
    break;
  case 'standard2of5'    :	// bwip에서 지원하지 않는 바코드.
    commands.push(['^BJ' + orientation, barHeight, showText, textAbove]);
    break;
  case 'ansicodabar'     :	// bwip에서 지원하지 않는 바코드.
    commands.push(['^BK' + orientation, , barHeight, showText, textAbove, , ]);
    break;
  case 'logmars'         :	// bwip에서 지원하지 않는 바코드.
    commands.push(['^BL' + orientation, barHeight, textAbove]);
    break;
  case 'msi'             :	// planet과 마찬가지로 뒤에 한글자가 안없어짐
    commands.push(['^BM' + orientation, , barHeight, showText, textAbove, 'N', 'N' ]);
    break;
  case 'plessey'         :	// bwip이 CheckDigit가 되어 있는 상태로만 그려짐
    commands.push(['^BP' + orientation, 'Y', barHeight, showText, textAbove]);
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
		// QR의 Scale이 6보다 크면 그 이상 크기가 없기 때문에 무조건 6으로 고정
		barWidth = qrScaleTable[Math.round(scale_w)] ? qrScaleTable[scale_w] : qrScaleTable['6']
    commands.push(['^BQ' + orientation, 2, barWidth]);
    break;
  case 'upca'            :
		// 사이즈 양옆으로 커짐
    commands.push(['^BU' + orientation, barHeight, showText, textAbove, ]);
    break;
  case 'datamatrix'      :
    commands.push(['^BX' + '']); // TODO
    break;
  case 'postal'          :	// bwip에서 지원하지 않는 바코드.
    commands.push(['^BZ' + orientation, barHeight, showText, textAbove]);
    break;
  }

	if (symbol === 'qrcode') {
		commands.push(['^FDQ', 'A' + text]);
    commands.push(['^FS']);
	} else if (symbol === 'code39') {
		// ^FS가 텍스트와 같은 줄에 있지 않으면 텍스트가 나오지 않는 바코드가 있음(ex : code39)
		commands.push(['^FD' + text + '^FS']);
	} else if (symbol =='upca' && text.length == 7){
		/*  upca는 기본 11개의 글자를 씀. 7글자를 써도 그려지긴 하는데 나머지 bwip과 zpl이 나머지 4자리를 채워주는 0의 위치가 다름
		 *  그래서 bwip에서 그려지는 데로 보이기 위해 7글자 일시 6번째 글자에 0을 4개 채우고 11자리로 만들어줌.
		 *  ex - 1234567 = 12345600007 로 바꿔줌. (어차피 7글자는 쓰지 않으므로 그냥 bwip에서 나오는 데로 출력 되게 코딩 해 놓은것)
	   */
		commands.push(['^FD' + text.slice(0, 6) + '0000' + text.slice(6)]);
    commands.push(['^FS']);
	}
	else {
    commands.push(['^FD' + text]);
    commands.push(['^FS']);
  }

  var zpl = commands.map(command => {
    return command.join(',')
  }).join('\n') + '\n';

	return zpl;
}

exports.Barcode = scene.Barcode;
