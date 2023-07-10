const Phaser = require("phaser")
const { TetrisPiece } = require("../tetrisGame/pieces/TetrisPiece");
const { Vector2 } = require("../tetrisGame/Vector2");

class SmallTetrisPieceDisplay {
  constructor(posX, posY, backgroundColor, gridSize, gridSpacing) {
    this.posX = posX;
    this.posY = posY;
    this.backgroundColor = backgroundColor;
    this.gridSize = gridSize;
    this.gridSpacing = gridSpacing;
  }

  getGridCoordinateFor(x, y) {
    return {
      posX: this.posX + x * (this.gridSize + this.gridSpacing),
      posY: this.posY + (5 - y) * (this.gridSize + this.gridSpacing),
    }
  }

  /**
   * @param {TetrisPiece} targetPiece 
   * @param {Phaser.Scene} scene 
   */
  redraw(targetPiece, scene) {
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        const { posX, posY } = this.getGridCoordinateFor(x, y);
        var isOccupied = false;

        // Check if target piece exists and if the cell needs to be filled
        if (targetPiece) {
          var currentCoordinate = new Vector2(x, y);
          for (var localCoordinate of targetPiece.pieces) {
            if (localCoordinate.equalsVector2(currentCoordinate)) {
              isOccupied = true;
            }
          }
        }

        // Fill in
        scene.add.rectangle(posX, posY, this.gridSize, this.gridSize, isOccupied ? targetPiece.pieceColor : this.backgroundColor);
      }
    }
  }
}

module.exports = SmallTetrisPieceDisplay;