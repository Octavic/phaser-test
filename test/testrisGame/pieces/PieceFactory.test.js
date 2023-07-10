const assert = require("assert");
const { PieceFactory, PieceTypes } = require("../../../src/tetrisGame/pieces/PieceFactory");
const { Vector2 } = require("../../../src/tetrisGame/Vector2");
const assertVector2 = require("../assertVector2");

describe("PieceFactory", () => {
  const pieceFactory = new PieceFactory();

  it("Should generate the correct piece", () => {
    /**
     *    5  6  7  8  9   
     *   +--+--+--+--+--+ 
     * 9 |  |  |██|██|  | 
     * 8 |  |██|██|  |  | 
     * 7 |  |  |  |  |  | 
     * 6 |  |  |  |  |  | 
     * 5 |  |  |  |  |  | 
     *   +--+--+--+--+--+ 
     */
    const spawnPosition = new Vector2(5, 5);
    const result = pieceFactory.generatePiece(PieceTypes.S, spawnPosition);

    assert.equal(result.pieceType, PieceTypes.S);
    assertVector2.equal(result.currentPosition, spawnPosition);

    const occupied = result.getOccupiedCoordinates();
    const expectedOccupied = [
      new Vector2(7, 9),
      new Vector2(8, 9),
      new Vector2(6, 8),
      new Vector2(7, 8),
    ]

    for (let i = 0; i < 4; i++) {
      assertVector2.equal(occupied[i], expectedOccupied[i]);
    }
  })

  it("Should generate a random piece", () => {
    // Generate 100 pieces. Should not all be the same types
    const spawnPosition = new Vector2(5, 5);
    const randomPieceType = pieceFactory.generateRandomPiece(spawnPosition).pieceType;
    for (let i = 0; i < 100; i++) {
      if (pieceFactory.generateRandomPiece(spawnPosition).pieceType != randomPieceType) {
        return;
      }
    }

    throw new Error("Should have had a different piece type after 100 new pieces");
  })
})