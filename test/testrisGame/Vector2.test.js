const assert = require("assert");
const { Vector2 } = require("../../src/tetrisGame/Vector2");

describe("Vector2", () => {

  it("should construct properly", () => {
    const v = new Vector2(1, 2);
    assert.equal(v.x, 1);
    assert.equal(v.y, 2);
  })

  describe("Vector math", () => {
    it("should add vectors without changing either", () => {
      const v1 = new Vector2(1, 2);
      const v2 = new Vector2(3, 4);

      const result = v1.addVector2(v2);

      assert.equal(v1.x, 1);
      assert.equal(v1.y, 2);

      assert.equal(v2.x, 3);
      assert.equal(v2.y, 4);

      assert.equal(result.x, 4);
      assert.equal(result.y, 6);
    })

    it("should subtract vectors without changing either", () => {
      const v1 = new Vector2(1, 2);
      const v2 = new Vector2(3, 5);

      const result = v1.subVector2(v2);

      assert.equal(v1.x, 1);
      assert.equal(v1.y, 2);

      assert.equal(v2.x, 3);
      assert.equal(v2.y, 5);

      assert.equal(result.x, -2);
      assert.equal(result.y, -3);
    })
  })

  describe("Vector rotation", () => {
    it("Should return origin when rotating around origin", () => {
      const v = new Vector2(4, 2);
      const origin = new Vector2(4, 2);
      const result = v.rotate(true, origin);

      assert.equal(result.x, 4);
      assert.equal(result.y, 2);
    })

    it("Should rotate clockwise around 0,0", () => {
      const v = new Vector2(4, 2);
      const result = v.rotate(true);

      assert.equal(result.x, 2);
      assert.equal(result.y, -4);
    })

    it("Should rotate counter-clockwise around 0,0", () => {
      const v = new Vector2(4, 2);
      const result = v.rotate(false);

      assert.equal(result.x, -2);
      assert.equal(result.y, 4);
    })

    it("Should rotate clockwise around 0,0", () => {
      const v = new Vector2(4, 2);
      const result = v.rotate(true);

      assert.equal(result.x, 2);
      assert.equal(result.y, -4);
    })

    it("Should rotate clockwise around a coordinate", () => {
      const v = new Vector2(4, 2);
      const origin = new Vector2(1, 1);
      const result = v.rotate(true, origin);

      assert.equal(result.x, 2);
      assert.equal(result.y, -2);
    })

    it("Should rotate counter-clockwise around a coordinate", () => {
      const v = new Vector2(4, 2);
      const origin = new Vector2(1, 1);
      const result = v.rotate(false, origin);

      assert.equal(result.x, 0);
      assert.equal(result.y, 4);
    })

    it("Should rotate clockwise around a coordinate on the same axis", () => {
      const v = new Vector2(2, 0);
      const origin = new Vector2(2, 1);
      const result = v.rotate(true, origin);

      assert.equal(result.x, 1);
      assert.equal(result.y, 1);
    })
  })
})