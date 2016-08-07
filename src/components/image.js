import { binarize } from '../utils/rgb-binarize'

function getGuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}

function getImageData(component) {
  var {
    src
  } = component.model;

  var {
    top,
    left,
    width,
    height,
  } = component.bounds;

  var canvas;

  if(typeof(document) == 'undefined') {
    canvas = new Canvas(width, height);
  } else {
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
  }

  var image = new Image;

  var promise = new Promise(function(resolve, reject) {
    image.onload = function() {
      var context = canvas.getContext('2d');

      context.drawImage(image, 0, 0, width, height);
      var {
        data
      } = context.getImageData(0, 0, width, height);

      var grf = getImageGrf(width, height, binarize(width, height, data));

      resolve(grf)
    }

    image.onerror = function(error) {
      reject(error);
    }
  });

  image.src = src;

  return promise;
}

function binToHex(nibble) {
  return parseInt(nibble, 2).toString(16).toUpperCase() || '';
}

function getImageGrf(width, height, data) {

  var grfData = "";
  var bytesPerLine = Math.ceil(width / 8);

  for (let y = 0; y < height; y++) {
    let nibble = "";
    let bytes = 0;

    for (let x = 0; x < width; x++) {
      nibble += data[4 * (width * y + x) + 1] == 0 ? '1' : '0';

      if (nibble.length > 7) {
        grfData += binToHex(nibble.substring(0, 4)) + binToHex(nibble.substring(4, 8));
        nibble = "";
        bytes++;
      }
    }

    if (nibble.length > 0) {
      while (nibble.length < 8) nibble += '0';
      grfData += binToHex(nibble.substring(0, 4)) + binToHex(nibble.substring(4, 8));
      nibble = '';
      bytes++;
    }

    while (bytes++ < bytesPerLine)
      grfData += binToHex('0000') + binToHex('0000');

    grfData += "\n";
  }

  return bytesPerLine * height + ',' + bytesPerLine + ',' + grfData;
}

scene.ImageView.prototype.toZpl = function() {
  var {
    top,
    left
  } = this.bounds;

  // top += group ? group.top || 0 : 0
  // left += group ? group.left || 0 : 0;

  var self = this;

  return new Promise(function(resolve, reject) {
    getImageData(self).then(function(grf) {

      var guid = getGuid();
      var commands = [
        ['~DG'+guid, grf],
        ['^FO'+left, top],
        ['^XG'+'R:'+guid, 1, 1],
        ['^PQ'+1],
        ['^FS']
      ];

      var result = commands.map(command => {
        return command.join(',')
      }).join('\n') + '\n\n';

      console.log(result);

      resolve(result);

    }, function(error) {
      reject(error);
    });
  });
}

exports.Image = scene.ImageView;
