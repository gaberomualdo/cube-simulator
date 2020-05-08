require('regenerator-runtime/runtime');

const Cube = require('./cube');
const solveCube = require('./solve');
const url = require('url');

// cube
const cube = new Cube();

// move buttons
document.querySelectorAll('.col:first-child .moves .row .move').forEach((move) => {
  const isFocused = (element) => {
    return element === document.activeElement;
  };

  const moveButton = move.querySelector('button');
  const moveKey = move.querySelector('p strong').innerText;

  const moveKeyKeyCode = moveKey.toUpperCase().charCodeAt(0);

  const moveNotation = moveButton.innerText;

  // if focused, blur after a certain amount of time
  moveButton.addEventListener('focus', function () {
    setTimeout(() => {
      if (isFocused(this)) {
        this.blur();
      }
    }, 150);
  });

  // move on click and when key shorthand is pressed

  moveButton.addEventListener('click', () => {
    makeMoveAndRefreshImage(moveNotation);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== undefined) {
      if (e.key.toLowerCase() !== moveKey.toLowerCase()) {
        // not correct key
        return;
      }
    } else if (e.keyCode !== undefined) {
      if (e.keyCode !== moveKeyKeyCode) {
        // not correct key
        return;
      }
    } else {
      // browser supports neither key or keycode
      return;
    }

    // passed checks so make move
    makeMoveAndRefreshImage(moveNotation);
  });
});

window.addEventListener('load', async () => {
  makeMoveAndRefreshImage('U');
  makeMoveAndRefreshImage('B');
  makeMoveAndRefreshImage('R');
  makeMoveAndRefreshImage('L');
  makeMoveAndRefreshImage('U');
  makeMoveAndRefreshImage('F');
  makeMoveAndRefreshImage('B');
  await refreshCubeImages();
});

document.addEventListener('keydown', (e) => {
  if (e.key == 'b') {
    solveCube(cube, makeMoveAndRefreshImage);
  }
});

// make move and refresh
const makeMoveAndRefreshImage = async (moveNotation) => {
  console.log(moveNotation);
  cube.makeMove(moveNotation);
  await refreshCubeImages();
};

// cube visualization
const refreshCubeImages = async () => {
  const facesObj = cube.toFacesObj();
  document.querySelector('img.cube-image.front-view').src = await getCubeImageFrontURL(facesObj);
  document.querySelector('img.cube-image.back-view').src = await getCubeImageBackURL(facesObj);
};

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
