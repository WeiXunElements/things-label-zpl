import { getGrfCommand } from '../utils/to-grf'

scene.ImageView.prototype.toZpl = function(T, I) {

  /* 이미지 타입이면, ZPL을 생성하지 않고 리턴한다. */
  if(I)
    return;

  var {
    src
  } = this.model;

  return new Promise((resolve, reject) => {
    getGrfCommand(
      this.labelingBounds,
      typeof(src) === 'string' ? this.app.url(src) : src
    ).then(command => {

      resolve(command);
    }, error => {

      reject(error);
    });
  });
}

exports.Image = scene.ImageView;
