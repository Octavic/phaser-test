// The piece definitions
const pieceDefinitions = {
  [PieceTypes.Square]: [
    /**
     *    0  1  2  3  4
     *   +--+--+--+--+--+
     * 0 |  |  |  |  |  |
     * 1 |  |██|██|  |  |
     * 2 |  |██|██|  |  |
     * 3 |  |  |  |  |  |
     * 4 |  |  |  |  |  |
     *   +--+--+--+--+--+
     */
  ]
}


/**
 * Class generating new pieces
 */
export default class PieceFactory {
  
}

export const PieceTypes = {
  Square: "Square", 
  Line: "Line",
  Z: "Z",
  S: "S",
  L: "L",
  J: "J",
  T: "T"
}

