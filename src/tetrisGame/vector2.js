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

  /**
   * @param {Vector2} other 
   * @returns {Vector2}
   */
  addVector2(other) {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

   /**
   * @param {Vector2} other 
   * @returns {Vector2}
   */
  subVector2(other) {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  /**
   * @param {boolean} isClockwise 
   * @param {Vector2} origin 
   * @returns {Vector2}
   */
  rotate(isClockwise, origin = null) {
    if (!origin) {
      origin = new Vector2(0, 0);
    }

    // If the same as origin, no need to rotate. Create new and return
    if (this.x === origin.x && this.y === origin.y) {
      return new Vector2(this.x, this.y);
    }

    const diff = this.subVector2(origin);
    var newDiff = isClockwise
      ? new Vector2(diff.y, -diff.x)
      : new Vector2(-diff.y, diff.x);

    return origin.addVector2(newDiff);
  }
}

module.exports = {
  Vector2
};