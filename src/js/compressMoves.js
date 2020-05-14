// this file compresses a set of moves (as notation) with various replacements, ex:
// B, B, B --> B', B, B' --> (no moves), etc.

module.exports = (moves) => {
  // delimeter must be a str whose characters aren't present in Rubik's cube notation
  const moveStrDelimeter = ';';

  // delimeter is added to the end to account for bugs in replacing end moves
  let allMovesStr = moves.join(moveStrDelimeter) + moveStrDelimeter;

  const replaceMoves = (targetMoves, replacementMoves) => {
    if (targetMoves.length === 0) {
      return;
    }

    // delimeter is added to the end of target and replacement to account for bugs
    // in replacing moves with no moves
    const targetMovesAsStr = targetMoves.join(moveStrDelimeter) + moveStrDelimeter;
    const replacementMovesAsStr = replacementMoves.join(moveStrDelimeter) + (replacementMoves.length > 1 ? moveStrDelimeter : '');
    allMovesStr = allMovesStr.split(targetMovesAsStr).join(replacementMovesAsStr);
  };

  const possibleNonInverseMoves = ['U', 'D', 'L', 'R', 'F', 'B'];

  // replacements
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

  // converse movesAsStr back to array of moves
  const allMovesArr = allMovesStr.split(moveStrDelimeter);

  // remove last element to account for last extra delimeter added previously
  allMovesArr.pop();

  return allMovesArr;
};
