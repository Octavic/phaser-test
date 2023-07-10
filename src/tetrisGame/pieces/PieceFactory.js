const { Vector2 } = require("../Vector2")
const { TetrisPiece } = require("./TetrisPiece")

const PieceTypes = {
  Square: "Square",
  Line: "Line",
  T: "T",
  Z: "Z",
  S: "S",
  L: "L",
  J: "J",
}

const PieceTypesKeys = Object.keys(PieceTypes);

const PieceColors = {
  Yellow: 0xfffb0d,
  Teal: 0x45beff,
  Purple: 0xd445ff,
  Red: 0xff524d,
  Green: 0x0cf523,
  Orange: 0xff781f,
  Blue: 0x461cff
}

// The piece definitions.
// key: Type of piece
// color: The color of the piece
// Rotations: All possible rotations, going clockwise
const PieceDefinitions = {
  [PieceTypes.Square]: {
    color: PieceColors.Yellow,
    /**
     *    0  1  2  3  4
     *   +--+--+--+--+--+
     * 4 |  |██|██|  |  |
     * 3 |  |██|██|  |  |
     * 2 |  |  |  |  |  |
     * 1 |  |  |  |  |  |
     * 0 |  |  |  |  |  |
     *   +--+--+--+--+--+
     */
    pieces: [
      new Vector2(1, 4),
      new Vector2(2, 4),
      new Vector2(1, 3),
      new Vector2(2, 3),
    ],
    rotationOrigin: null
  },

  [PieceTypes.Line]: {
    color: PieceColors.Teal,
    /**
     *    0  1  2  3  4   
     *   +--+--+--+--+--+ 
     * 4 |██|██|██|██|  | 
     * 3 |  |  |  |  |  | 
     * 2 |  |  |  |  |  | 
     * 1 |  |  |  |  |  | 
     * 0 |  |  |  |  |  | 
     *   +--+--+--+--+--+ 
     */
    pieces: [
      new Vector2(0, 4),
      new Vector2(1, 4),
      new Vector2(2, 4),
      new Vector2(3, 4),
    ],
    rotationOrigin: new Vector2(2, 3)
  },

  [PieceTypes.T]: {
    color: PieceColors.Purple,
    /**
     *    0  1  2  3  4   
     *   +--+--+--+--+--+ 
     * 4 |  |  |██|  |  | 
     * 3 |  |██|██|██|  | 
     * 2 |  |  |  |  |  | 
     * 1 |  |  |  |  |  | 
     * 0 |  |  |  |  |  | 
     *   +--+--+--+--+--+ 
     */
    pieces: [
      new Vector2(2, 4),
      new Vector2(1, 3),
      new Vector2(2, 3),
      new Vector2(3, 3)
    ],
    rotationOrigin: new Vector2(2, 3)
  },

  [PieceTypes.Z]: {
    color: PieceColors.Red,
    /**
     *    0  1  2  3  4   
     *   +--+--+--+--+--+ 
     * 4 |  |██|██|  |  | 
     * 3 |  |  |██|██|  | 
     * 2 |  |  |  |  |  | 
     * 1 |  |  |  |  |  | 
     * 0 |  |  |  |  |  | 
     *   +--+--+--+--+--+ 
     */
    pieces: [
      new Vector2(1, 4),
      new Vector2(2, 4),
      new Vector2(2, 3),
      new Vector2(3, 3)
    ],
    rotationOrigin: new Vector2(2, 3)
  },

  [PieceTypes.S]: {
    color: PieceColors.Green,
    /**
     *    0  1  2  3  4   
     *   +--+--+--+--+--+ 
     * 4 |  |  |██|██|  | 
     * 3 |  |██|██|  |  | 
     * 2 |  |  |  |  |  | 
     * 1 |  |  |  |  |  | 
     * 0 |  |  |  |  |  | 
     *   +--+--+--+--+--+ 
     */
    pieces: [
      new Vector2(2, 4),
      new Vector2(3, 4),
      new Vector2(1, 3),
      new Vector2(2, 3)
    ],
    rotationOrigin: new Vector2(2, 3)
  },

  [PieceTypes.L]: {
    color: PieceColors.Orange,
    /**
     *    0  1  2  3  4   
     *   +--+--+--+--+--+ 
     * 4 |  |  |  |██|  | 
     * 3 |  |██|██|██|  | 
     * 2 |  |  |  |  |  | 
     * 1 |  |  |  |  |  | 
     * 0 |  |  |  |  |  | 
     *   +--+--+--+--+--+ 
     */
    pieces: [
      new Vector2(3, 4),
      new Vector2(1, 3),
      new Vector2(2, 3),
      new Vector2(3, 3)
    ],
    rotationOrigin: new Vector2(2, 3)
  },

  [PieceTypes.J]: {
    color: PieceColors.Blue,
    /**
     *    0  1  2  3  4   
     *   +--+--+--+--+--+ 
     * 4 |  |██|  |  |  | 
     * 3 |  |██|██|██|  | 
     * 2 |  |  |  |  |  | 
     * 1 |  |  |  |  |  | 
     * 0 |  |  |  |  |  | 
     *   +--+--+--+--+--+ 
     */
    pieces: [
      new Vector2(1, 4),
      new Vector2(1, 3),
      new Vector2(2, 3),
      new Vector2(3, 3)
    ],
    rotationOrigin: new Vector2(2, 3)
  }
}


/**
 * Class generating new pieces
 */
class PieceFactory {
  generatePiece(pieceType, spawnPosition) {
    const definition = PieceDefinitions[pieceType];
    const result = new TetrisPiece(
      pieceType,
      definition.color,
      spawnPosition,
      definition.pieces,
      definition.rotationOrigin
    );
    return result;
  }

  generateRandomPiece(spawnPosition) {
    return this.generatePiece(PieceTypesKeys[Math.floor(Math.random() * PieceTypesKeys.length)], spawnPosition);
  }
}

module.exports = {
  PieceTypes,
  PieceColors,
  PieceDefinitions,
  PieceFactory,
}