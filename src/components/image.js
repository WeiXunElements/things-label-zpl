import { getGrfCommand } from '../utils/to-grf'

scene.ImageView.prototype.toZpl = function(T) {
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
