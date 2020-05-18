"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OthelloGame = exports.Othello = exports.OthelloBoard = exports.OthelloDirection = exports.OthelloPiece = void 0;
const jquery_1 = __importDefault(require("jquery"));
var OthelloPiece;
(function (OthelloPiece) {
    OthelloPiece[OthelloPiece["EMPTY"] = 0] = "EMPTY";
    OthelloPiece[OthelloPiece["BLACK"] = 1] = "BLACK";
    OthelloPiece[OthelloPiece["WHITE"] = 2] = "WHITE";
    OthelloPiece[OthelloPiece["WALL"] = 3] = "WALL";
    OthelloPiece[OthelloPiece["INVALID"] = 4] = "INVALID";
})(OthelloPiece = exports.OthelloPiece || (exports.OthelloPiece = {}));
var OthelloDirection;
(function (OthelloDirection) {
    OthelloDirection[OthelloDirection["UPPER"] = 0] = "UPPER";
    OthelloDirection[OthelloDirection["UPPER_RIGHT"] = 1] = "UPPER_RIGHT";
    OthelloDirection[OthelloDirection["RIGHT"] = 2] = "RIGHT";
    OthelloDirection[OthelloDirection["LOWER_RIGHT"] = 3] = "LOWER_RIGHT";
    OthelloDirection[OthelloDirection["LOWER"] = 4] = "LOWER";
    OthelloDirection[OthelloDirection["LOWER_LEFT"] = 5] = "LOWER_LEFT";
    OthelloDirection[OthelloDirection["LEFT"] = 6] = "LEFT";
    OthelloDirection[OthelloDirection["UPPER_LEFT"] = 7] = "UPPER_LEFT";
})(OthelloDirection = exports.OthelloDirection || (exports.OthelloDirection = {}));
class OthelloBoard {
    constructor() {
        this.size = 8;
        this.board = new Array();
        for (let x = 0; x < this.size + 2; ++x) {
            this.board.push(new Array(this.size + 2));
        }
        for (let x = 0; x < this.size + 2; ++x) {
            this.board[x][0] = OthelloPiece.WALL;
            this.board[x][this.size + 1] = OthelloPiece.WALL;
        }
        for (let y = 0; y < this.size + 2; ++y) {
            this.board[0][y] = OthelloPiece.WALL;
            this.board[this.size + 1][y] = OthelloPiece.WALL;
        }
        for (let x = 1; x <= this.size; ++x) {
            for (let y = 1; y <= this.size; ++y) {
                this.board[x][y] = OthelloPiece.EMPTY;
            }
        }
        this.board[4][4] = OthelloPiece.WHITE;
        this.board[4][5] = OthelloPiece.BLACK;
        this.board[5][4] = OthelloPiece.BLACK;
        this.board[5][5] = OthelloPiece.WHITE;
    }
    checkCoord(x, y) {
        return (0 <= x && x < this.size + 2 && 0 <= y && y <= this.size + 2);
    }
    isEmpty(x, y) {
        return this.checkCoord(x, y) && this.board[x][y] == OthelloPiece.EMPTY;
    }
    getAvailableCoords(piece) {
        const ret = new Array();
        for (let x = 1; x < this.size; ++x) {
            for (let y = 1; y < this.size; ++y) {
                if (this.canPlace(piece, x, y))
                    ret.push({ x: x, y: y });
            }
        }
        return ret;
    }
    place(piece, x, y) {
        if (!this.checkCoord(x, y))
            return null;
        if (!this.isEmpty(x, y))
            return null;
        console.log("place -> " + x + ":" + y + "*" + piece);
        if (!(piece == OthelloPiece.BLACK || piece == OthelloPiece.WHITE))
            return null;
        if (!this.canPlace(piece, x, y))
            return null;
        const newBoard = this.clone();
        const enemy = piece == OthelloPiece.BLACK ? OthelloPiece.WHITE : OthelloPiece.BLACK;
        const upper = newBoard.check(piece, x, y, OthelloDirection.UPPER);
        const upper_right = newBoard.check(piece, x, y, OthelloDirection.UPPER_RIGHT);
        const right = newBoard.check(piece, x, y, OthelloDirection.RIGHT);
        const lower_right = newBoard.check(piece, x, y, OthelloDirection.LOWER_RIGHT);
        const lower = newBoard.check(piece, x, y, OthelloDirection.LOWER);
        const lower_left = newBoard.check(piece, x, y, OthelloDirection.LOWER_LEFT);
        const left = newBoard.check(piece, x, y, OthelloDirection.LEFT);
        const upper_left = newBoard.check(piece, x, y, OthelloDirection.UPPER_LEFT);
        for (let i = 1; i <= upper; ++i)
            newBoard.board[x][y - i] = piece;
        for (let i = 1; i <= upper_right; ++i)
            newBoard.board[x + i][y - i] = piece;
        for (let i = 1; i <= right; ++i)
            newBoard.board[x + i][y] = piece;
        for (let i = 1; i <= lower_right; ++i)
            newBoard.board[x + i][y + i] = piece;
        for (let i = 1; i <= lower; ++i)
            newBoard.board[x][y + i] = piece;
        for (let i = 1; i <= lower_left; ++i)
            newBoard.board[x - i][y + i] = piece;
        for (let i = 1; i <= left; ++i)
            newBoard.board[x - i][y] = piece;
        for (let i = 1; i <= upper_left; ++i)
            newBoard.board[x - i][y - i] = piece;
        newBoard.board[x][y] = piece;
        return newBoard;
    }
    canPlace(piece, x, y) {
        if (!this.checkCoord(x, y))
            return false;
        if (!this.isEmpty(x, y))
            return false;
        if (!(piece == OthelloPiece.BLACK || piece == OthelloPiece.WHITE))
            return false;
        return (this.check(piece, x, y, OthelloDirection.UPPER) > 0)
            || (this.check(piece, x, y, OthelloDirection.UPPER_LEFT) > 0)
            || (this.check(piece, x, y, OthelloDirection.LEFT) > 0)
            || (this.check(piece, x, y, OthelloDirection.LOWER_LEFT) > 0)
            || (this.check(piece, x, y, OthelloDirection.LOWER) > 0)
            || (this.check(piece, x, y, OthelloDirection.LOWER_RIGHT) > 0)
            || (this.check(piece, x, y, OthelloDirection.RIGHT) > 0)
            || (this.check(piece, x, y, OthelloDirection.UPPER_RIGHT) > 0);
    }
    check(piece, x, y, direction) {
        if (!this.checkCoord(x, y))
            return -1;
        if (!this.isEmpty(x, y))
            return -1;
        if (!(piece == OthelloPiece.BLACK || piece == OthelloPiece.WHITE))
            return -1;
        const enemy = piece == OthelloPiece.BLACK ? OthelloPiece.WHITE : OthelloPiece.BLACK;
        const xd = (direction == OthelloDirection.UPPER_LEFT || direction == OthelloDirection.LEFT || direction == OthelloDirection.LOWER_LEFT) ? -1 :
            (direction == OthelloDirection.UPPER_RIGHT || direction == OthelloDirection.RIGHT || direction == OthelloDirection.LOWER_RIGHT) ? 1 : 0;
        const yd = (direction == OthelloDirection.UPPER_LEFT || direction == OthelloDirection.UPPER || direction == OthelloDirection.UPPER_RIGHT) ? -1 :
            (direction == OthelloDirection.LOWER_LEFT || direction == OthelloDirection.LOWER || direction == OthelloDirection.LOWER_RIGHT) ? 1 : 0;
        let x2 = xd;
        let y2 = yd;
        if (this.board[x + x2][y + y2] != enemy)
            return -1;
        let count = 0;
        while (this.board[x + x2][y + y2] == enemy) {
            x2 += xd;
            y2 += yd;
            ++count;
        }
        if (this.board[x + x2][y + y2] != piece)
            return -1;
        return count;
    }
    clone() {
        const ret = new OthelloBoard();
        for (let x = 0; x < this.size + 2; ++x) {
            for (let y = 0; y < this.size + 2; ++y) {
                ret.board[x][y] = this.board[x][y];
            }
        }
        return ret;
    }
    getPiece(x, y) {
        return this.checkCoord(x, y) ? this.board[x][y] : OthelloPiece.INVALID;
    }
}
exports.OthelloBoard = OthelloBoard;
class Othello {
    constructor() {
        this.turn = 0;
        this.board = new OthelloBoard();
        this.nowPlayer = OthelloPiece.BLACK;
    }
    place(x, y) {
        const nextBoard = this.board.place(this.nowPlayer, x, y);
        if (nextBoard) {
            this.board = nextBoard;
            ++this.turn;
            this.nowPlayer = this.nowPlayer == OthelloPiece.BLACK ? OthelloPiece.WHITE : OthelloPiece.BLACK;
            return true;
        }
        else
            return false;
    }
    getAvailableCoords() {
        return this.board.getAvailableCoords(this.nowPlayer);
    }
    getBoard() {
        return this.board;
    }
    getNowPlayer() {
        return this.nowPlayer;
    }
}
exports.Othello = Othello;
class OthelloGame {
    constructor(socket) {
        this.othello = new Othello();
        this.socket = socket;
        this.placeSound = new Audio('./sounds/place.mp3');
        this.errorSound = new Audio('./sounds/error.mp3');
        jquery_1.default('.square').on('click', (e) => {
            const id = jquery_1.default(e.target).find('.stone').attr('id');
            console.log(id);
            if (!id)
                return;
            const coord = this.convertIDtoCoord(id);
            const succeeded = this.othello.place(coord.x, coord.y);
            if (succeeded) {
                this.placeSound.play();
                this.update();
            }
            else {
                this.errorSound.play();
            }
        });
        this.update();
    }
    convertIDtoCoord(id) {
        const coord = id.replace(/s/, '').split('');
        return { x: parseInt(coord[1]), y: parseInt(coord[0]) };
    }
    convertCoordToID(x, y) {
        return "#s" + y + "" + x;
    }
    update() {
        const board = this.othello.getBoard();
        for (let x = 1; x <= board.size; ++x) {
            for (let y = 1; y <= board.size; ++y) {
                const piece = board.getPiece(x, y);
                if (piece == OthelloPiece.BLACK) {
                    jquery_1.default(this.convertCoordToID(x, y)).css('transform', 'rotateY(0deg)');
                }
                else if (piece == OthelloPiece.WHITE) {
                    jquery_1.default(this.convertCoordToID(x, y)).css('transform', 'rotateY(180deg)');
                }
                jquery_1.default(this.convertCoordToID(x, y)).parent().removeClass('available');
            }
        }
        for (const coord of this.othello.getAvailableCoords()) {
            console.log(coord);
            jquery_1.default(this.convertCoordToID(coord.x, coord.y)).parent().addClass('available');
        }
    }
}
exports.OthelloGame = OthelloGame;
