const assert = require('assert')
const { PieceDefinitions, PieceTypes } = require('../../../src/tetrisGame/pieces/PieceFactory')
const { TetrisPiece } = require('../../../src/tetrisGame/pieces/TetrisPiece')
const { Vector2 } = require('../../../src/tetrisGame/Vector2')

describe("TetrisPiece", () => {
  it("Should construct with proper data", () => {
    const definition = PieceDefinitions[PieceTypes.T];
    const spawnPosition = new Vector2(3, 19);
    const piece = new TetrisPiece(PieceTypes.T, definition.color, spawnPosition, definition.pieces, definition.rotationOrigin);

    assert.equal(piece.pieceType, PieceTypes.T);
    assert.equal(piece.pieceColor, definition.color);
    assert.equal(piece.rotationOrigin.x, definition.rotationOrigin.x);
    assert.equal(piece.rotationOrigin.y, definition.rotationOrigin.y);
  })

  it("Should rotate clockwise properly", () => {
    const definition = PieceDefinitions[PieceTypes.T];
    const spawnPosition = new Vector2(3, 19);
    const piece = new TetrisPiece(PieceTypes.T, definition.color, spawnPosition, definition.pieces, definition.rotationOrigin);

    piece.rotatePiece(true);

    /**
     *    0  1  2  3  4           0  1  2  3  4   
     *   +--+--+--+--+--+        +--+--+--+--+--+ 
     * 4 |  |  |██|  |  |      4 |  |  |██|  |  | 
     * 3 |  |██|██|██|  |      3 |  |  |██|██|  | 
     * 2 |  |  |  |  |  |  =>  2 |  |  |██|  |  | 
     * 1 |  |  |  |  |  |      1 |  |  |  |  |  | 
     * 0 |  |  |  |  |  |      0 |  |  |  |  |  | 
     *   +--+--+--+--+--+        +--+--+--+--+--+ 
     */

    // Must be kept in the same order of appearances
    const expectedPieces = [
      new Vector2(3, 3),
      new Vector2(2, 4),
      new Vector2(2, 3),
      new Vector2(2, 2)
    ]

    for (let i = 0; i < 4; i++) {
      assert.equal(piece.pieces[i].x, expectedPieces[i].x);
      assert.equal(piece.pieces[i].y, expectedPieces[i].y);
    }
  })

  it("Should rotate counter-clockwise properly", () => {
    const definition = PieceDefinitions[PieceTypes.T];
    const spawnPosition = new Vector2(3, 19);
    const piece = new TetrisPiece(PieceTypes.T, definition.color, spawnPosition, definition.pieces, definition.rotationOrigin);

    piece.rotatePiece(false);

    /**
     *    0  1  2  3  4           0  1  2  3  4   
     *   +--+--+--+--+--+        +--+--+--+--+--+ 
     * 4 |  |  |██|  |  |      4 |  |  |██|  |  | 
     * 3 |  |██|██|██|  |      3 |  |██|██|  |  | 
     * 2 |  |  |  |  |  |  =>  2 |  |  |██|  |  | 
     * 1 |  |  |  |  |  |      1 |  |  |  |  |  | 
     * 0 |  |  |  |  |  |      0 |  |  |  |  |  | 
     *   +--+--+--+--+--+        +--+--+--+--+--+ 
     */

    // Must be kept in the same order of appearances
    const expectedPieces = [
      new Vector2(1, 3),
      new Vector2(2, 2),
      new Vector2(2, 3),
      new Vector2(2, 4)
    ]

    for (let i = 0; i < 4; i++) {
      assert.equal(piece.pieces[i].x, expectedPieces[i].x);
      assert.equal(piece.pieces[i].y, expectedPieces[i].y);
    }
  })

  it("Should get occupied coordinates", () => {
    /**
     *    4  5  6  7  8    
     *   +--+--+--+--+--+  
     * 9 |  |  |██|  |  |  
     * 8 |  |██|██|██|  |  
     * 7 |  |  |  |  |  |  
     * 6 |  |  |  |  |  |  
     * 5 |  |  |  |  |  |  
     *   +--+--+--+--+--+  
     */

    const definition = PieceDefinitions[PieceTypes.T];
    const spawnPosition = new Vector2(4, 5);
    const piece = new TetrisPiece(PieceTypes.T, definition.color, spawnPosition, definition.pieces, definition.rotationOrigin);

    const occupied = piece.getOccupiedCoordinates();
    const expectedOccupied = [
      new Vector2(6, 9),
      new Vector2(5, 8),
      new Vector2(6, 8),
      new Vector2(7, 8),
    ];

    for (let i = 0; i < 4; i++) {
      assert.equal(occupied[i].x, expectedOccupied[i].x);
      assert.equal(occupied[i].y, expectedOccupied[i].y);
    }
  })

  it("Should get occupied coordinates after rotating", () => {
    const definition = PieceDefinitions[PieceTypes.T];
    const spawnPosition = new Vector2(4, 5);
    const piece = new TetrisPiece(PieceTypes.T, definition.color, spawnPosition, definition.pieces, definition.rotationOrigin);

    piece.rotatePiece(true);

    /**
     *    4  5  6  7  8  
     *   +--+--+--+--+--+
     * 9 |  |  |██|  |  |
     * 8 |  |  |██|██|  |
     * 7 |  |  |██|  |  |
     * 6 |  |  |  |  |  |
     * 5 |  |  |  |  |  |
     *   +--+--+--+--+--+
     */

     const occupied = piece.getOccupiedCoordinates();
     const expectedOccupied = [
       new Vector2(7, 8),
       new Vector2(6, 9),
       new Vector2(6, 8),
       new Vector2(6, 7),
     ];
 
     for (let i = 0; i < 4; i++) {
       console.log(`${i}: `)
       assert.equal(occupied[i].x, expectedOccupied[i].x);
       assert.equal(occupied[i].y, expectedOccupied[i].y);
     }
  })
})