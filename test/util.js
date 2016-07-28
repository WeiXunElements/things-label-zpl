global.Canvas = require('canvas')
global.Image = Canvas.Image
global.screen = {
  width: 1280,
  height: 800
}

require('things-scene/things-scene-min')

export function parseZpl(zpl) {
  var lines = zpl.split('\n').filter(line => {
    return line.length > 0;
  });

  return lines.map(line => {
    if(line[0] !== '^')
      throw new Error('빵글이가 없다.')
    var command = line.substr(1, 2)
    var params = line.substr(3).split(',')
    return {
      command,
      params
    }
  });
}
