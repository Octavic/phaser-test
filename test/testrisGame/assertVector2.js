const assert = require("assert");
const { Vector2 } = require("../../src/tetrisGame/Vector2");

const assertVector2 = {
  /**
   * 
   * @param {Vector2} v1 
   * @param {Vector2} v2 
   */
  equal: (v1, v2) => {
    if (v1.x != v2.x || v1.y != v2.y) {
      throw new Error(`Vectors should equal (${v1.x}, ${v1.y}) and (${v2.x}, ${v2.y})`)
    }
  },
  notEqual: (v1, v2) => {
    if (v1.x == v1.x && v1.y == v2.y) {
      throw new Error(`Vectors should not equal (${v1.x}, ${v1.y})`)
    }
  }
}

module.exports = assertVector2