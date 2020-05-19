const Cube = require('../cube');
const url = require('url');

// cube visualization
const refreshCubeImages = async (cube) => {
  const facesObj = cube.toFacesObj();
  document.querySelector('img.cube-image.front-view').src = await getCubeImageFrontURL(facesObj);
  document.querySelector('img.cube-image.back-view').src = await getCubeImageBackURL(facesObj);
};

let VISUALIZER_SERVER_URL = '';
let VISUALIZER_LARGE_IMAGE = true;

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

module.exports = {
  refreshCube: refreshCubeImages,

  // getters and setters
  getVisualizerServerURL: () => VISUALIZER_SERVER_URL,
  getIsLargeImage: () => VISUALIZER_LARGE_IMAGE,

  setVisualizerServerURL: (url) => {
    VISUALIZER_SERVER_URL = url;
  },
  setIsLargeImage: (isLargeImage) => {
    VISUALIZER_LARGE_IMAGE = isLargeImage;
  },
};
