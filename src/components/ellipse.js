var Text = require('./text').Text
var shapeTranscoord = require('./transcoord').shapeTranscoord
var rotateCase = require('./transcoord').rotateCase

scene.Ellipse.prototype.toZpl = function() {
	var {
		rx = '',
		ry = '',
		cx = '',
		cy = '',
		lineWidth = 1,
		fillStyle,
		strokeStyle,
		rotation,
		text
	} = this.model;

	var {
		left,
		top,
		width,
		height
	} = this.bounds

	var rotate = rotateCase(rotation);

	switch(rotate) {
		case 'N':
		case 'I':
		default:
			break;
		case 'R':
		case 'B':
			let tmp = rx;
			rx = ry;
			ry = tmp;

			let startPoint = shapeTranscoord(this.bounds);
			left = startPoint.x;
			top = startPoint.y;
			break;
	}

	if (strokeStyle === 'white' || strokeStyle === '#fff'
		|| (strokeStyle === '#ffffff')) {
		strokeStyle = 'W';
	} else {
		strokeStyle = 'B'
	}

	if (fillStyle) {
		if (fillStyle === 'white' || fillStyle === '#fff'
			|| (fillStyle === '#ffffff')) {
			fillStyle = 'W';
		} else {
			fillStyle = 'B'
			lineWidth = Math.max(rx, ry);
		}
		strokeStyle = fillStyle;
	}

	// left += group ? group.left || 0 : 0
	// top += group ? group.top || 0 : 0

	var command;
	if(rx === ry)
		command = ['^GC' + rx*2, lineWidth||'', strokeStyle||'']
	else
		command = ['^GE' + rx*2, ry*2, lineWidth||'', strokeStyle||'']


	var zpl = [];
	zpl.push('^FO' + left + ',' + top);
	zpl.push(command.join(','));
	zpl.push('^FS');

	zpl = zpl.join('\n');
	zpl += '\n'

	// make text command
	if (text) {
		var texts = new Text(this.model);
		zpl += texts.toZpl(group);
	}

	return zpl;
}

exports.Ellipse = scene.Ellipse;
