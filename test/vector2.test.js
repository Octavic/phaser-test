const assert = require("assert");
const Vector2 = require("../src/tetrisGame/vector2");

describe("Vector2", () => {
  it("should construct properly", () => {
    const v = new Vector2(1, 2);
    assert.equal(v.x, 1);
    assert.equal(v.y, 2);
  })

  it("should add vectors without changing either", ()=>{
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

  it("should subtract vectors without changing either", ()=>{
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