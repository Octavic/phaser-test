const { PieceColors, PieceFactory } = require("./pieces/PieceFactory");
const { TetrisPiece } = require("./pieces/TetrisPiece");
const { Vector2 } = require("./Vector2");

class TetrisGame {
  //#region Board Data
  /** @type {number} */
  boardSizeX;

  /** @type {number} */
  boardSizeY;

  /** @type {Vector2} */
  defaultSpawnPosition;

  /**
   * The filled board of colors, get by using boardState[y][x]
   * @type {string[][]}
   */
  boardState;

  constructor(boardSizeX = 10, boardSizeY = 20, defaultSpawnPosition = null) {
    this.boardSizeX = boardSizeX;
    this.boardSizeY = boardSizeY;

    this.defaultSpawnPosition = defaultSpawnPosition || new Vector2(2, 16);

    this.boardState = [];
    for (let y = 0; y < boardSizeY; y++) {
      let row = [];
      for (let x = 0; x < boardSizeX; x++) {
        row.push(null)
      }
      this.boardState.push(row)
    }
  }

  /**
   * Check if the given coordinate is on the board. Y can be higher than the board size Y in case of overflow and garbage push
   * @param {Vector2} coordinate 
   */
  isCoordinateInBounds(coordinate) {
    const { x, y } = coordinate;
    return x >= 0 && x < this.boardSizeX && y >= 0;
  }

  //#endregion

  //#region Piece Data
  /** @type {TetrisPiece} */
  holdingPiece;

  /** @type {boolean} */
  isHoldingLocked;

  /** @type {TetrisPiece} */
  activePiece;

  /** @type {TetrisPiece[]} */
  bagPieces;

  /** @type {number} */
  bagSize;

  onCommitPiece() {
    this.isHoldingLocked = false;
    this.bagPieces.push(PieceFactory.generateRandomPiece());
  }

  onSwitchHolding() {
    if (!this.holdingPiece || this.isHoldingLocked) {
      return;
    }

    // Lock out of switching holding until the player commits placing this piece
    this.isHoldingLocked = true;

    // Swap
    const oldPiece = this.holdingPiece;
    this.holdingPiece = this.activePiece;
    this.activePiece = oldPiece;

    // Reset position
    oldPiece.currentPosition = this.defaultSpawnPosition;
  }

  /**
   * Check if the piece is occupying all open spaces
   * @param {TetrisPiece} piece 
   */
  isPieceLegal(piece) {
    for (var coordinate of piece.getOccupiedCoordinates()) {
      if (!this.isCoordinateInBounds(coordinate)) {
        return false;
      }

      if (this.boardState[coordinate.y][coordinate.x]) {
        return false;
      }
    }

    return true;
  }

  // Try to lower the current active piece
  tryLowerActivePiece() {
    const newPiece = TetrisPiece.clone(this.activePiece);
    newPiece.currentPosition.y--;

    if (this.isPieceLegal(newPiece)) {
      this.activePiece = newPiece;
      return true;
    }
    return false;
  }

  /**
   * 
   * @param {boolean} isClockwise 
   * @return {boolean}
   */
  tryRotatePiece(isClockwise) {
    const newPiece = TetrisPiece.clone(this.activePiece);
    newPiece.rotatePiece(isClockwise);

    // TODO:
    // Add wiggle room here so the piece may pop up or deeper in for T-spin triples

    if (this.isPieceLegal(newPiece)) {
      this.activePiece = newPiece;
      return true;
    }
    return false;
  }
  //#endregion

  //#region Game Life Cycle
  /** @type {number} */
  msTimeUntilLower;

  /** @type {number} */
  msTimeUntilForceSettle;
  
  /** @type {number} */
  msTimeUntilSettle;

  update(msTimePassed) {

  }
  //#endregion
}

module.exports = {
  TetrisGame
}