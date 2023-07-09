const { TetrisGame } = require("../../src/tetrisGame/TetrisGame");
const assert = require('assert');
const { Vector2 } = require("../../src/tetrisGame/Vector2");

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
})