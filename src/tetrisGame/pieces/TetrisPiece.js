const { Vector2 } = require("../Vector2");

class TetrisPiece {
  /**
   * @type {string}
   */
  pieceType;

  /**
   * @type {string}
   */
  pieceColor;

  /**
   * @type {Vector2[]}
   */
  pieces;

  /**
   * @type {Vector2}
   */
  rotationOrigin;

  /**
   * @type {Vector2}
   */
  currentPosition;

  /**
   * 
   * @param {string} pieceType 
   * @param {string} pieceColor 
   * @param {Vector2} currentPosition 
   * @param {Vector2[]} pieces 
   * @param {Vector2} rotationOrigin 
   */
  constructor(pieceType, pieceColor, currentPosition, pieces, rotationOrigin = null) {
    this.pieceType = pieceType;
    this.pieceColor = pieceColor;
    this.currentPosition = currentPosition;

    this.pieces = pieces;
    this.rotationOrigin = rotationOrigin;
  }

  rotatePiece(isClockwise) {
    // No origin defined, cannot rotate (square piece)
    if (!this.rotationOrigin) {
      return;
    }

    this.pieces = this.pieces.map(coordinate => coordinate.rotate(isClockwise, this.rotationOrigin))
  }

  /**
   * @returns {Vector2[]}
   */
  getOccupiedCoordinates() {
    return this.pieces.map(localCoordinate => this.currentPosition.addVector2(localCoordinate));
  }
}

module.exports = {
  TetrisPiece
}