const { PieceColors, PieceFactory } = require("./pieces/PieceFactory");
const { TetrisPiece } = require("./pieces/TetrisPiece");
const { Vector2 } = require("./Vector2");

class TetrisGame {
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

  /**
   * The amount of blocks per row
   */
  blocksPerRow;

  constructor(boardSizeX = 10, boardSizeY = 20, defaultSpawnPosition = null, bagSize = 5, pieceFactory = null) {
    this.boardSizeX = boardSizeX;
    this.boardSizeY = boardSizeY;

    this.defaultSpawnPosition = defaultSpawnPosition || new Vector2(2, 16);

    // Initialize board
    this.boardState = [];
    this.blocksPerRow = [];

    for (let y = 0; y < boardSizeY; y++) {
      let row = [];
      for (let x = 0; x < boardSizeX; x++) {
        row.push(null)
      }
      this.boardState.push(row)
      this.blocksPerRow.push(0);
    }

    // Assign values
    this.pieceFactory = pieceFactory || new PieceFactory();

    // Initialize pieces
    this.bagSize = bagSize;
    this.bagPieces = [];
    for (let i = 0; i < bagSize; i++) {
      this.bagPieces.push(this.pieceFactory.generateRandomPiece(this.defaultSpawnPosition));
    }

    this.activePiece = this.pieceFactory.generateRandomPiece(this.defaultSpawnPosition);
    this.recalculatePiecePhantom();
  }

  /**
   * Check if the given coordinate is on the board. Y can be higher than the board size Y in case of overflow and garbage push
   * @param {Vector2} coordinate 
   */
  isCoordinateInBounds(coordinate) {
    const { x, y } = coordinate;
    return x >= 0 && x < this.boardSizeX && y >= 0;
  }

  //#region Piece Data
  /** @type {TetrisPiece} */
  holdingPiece;

  /** @type {boolean} */
  isHoldingLocked;

  /** @type {TetrisPiece} */
  activePiece;

  /** @type {TetrisPiece} */
  activePiecePhantom;

  /** @type {TetrisPiece[]} */
  bagPieces;

  /** @type {number} */
  bagSize;

  /** @type {PieceFactory} */
  pieceFactory;

  trySwitchHolding() {
    if (this.isHoldingLocked) {
      return false;
    }

    // Lock out of switching holding until the player commits placing this piece
    this.isHoldingLocked = true;

    // Swap and generate a new piece to reset to default rotation
    const oldPiece = this.holdingPiece;
    this.holdingPiece = this.pieceFactory.generatePiece(this.activePiece.pieceType, this.defaultSpawnPosition);
    
    if (oldPiece) {
      this.activePiece = oldPiece;
    } else {
      this.activePiece = this.bagPieces.shift();
      this.bagPieces.push(this.pieceFactory.generateRandomPiece(this.defaultSpawnPosition));
    }

    // Reset position
    this.activePiece.currentPosition = this.defaultSpawnPosition;
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

  tryMoveActivePiece(toRight = true) {
    const newPiece = TetrisPiece.clone(this.activePiece);
    newPiece.currentPosition.x += toRight ? 1 : -1;

    if (this.isPieceLegal(newPiece)) {
      this.activePiece = newPiece;
      this.recalculatePiecePhantom();
      return true;
    }
    return false;
  }

  tryHardDrop() {
    this.activePiece = this.activePiecePhantom;
    this.onCommitPlaceActivePiece();
    return true;
  }

  // Try to lower the current active piece
  tryLowerActivePiece() {
    const newPiece = TetrisPiece.clone(this.activePiece);
    newPiece.currentPosition.y--;

    if (this.isPieceLegal(newPiece)) {
      this.activePiece = newPiece;
      this.recalculatePiecePhantom();
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
      this.recalculatePiecePhantom();
      return true;
    }
    return false;
  }

  recalculatePiecePhantom() {
    const newPiece = TetrisPiece.clone(this.activePiece);
    while(this.isPieceLegal(newPiece)) {
      newPiece.currentPosition.y --;
    }
    newPiece.currentPosition.y ++;
    this.activePiecePhantom = newPiece;
  }
  //#endregion

  //#region Game Life Cycle
  onCommitPlaceActivePiece() {
    const { pieceType, pieceColor } = this.activePiece;

    for (var occupied of this.activePiece.getOccupiedCoordinates()) {
      const { x, y } = occupied;
      if (this.boardState[y][x]) {
        throw new Error(`Piece settled in a position with occupied blocked at (${x},${y})`)
      } else {
        this.boardState[y][x] = pieceColor;
        this.blocksPerRow[y]++;
      }
    }

    // Clear lines
    let distanceToDrop = 0;
    let rowsCleared = 0;
    for (let y = 0; y < this.boardSizeY; y++) {
      // Row is filled, add to how much the above rows need to drop, and continue
      if (this.blocksPerRow[y] == this.boardSizeX) {
        rowsCleared++;
        distanceToDrop++;
        continue;
      }

      console.log(`Cleared ${rowsCleared} row(s)`)

      // Row is not filled, check if shifting is necessary
      if (distanceToDrop > 0) {

        // Shift rows down and clear current row
        for (let x = 0; x < this.boardSizeX; x++) {
          this.boardState[y - distanceToDrop][x] = this.boardState[y][x];
          this.boardState[y][x] = null;
        }

        // Move hash as well
        this.blocksPerRow[y - distanceToDrop] = this.blocksPerRow[y];
        this.blocksPerRow[y] = 0;
      }
    }

    // TODO: Calculate score


    // Fetch new piece
    this.activePiece = this.bagPieces.shift();
    this.bagPieces.push(this.pieceFactory.generateRandomPiece(this.defaultSpawnPosition));
    this.recalculatePiecePhantom();

    this.isHoldingLocked = false;
  }
  //#endregion
}

module.exports = {
  TetrisGame
}