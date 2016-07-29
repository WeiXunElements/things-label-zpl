const HISTOGRAM_LENGH = 256;
const R = 0;
const G = 1;
const B = 2;
const A = 3;

function toGrays(width, height, data) {
  var grays = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let idx = 4 * (width * y + x);
      let luminance = data[idx + R] * 0.21 + data[idx + G] * 0.71 + data[idx + B] * 0.07;

      // Alpha 값이 낮을 수록 luminance가 높아지는 것으로 본다.
      luminance = luminance + (255 - data[idx + A]) * (255 - luminance) / 255;

      grays[idx + R] = luminance;
      grays[idx + G] = luminance;
      grays[idx + B] = luminance;
      grays[idx + A] = data[idx + A];
    }
  }

  return grays;
}

function getHistogram(width, height, data) {
  var histogram = [];

  for(let i = 0;i < HISTOGRAM_LENGH;i++)
    histogram[i] = 0;

  for(let y = 0;y < height;y++)
    for(let x = 0;x < width;x++) {
      let idx = 4 * (width * y + x);
      let red = Math.round(data[idx + R]);
      histogram[red]++;
    }

  return histogram;
}

function getThreshold(width, height, data) {
  var histogram = getHistogram(width, height, data)

  var sum = 0;
  for(let i = 0;i < HISTOGRAM_LENGH;i++)
    sum += i * histogram[i];

  var sumB = 0;
  var wB = 0;
  var wF = 0;

  var max = 0;
  var threshold = 0;
  var total = width * height;

  for(let i = 0;i < HISTOGRAM_LENGH;i++) {
    wB += histogram[i];
    if(wB == 0)
      continue;

    wF = total - wB;

    if(wF == 0)
      break;

    sumB += (i * histogram[i]);
    let mB = sumB / wB;
    let mF = (sum - sumB) / wF;

    let between = wB * wF * (mB - mF) * (mB - mF);
    if(between > max) {
      max = between;
      threshold = i;
    }
  }

  return threshold;
}

export function binarize(width, height, data) {
  var grays = toGrays(width, height, data);
  var threshold = getThreshold(width, height, grays);

  var binarized = [];

  for(let y = 0;y < height;y++) {
    for(let x = 0;x < width;x++) {
      let idx = 4 * (y * width + x);

      if(grays[idx] > threshold) {
        binarized[idx + R] = 255;
        binarized[idx + G] = 255;
        binarized[idx + B] = 255;
      } else {
        binarized[idx + R] = 0;
        binarized[idx + G] = 0;
        binarized[idx + B] = 0;
      }

      binarized[idx + A] = grays[idx + A];
    }
  }

  return binarized;
}
