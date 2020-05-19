// this file compresses a set of moves (as notation) with various replacements, ex:
// B, B, B --> B', B, B' --> (no moves), etc.

const compressMoves = (moves) => {
  const repeatArr = (arr, times) => {
    let repeatedArr = [];
    for (let i = 0; i < times; i++) {
      repeatedArr = repeatedArr.concat(arr);
    }

    return repeatedArr;
  };

  // delimeter must be a str whose characters aren't present in Rubik's cube notation
  const moveStrDelimeter = ';';

  // delimeter is added to the end to account for bugs in replacing end moves
  let allMovesStr = moves.join(moveStrDelimeter) + moveStrDelimeter;

  const replaceMoves = (targetMoves, replacementMoves) => {
    if (targetMoves.length === 0) {
      return;
    }

    // delimeter is added to the end of target and replacement to account for bugs in replacing moves with no moves
    const targetMovesAsStr = targetMoves.join(moveStrDelimeter) + moveStrDelimeter;
    const replacementMovesAsStr = replacementMoves.join(moveStrDelimeter) + (replacementMoves.length > 1 ? moveStrDelimeter : '');
    allMovesStr = allMovesStr.split(targetMovesAsStr).join(replacementMovesAsStr);
  };

  const getInverse = (notation) => {
    if (notation.length === 1) {
      return notation + "'";
    } else {
      return notation[0];
    }
  };
  const isInverse = (notation) => notation.length > 1 && notation[1] === "'";

  // solve for piece algorithm replacements
  const pieceAlgorithmFirstMoves = ['L', 'F', 'R', 'B', "F'", "R'", "B'", "L'"];

  pieceAlgorithmFirstMoves.forEach((firstMove) => {
    const sequence = [firstMove, isInverse(firstMove) ? "D'" : 'D', getInverse(firstMove), isInverse(firstMove) ? 'D' : "D'"];
    const inverseSequence = [getInverse(sequence[3]), getInverse(sequence[2]), getInverse(sequence[1]), getInverse(sequence[0])];

    // replace 5 sequences with 1 inverse sequence;
    // replace 4 sequences with 2 inverse sequences;
    replaceMoves(repeatArr(sequence, 5), inverseSequence);
    replaceMoves(repeatArr(sequence, 4), repeatArr(inverseSequence, 2));
  });

  // main move replacements
  const possibleNonInverseMoves = ['U', 'D', 'L', 'R', 'F', 'B'];

  possibleNonInverseMoves.forEach((move) => {
    const inverseMove = move + "'";

    // replace 4 consecutive moves with no move
    replaceMoves([move, move, move, move], []);
    replaceMoves([inverseMove, inverseMove, inverseMove, inverseMove], []);

    // replace 3 consecutive non inverse moves with one inverse move
    replaceMoves([move, move, move, move], [inverseMove]);

    // replace 3 consecutive inverse moves with one non inverse move
    replaceMoves([inverseMove, inverseMove, inverseMove, inverseMove], [move]);

    // replace one inverse move followed by one non inverse move with nothing
    replaceMoves([inverseMove, move], []);

    // replace one non inverse move followed by one inverse move with nothing
    replaceMoves([move, inverseMove], []);
  });

  // convert movesAsStr back to array of moves
  const allMovesArr = allMovesStr.split(moveStrDelimeter);

  // remove last element to account for last extra delimeter added previously
  allMovesArr.pop();

  return allMovesArr;
};

// keep on compressing until no compressions are made (similar to bubble sort for example)
module.exports = (moves) => {
  moves = JSON.parse(JSON.stringify(moves));

  let compressionsMade = true;

  while (compressionsMade && moves.length > 0) {
    const movesBefore = JSON.stringify(moves);
    moves = compressMoves(moves);
    const movesAfter = JSON.stringify(moves);

    compressionsMade = movesBefore !== movesAfter;
  }

  return moves;
};
