class Vector2 {
  /**
   * @type {number}
   * @public
   */
  x;

  /**
   * @type {number}
   * @public
   */
  y;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  addVector2(other) {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  subVector2(other) {
    return new Vector2(this.x - other.x, this.y - other.y);
  }
}

module.exports = Vector2;