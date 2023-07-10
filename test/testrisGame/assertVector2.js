const assert = require("assert");
const { Vector2 } = require("../../src/tetrisGame/Vector2");

const assertVector2 = {
  /**
   * 
   * @param {Vector2} result 
   * @param {Vector2} expected 
   */
  equal: (result, expected) => {
    if (result.x != expected.x || result.y != expected.y) {
      throw new Error(`Result should equal to (${expected.x}, ${expected.y}), but got (${result.x}, ${result.y})`)
    }
  },
  notEqual: (result, expected) => {
    if (result.x == result.x && result.y == expected.y) {
      throw new Error(`Result should not equal (${result.x}, ${result.y})`)
    }
  }
}

module.exports = assertVector2