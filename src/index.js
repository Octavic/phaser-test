import Phaser from 'phaser';
import SmallTetrisPieceDisplay from './phaser/SmallTetrisPieceDisplay';
import { TetrisGame } from './tetrisGame/TetrisGame';
import { Vector2 } from './tetrisGame/Vector2';

const defaultGridColor = 0xdedede;
const backgroundColor = 0x141936;

// Game settings
const gameBoardSizeX = 10;
const gameBoardSizeY = 20;
const pieceDropInterval = 500;

// Holding piece sizing
const holdingPieceDisplayPosX = 210;
const holdingPieceDisplayPosY = 60;
const holdingPieceDisplaySize = 15;
const holdingPieceDisplaySpacing = 2;

// Main Grid sizing
const gridSize = 23;
const gridSpacing = 3;
const gridStartX = 300;
const gridStartY = 10;

// Piece bag sizing
const pieceBagDisplayPosX = 560;
const pieceBagDisplayPosY = 60;
const pieceBagDisplaySpacing = 65;
const pieceBagDisplayGridSize = 15;
const pieceBagDisplayGridSpacing = 2;

function getRectangleCoordinate(x, y) {
    const posX = gridStartX + x * (gridSize + gridSpacing);
    const posY = gridStartY + (gameBoardSizeY - y) * (gridSize + gridSpacing);

    return { posX, posY };
}

class MyGame extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
    }

    create() {
        this.tetrisGame = new TetrisGame(gameBoardSizeX, gameBoardSizeY, new Vector2(2, 15), 5);

        // Generate tiles
        for (let y = 0; y < gameBoardSizeY; y++) {
            for (let x = 0; x < gameBoardSizeX; x++) {
                const { posX, posY } = getRectangleCoordinate(x, y)
                this.add.rectangle(posX, posY, gridSize, gridSize, defaultGridColor)
            }
        }

        // Set timer
        this.dropTimeLeft = pieceDropInterval;

        // Read key input
        this.input.keyboard.on("keydown-A", () => { this.tetrisGame.tryMoveActivePiece(false) })
        this.input.keyboard.on("keydown-D", () => { this.tetrisGame.tryMoveActivePiece(true) })
        this.input.keyboard.on("keydown-J", () => { this.tetrisGame.tryRotatePiece(false) })
        this.input.keyboard.on("keydown-K", () => { this.tetrisGame.tryRotatePiece(true) })
        this.input.keyboard.on("keydown-L", () => { this.tetrisGame.trySwitchHolding() })
        this.input.keyboard.on("keydown-SPACE", () => { this.tetrisGame.tryHardDrop() })

        // Add holding piece and piece bag display
        this.holdingPieceDisplay = new SmallTetrisPieceDisplay(holdingPieceDisplayPosX, holdingPieceDisplayPosY, backgroundColor, holdingPieceDisplaySize, holdingPieceDisplaySpacing);
        this.pieceBagDisplay = [];
        for (let i = 0; i < this.tetrisGame.bagSize; i++) {
            this.pieceBagDisplay.push(new SmallTetrisPieceDisplay(
                pieceBagDisplayPosX,
                pieceBagDisplayPosY + i * pieceBagDisplaySpacing,
                backgroundColor,
                pieceBagDisplayGridSize,
                pieceBagDisplayGridSpacing
            ))
        }

        // Add instructions
        this.add.text(150, 550, "Movement: A/D      Rotate: J/K      Hold: L", {
            fontSize: "20px"
        })
    }

    update(time, delta) {
        // Redraw grid
        for (let y = 0; y < gameBoardSizeY; y++) {
            for (let x = 0; x < gameBoardSizeX; x++) {
                var color = this.tetrisGame.boardState[y][x] || defaultGridColor
                const { posX, posY } = getRectangleCoordinate(x, y)
                this.add.rectangle(posX, posY, gridSize, gridSize, color)
            }
        }

        // Set the active pieces
        for (let coordinate of this.tetrisGame.activePiece.getOccupiedCoordinates()) {
            const color = this.tetrisGame.activePiece.pieceColor;
            const { posX, posY } = getRectangleCoordinate(coordinate.x, coordinate.y)
            this.add.rectangle(posX, posY, gridSize, gridSize, color)
        }

        // Set the active piece phantom
        for (let coordinate of this.tetrisGame.activePiecePhantom.getOccupiedCoordinates()) {
            const color = this.tetrisGame.activePiecePhantom.pieceColor;
            const { posX, posY } = getRectangleCoordinate(coordinate.x, coordinate.y)
            this.add.rectangle(posX, posY, gridSize, gridSize, color, 0.5)
        }

        // Drop pieces
        if (this.dropTimeLeft <= 0) {
            this.dropTimeLeft = pieceDropInterval;

            if (this.tetrisGame.tryLowerActivePiece()) {
                return;
            } else {
                this.tetrisGame.onCommitPlaceActivePiece();
            }
        } else {
            this.dropTimeLeft -= delta
        }

        // Update the held piece and piece bags
        this.holdingPieceDisplay.redraw(this.tetrisGame.holdingPiece, this);
        for (let i = 0; i < this.tetrisGame.bagSize; i++) {
            this.pieceBagDisplay[i].redraw(this.tetrisGame.bagPieces[i], this)
        }
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: backgroundColor,
    scene: MyGame
};

const game = new Phaser.Game(config);
