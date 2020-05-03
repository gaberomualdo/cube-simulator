require('regenerator-runtime/runtime');

const Cube = require('./cube');
const url = require('url');

// cube
const cube = new Cube();

// move buttons
document.querySelectorAll('.col:first-child .moves .row .move button').forEach((moveButton) => {
  const isFocused = (element) => {
    return element === document.activeElement;
  };

  // if focused, blur after a certain amount of time
  moveButton.addEventListener('focus', function () {
    setTimeout(() => {
      if (isFocused(this)) {
        this.blur();
      }
    }, 150);
  });

  moveButton.addEventListener('click', function () {
    alert(`${this.innerText} button was clicked`);
  });
});

const update = async () => {
  const facesObj = cube.toFacesObj();
  document.querySelector('img.cube-image.front-view').src = await getCubeImageFrontURL(facesObj);
  document.querySelector('img.cube-image.back-view').src = await getCubeImageBackURL(facesObj);
};

window.addEventListener('load', async function () {
  await update();
  setTimeout(async () => {
    console.log('test');

    //
    // cube.cube[1][2][0].y = 'g';
    // cube.cube[2][2][0].y = 'w';

    // cube.cube[0][2][1].y = 'o';
    // cube.cube[1][2][1].y = 'b';
    // cube.cube[2][2][1].y = 'y';

    // cube.cube[0][2][2].y = 'w';
    // cube.cube[1][2][2].y = 'r';
    // cube.cube[2][2][2].y = 'g';

    await update();
  }, 1000);
});

// cube visualization
const VISUALIZER_SERVER_URL = 'http://localhost:6556/api/';
const VISUALIZER_LARGE_IMAGE = true;

const getCubeImageFrontURL = async (cubeFaces) => {
  const faces = getFacesObjWithColorNames({
    left_face: cubeFaces['g'],
    right_face: cubeFaces['r'],
    top_face: cubeFaces['w'],
  });

  return (await sendVisualizerHTTPRequest(faces)).image_url;
};

const getCubeImageBackURL = async (cubeFaces) => {
  const faces = getFacesObjWithColorNames({
    left_face: cubeFaces['o'],
    right_face: cubeFaces['b'],
    top_face: cubeFaces['y'],
  });

  return (await sendVisualizerHTTPRequest(faces)).image_url;
};

const getFacesObjWithColorNames = (facesObj) => {
  // replace shorthand colors with real names (ex: 'w' --> 'white')
  Object.keys(facesObj).forEach((key) => {
    const face = facesObj[key];
    facesObj[key] = getFaceWithColorNames(face);
  });

  return facesObj;
};

const getFaceWithColorNames = (face) => {
  face.forEach((row, rowIdx) => {
    row.forEach((colorShorthand, colorShorthandIdx) => {
      face[rowIdx][colorShorthandIdx] = Cube.colors[colorShorthand];
    });
  });

  return face;
};

const sendVisualizerHTTPRequest = async (facesObj) => {
  const reqBody = facesObj;
  reqBody['large_image'] = VISUALIZER_LARGE_IMAGE;

  const response = await fetch(VISUALIZER_SERVER_URL, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
    body: JSON.stringify(reqBody),
  });

  if (response.status === 200) {
    const responseJSON = await response.json();

    if (!responseJSON['output_path']) {
      if (responseJSON['error']) {
        throw new Error(`HTTP Request to "${VISUALIZER_SERVER_URL}" threw the error: "${responseJSON['error']}"`);
      } else {
        throw new Error(`JSON response from "${VISUALIZER_SERVER_URL}" did not contain the required property "output_path"`);
      }
    }

    const relativeImgPath = responseJSON['output_path'];
    const absoluteImgPath = url.resolve(VISUALIZER_SERVER_URL, relativeImgPath);

    return { image_url: absoluteImgPath };
  } else {
    throw new Error(`Response from "${VISUALIZER_SERVER_URL}" failed with status code ${response.status}`);
  }
};
