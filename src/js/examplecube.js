const Cube = require('./cube');

module.exports = (cube) => {
  cube.cube[0][0][0].z = 'r';
  cube.cube[0][0][0].y = 'w';
  cube.cube[0][0][0].x = 'b';

  cube.cube[1][0][0].y = 'b';
  cube.cube[1][0][0].z = 'r';

  cube.cube[2][0][0].z = 'g';
  cube.cube[2][0][0].y = 'o';
  cube.cube[2][0][0].x = 'y';

  // second row on green face
  cube.cube[0][1][0].z = 'r';
  cube.cube[0][1][0].x = 'w';

  cube.cube[1][1][0].z = 'g';

  cube.cube[2][1][0].z = 'y';
  cube.cube[2][1][0].x = 'g';

  // third row of pieces on green face
  cube.cube[0][2][0].z = 'g';
  cube.cube[0][2][0].y = 'y';
  cube.cube[0][2][0].x = 'r';

  cube.cube[1][2][0].y = 'y';
  cube.cube[1][2][0].z = 'b';

  cube.cube[2][2][0].z = 'w';
  cube.cube[2][2][0].y = 'r';
  cube.cube[2][2][0].x = 'g';

  // next layer
  cube.cube[0][0][1].y = 'o';
  cube.cube[0][0][1].x = 'g';

  cube.cube[0][1][1].x = 'o';

  cube.cube[0][2][1].y = 'o';
  cube.cube[0][2][1].x = 'b';

  cube.cube[1][2][1].y = 'w';
  cube.cube[1][0][1].y = 'y';

  cube.cube[2][0][1].y = 'y';
  cube.cube[2][0][1].x = 'o';

  cube.cube[2][1][1].x = 'r';

  cube.cube[2][2][1].y = 'g';
  cube.cube[2][2][1].x = 'w';

  // last layer
  // first row of pieces on blue face
  cube.cube[0][0][2].z = 'o';
  cube.cube[0][0][2].y = 'g';
  cube.cube[0][0][2].x = 'w';

  cube.cube[1][0][2].y = 'r';
  cube.cube[1][0][2].z = 'y';

  cube.cube[2][0][2].z = 'b';
  cube.cube[2][0][2].y = 'y';
  cube.cube[2][0][2].x = 'r';

  // second row on blue face
  cube.cube[0][1][2].z = 'g';
  cube.cube[0][1][2].x = 'r';

  cube.cube[1][1][2].z = 'b';

  cube.cube[2][1][2].z = 'o';
  cube.cube[2][1][2].x = 'w';

  // third row of pieces on blue face
  cube.cube[0][2][2].z = 'o';
  cube.cube[0][2][2].y = 'y';
  cube.cube[0][2][2].x = 'b';

  cube.cube[1][2][2].y = 'w';
  cube.cube[1][2][2].z = 'b';

  cube.cube[2][2][2].z = 'o';
  cube.cube[2][2][2].y = 'w';
  cube.cube[2][2][2].x = 'b';
};
