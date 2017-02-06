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
      // reject({
      //   errorId: 'image-not-found',
      //   errorDesc: '이미지를 찾을 수 없습니다.'
      // });
      reject('Image not found. Check image URL.')
    });
  });
}

exports.Image = scene.ImageView;
