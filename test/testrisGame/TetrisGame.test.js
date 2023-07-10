const { TetrisGame } = require("../../src/tetrisGame/TetrisGame");
const assert = require('assert');
const { Vector2 } = require("../../src/tetrisGame/Vector2");
const { TetrisPiece } = require("../../src/tetrisGame/pieces/TetrisPiece");
const { PieceFactory, PieceTypes, PieceColors } = require("../../src/tetrisGame/pieces/PieceFactory");
const assertVector2 = require("./assertVector2");

describe("TetrisGame", () => {
  it("Should construct with right x and y", () => {
    const game = new TetrisGame(10, 20);
    assert.equal(game.boardSizeX, 10);
    assert.equal(game.boardSizeY, 20);
  })

  describe("isCoordinateInBounds", () => {
    const game = new TetrisGame(10, 20);

    it("Should return true coordinate that's within bounds", () => {
      const coords = new Vector2(5, 5);
      assert.equal(game.isCoordinateInBounds(coords), true);
    })

    it("Should return false for coordinate that's outside bounds", () => {
      const coords = new Vector2(11, 5);
      assert.equal(game.isCoordinateInBounds(coords), false);
    })

    it("Should return true for coordinate that's on the border", () => {
      const coords = new Vector2(0, 5);
      assert.equal(game.isCoordinateInBounds(coords), true);
    })

    it("Should return true for coordinate that's on the corner", () => {
      const coords = new Vector2(9, 19);
      assert.equal(game.isCoordinateInBounds(coords), true);
    })

    it("Should return true for coordinate that's barely outside", () => {
      const coords = new Vector2(10, 15);
      assert.equal(game.isCoordinateInBounds(coords), false);
    })

    it("Should return true for coordinate that's higher than y", () => {
      const coords = new Vector2(5, 50);
      assert.equal(game.isCoordinateInBounds(coords), true);
    })
  })

  describe("isPieceLegal", () => {
    it("Should block pieces that's outside left bound", () => {
      /**
       *    -1 0  1  2  3 
       *   +--+--+--+--+--+
       * 4 |xx|  |  |  |  |
       * 3 |xx|██|██|  |  |
       * 2 |xx|██|██|  |  |
       * 1 |xx|  |  |  |  |
       * 0 |xx|  |  |  |  |
       *   +--+--+--+--+--+
       */
      const game = new TetrisGame(10, 20);
      const piece = PieceFactory.generatePiece(PieceTypes.Square, new Vector2(-2, 0));

      assert.equal(game.isPieceLegal(piece), false);
    })

    it("Should block pieces that's outside right bound", () => {
      /**
       *    6  7  8  9  10
       *   +--+--+--+--+--+
       * 4 |  |  |  |  |xx|
       * 3 |  |██|██|  |xx|
       * 2 |  |██|██|  |xx|
       * 1 |  |  |  |  |xx|
       * 0 |  |  |  |  |xx|
       *   +--+--+--+--+--+
       */
      const game = new TetrisGame(10, 20);
      const piece = PieceFactory.generatePiece(PieceTypes.Square, new Vector2(8, 0));

      assert.equal(game.isPieceLegal(piece), false);
    })

    it("Should block pieces that's below the bottom bound", () => {
      /**
       *    0  1  2  3  4
       *   +--+--+--+--+--+
       * 2 |  |  |  |  |  |
       * 1 |  |██|██|  |  |
       * 0 |  |██|██|  |  |
       * -1|xx|xx|xx|xx|xx|
       * -2|  |  |  |  |  |
       *   +--+--+--+--+--+
       */
      const game = new TetrisGame(10, 20);
      const piece = PieceFactory.generatePiece(PieceTypes.Square, new Vector2(0, -3));

      assert.equal(game.isPieceLegal(piece), false);
    })

    it("Should block pieces that interpolates with an existing piece", () => {
      /**
       *    0  1  2  3  4
       *   +--+--+--+--+--+
       * 4 |  |  |  |  |  |
       * 3 |  |██|██|  |  |
       * 2 |  |██|██|  |  |
       * 1 |  |  |OO|  |  |
       * 0 |  |  |  |  |  |
       *   +--+--+--+--+--+
       */
      const game = new TetrisGame(10, 20);
      game.boardState[1][2] = PieceColors.Blue;

      const pieceOnTop = PieceFactory.generatePiece(PieceTypes.Square, new Vector2(0, 0));
      assert.equal(game.isPieceLegal(pieceOnTop), true);

      const pieceInside = PieceFactory.generatePiece(PieceTypes.Square, new Vector2(0, -1));
      assert.equal(game.isPieceLegal(pieceInside), false);
    })
  })

  describe("Piece Actions", () => {
    it("Should allow newly spawned piece to drop down", () => {
      const game = new TetrisGame(10, 20);
      const spawnPosition = game.defaultSpawnPosition;
      game.activePiece = PieceFactory.generatePiece(PieceTypes.Square, spawnPosition);

      // Should be allowed
      assert.equal(game.tryLowerActivePiece(), true);

      // Should see the piece falling
      assert.equal(game.activePiece.currentPosition.y, spawnPosition.y - 1);
    })

    it("Should not allow piece that's blocked to drop down", () => {
      /**
       *    0  1  2  3  4   
       *   +--+--+--+--+--+ 
       * 4 |  |██|██|  |  | 
       * 3 |  |  |██|██|  | 
       * 2 |  |  |OO|  |  | 
       * 1 |  |  |  |  |  | 
       * 0 |  |  |  |  |  | 
       *   +--+--+--+--+--+ 
       */
      const game = new TetrisGame(10, 20);
      game.boardState[2][2] = PieceColors.Blue;
      const spawnPosition = new Vector2(0, 0);
      game.activePiece = PieceFactory.generatePiece(PieceTypes.Square, spawnPosition);

      // Should not be allowed
      assert.equal(game.tryLowerActivePiece(), false);

      // Should not see the piece falling
      assert.equal(game.activePiece.currentPosition.y, spawnPosition.y);
    })

    it("Should allow piece to rotate", () => {
      /**
       *    0  1  2  3  4            0  1  2  3  4   
       *   +--+--+--+--+--+         +--+--+--+--+--+ 
       * 4 |  |  |  |██|  |       4 |  |  |██|  |  | 
       * 3 |  |██|██|██|  |       3 |  |  |██|  |  | 
       * 2 |  |  |  |  |  |  =>   2 |  |  |██|██|  | 
       * 1 |  |  |  |  |  |       1 |  |  |  |  |  | 
       * 0 |  |  |  |  |  |       0 |  |  |  |  |  | 
       *   +--+--+--+--+--+         +--+--+--+--+--+ 
       */
      const game = new TetrisGame(10, 20);
      const spawnPosition = new Vector2(0, 0);
      game.activePiece = PieceFactory.generatePiece(PieceTypes.L, spawnPosition);

      // Should not be allowed
      assert.equal(game.tryRotatePiece(true), true);

      // Should not see the piece falling
      const occupied = game.activePiece.getOccupiedCoordinates();
      const expectedOccupied = [
        new Vector2(3, 2),
        new Vector2(2, 4),
        new Vector2(2, 3),
        new Vector2(2, 2),
      ]

      for (let i = 0; i < 4; i++) {
        assertVector2.equal(occupied[i], expectedOccupied[i])
      }
    })

    // TODO: Add wiggling room to allow the piece to "pop up"
    it("Should not allow piece to rotate when blocked", () => {
      /**
       *    0  1  2  3  4  
       *   +--+--+--+--+--+
       * 4 |  |  |  |██|  |
       * 3 |  |██|██|██|  |
       * 2 |  |  |OO|  |  |
       * 1 |  |  |  |  |  |
       * 0 |  |  |  |  |  |
       *   +--+--+--+--+--+
       */
      const game = new TetrisGame(10, 20);
      const spawnPosition = new Vector2(0, 0);
      game.boardState[2][2] = PieceColors.Blue;
      game.activePiece = PieceFactory.generatePiece(PieceTypes.L, spawnPosition);

      // Should not be allowed
      assert.equal(game.tryRotatePiece(true), false);

      // Should not see the piece falling
      const occupied = game.activePiece.getOccupiedCoordinates();
      const expectedOccupied = [
        new Vector2(3, 4),
        new Vector2(1, 3),
        new Vector2(2, 3),
        new Vector2(3, 3),
      ]

      for (let i = 0; i < 4; i++) {
        assertVector2.equal(occupied[i], expectedOccupied[i])
      }
    })
  })
})