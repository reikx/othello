import $ from 'jquery';

export enum OthelloPiece{
    EMPTY,BLACK,WHITE,WALL,INVALID
}

export enum OthelloDirection{
    UPPER,UPPER_RIGHT,RIGHT,LOWER_RIGHT,LOWER,LOWER_LEFT,LEFT,UPPER_LEFT
}

export class OthelloBoard{
    public readonly size:number = 8;
    private readonly board:Array<Array<OthelloPiece>>;
    constructor() {
        this.board = new Array<Array<OthelloPiece>>();

        for(let x:number = 0;x < this.size + 2;++x){
            this.board.push(new Array(this.size + 2));
        }

        for(let x:number = 0;x < this.size + 2;++x){
            this.board[x][0] = OthelloPiece.WALL;
            this.board[x][this.size + 1] = OthelloPiece.WALL;
        }
        for(let y:number = 0;y < this.size + 2;++y){
            this.board[0][y] = OthelloPiece.WALL;
            this.board[this.size + 1][y] = OthelloPiece.WALL;
        }
        for(let x = 1;x <= this.size;++x){
            for(let y = 1;y <= this.size;++y){
                this.board[x][y] = OthelloPiece.EMPTY;
            }
        }

        this.board[4][4] = OthelloPiece.WHITE;
        this.board[4][5] = OthelloPiece.BLACK;
        this.board[5][4] = OthelloPiece.BLACK;
        this.board[5][5] = OthelloPiece.WHITE;
    }

    public isEnded():boolean{
        return this.getAvailableCoords(OthelloPiece.BLACK).length == 0 && this.getAvailableCoords(OthelloPiece.WHITE).length == 0;
    }

    private checkCoord(x:number,y:number):boolean{
        return (0 <= x && x < this.size + 2 && 0 <= y && y <= this.size + 2);
    }

    private isEmpty(x:number,y:number):boolean{
        return this.checkCoord(x,y) && this.board[x][y] == OthelloPiece.EMPTY;
    }

    public getAvailableCoords(piece:OthelloPiece):Array<{x:number,y:number}>{
        const ret:Array<{x:number,y:number}> = new Array<{x: number, y: number}>();
        for(let x = 1;x < this.size;++x){
            for(let y = 1;y < this.size;++y){
                if(this.canPlace(piece,x,y))ret.push({x:x,y:y});
            }
        }
        return ret;
    }

    public place(piece:OthelloPiece,x:number,y:number):OthelloBoard | null{
        if(!this.checkCoord(x,y))return null;
        if(!this.isEmpty(x,y))return null;
        console.log("place -> " + x + ":" + y + "*" + piece);
        if(!(piece == OthelloPiece.BLACK || piece == OthelloPiece.WHITE))return null;
        if(!this.canPlace(piece,x,y))return null;
        const newBoard:OthelloBoard = this.clone();
        const enemy:OthelloPiece = piece == OthelloPiece.BLACK ? OthelloPiece.WHITE : OthelloPiece.BLACK;

        const upper = newBoard.check(piece,x,y,OthelloDirection.UPPER);
        const upper_right = newBoard.check(piece,x,y,OthelloDirection.UPPER_RIGHT);
        const right = newBoard.check(piece,x,y,OthelloDirection.RIGHT);
        const lower_right = newBoard.check(piece,x,y,OthelloDirection.LOWER_RIGHT);
        const lower = newBoard.check(piece,x,y,OthelloDirection.LOWER);
        const lower_left = newBoard.check(piece,x,y,OthelloDirection.LOWER_LEFT);
        const left = newBoard.check(piece,x,y,OthelloDirection.LEFT);
        const upper_left = newBoard.check(piece,x,y,OthelloDirection.UPPER_LEFT);

        for(let i = 1;i <= upper;++i)newBoard.board[x][y - i] = piece;
        for(let i = 1;i <= upper_right;++i)newBoard.board[x + i][y - i] = piece;
        for(let i = 1;i <= right;++i)newBoard.board[x + i][y] = piece;
        for(let i = 1;i <= lower_right;++i)newBoard.board[x + i][y + i] = piece;
        for(let i = 1;i <= lower;++i)newBoard.board[x][y + i] = piece;
        for(let i = 1;i <= lower_left;++i)newBoard.board[x - i][y + i] = piece;
        for(let i = 1;i <= left;++i)newBoard.board[x - i][y] = piece;
        for(let i = 1;i <= upper_left;++i)newBoard.board[x - i][y - i] = piece;
        newBoard.board[x][y] = piece;

        return newBoard;
    }

    public canPlace(piece:OthelloPiece,x:number,y:number):boolean{
        if(!this.checkCoord(x,y))return false;
        if(!this.isEmpty(x,y))return false;
        if(!(piece == OthelloPiece.BLACK || piece == OthelloPiece.WHITE))return false;
        return (this.check(piece,x,y,OthelloDirection.UPPER) > 0)
            || (this.check(piece,x,y,OthelloDirection.UPPER_LEFT) > 0)
            || (this.check(piece,x,y,OthelloDirection.LEFT) > 0)
            || (this.check(piece,x,y,OthelloDirection.LOWER_LEFT) > 0)
            || (this.check(piece,x,y,OthelloDirection.LOWER) > 0)
            || (this.check(piece,x,y,OthelloDirection.LOWER_RIGHT) > 0)
            || (this.check(piece,x,y,OthelloDirection.RIGHT) > 0)
            || (this.check(piece,x,y,OthelloDirection.UPPER_RIGHT) > 0);
    }

    private check(piece:OthelloPiece,x:number,y:number,direction:OthelloDirection):number{
        if(!this.checkCoord(x,y))return -1;
        if(!this.isEmpty(x,y))return -1;
        if(!(piece == OthelloPiece.BLACK || piece == OthelloPiece.WHITE))return -1;
        const enemy:OthelloPiece = piece == OthelloPiece.BLACK ? OthelloPiece.WHITE : OthelloPiece.BLACK;

        const xd = (direction == OthelloDirection.UPPER_LEFT || direction == OthelloDirection.LEFT || direction == OthelloDirection.LOWER_LEFT) ? -1 :
            (direction == OthelloDirection.UPPER_RIGHT || direction == OthelloDirection.RIGHT || direction == OthelloDirection.LOWER_RIGHT) ? 1 : 0;
        const yd = (direction == OthelloDirection.UPPER_LEFT || direction == OthelloDirection.UPPER || direction == OthelloDirection.UPPER_RIGHT) ? -1 :
            (direction == OthelloDirection.LOWER_LEFT || direction == OthelloDirection.LOWER || direction == OthelloDirection.LOWER_RIGHT) ? 1 : 0;
        let x2 = xd;
        let y2 = yd;

        if(this.board[x + x2][y + y2] != enemy)return -1;
        let count = 0;
        while (this.board[x + x2][y + y2] == enemy){
            x2 += xd;
            y2 += yd;
            ++count;
        }
        if(this.board[x + x2][y + y2] != piece)return -1;
        return count;
    }

    public clone():OthelloBoard{
        const ret = new OthelloBoard();
        for(let x = 0;x < this.size + 2;++x){
            for(let y = 0;y < this.size + 2;++y){
                ret.board[x][y] = this.board[x][y];
            }
        }
        return ret;
    }

    public getPiece(x:number,y:number):OthelloPiece{
        return this.checkCoord(x,y) ? this.board[x][y] : OthelloPiece.INVALID;
    }
}

export class Othello{
    private board:OthelloBoard;
    private nowPlayer:OthelloPiece;
    private turn:number = 0;

    constructor() {
        this.board = new OthelloBoard();
        this.nowPlayer = OthelloPiece.BLACK;
    }

    public place(x:number,y:number):boolean{
        const nextBoard:OthelloBoard | null = this.board.place(this.nowPlayer,x,y);
        if(nextBoard){
            this.board = nextBoard;
            ++this.turn;
            this.nowPlayer = this.nowPlayer == OthelloPiece.BLACK ? OthelloPiece.WHITE : OthelloPiece.BLACK;
            return true;
        }
        else return false;
    }

    public getAvailableCoords():Array<{x:number,y:number}>{
        return this.board.getAvailableCoords(this.nowPlayer);
    }

    public getBoard():OthelloBoard{
        return this.board;
    }

    public getNowPlayer():OthelloPiece{
        return this.nowPlayer;
    }

    public pass():void{
        if(this.board.getAvailableCoords(this.nowPlayer).length == 0){
            ++this.turn;
            this.nowPlayer = this.nowPlayer == OthelloPiece.BLACK ? OthelloPiece.WHITE : OthelloPiece.BLACK;
        }
    }
}

export class OthelloGame{
    private readonly othello:Othello;
    private readonly socket:SocketIOClient.Socket | null;
    private readonly placeSound:HTMLAudioElement;
    private readonly errorSound:HTMLAudioElement;
    constructor(socket:SocketIOClient.Socket | null) {
        this.othello = new Othello();
        this.socket = socket;
        this.placeSound = new Audio('./sounds/place.mp3');
        this.errorSound = new Audio('./sounds/error.mp3');
        $('.square').on('click',(e) => {
            const id = $(e.target).find('.stone').attr('id');
            console.log(id);
            if(!id)return;
            const coord = this.convertIDtoCoord(id);
            const succeeded:boolean = this.othello.place(coord.x,coord.y);
            if(succeeded){
                this.placeSound.play();
                this.update();
            }
            else{
                this.errorSound.play();
            }
        });
        this.update();
    }

    private convertIDtoCoord(id:string):{x:number,y:number}{
        const coord = id.replace(/s/, '').split('');
        return {x:parseInt(coord[1]),y:parseInt(coord[0])};
    }

    private convertCoordToID(x:number,y:number):string{
        return "#s" + y + "" + x;
    }

    private update():void{
        const board:OthelloBoard = this.othello.getBoard();
        for(let x = 1;x <= board.size;++x){
            for(let y = 1;y <= board.size;++y){
                const piece:OthelloPiece = board.getPiece(x,y);
                if(piece == OthelloPiece.BLACK){

                    $(this.convertCoordToID(x,y)).css('transform','rotateY(0deg)');
                }
                else if(piece == OthelloPiece.WHITE){
                    $(this.convertCoordToID(x,y)).css('transform','rotateY(180deg)');
                }
                $(this.convertCoordToID(x,y)).parent().removeClass('available');
            }
        }
        for(const coord of this.othello.getAvailableCoords()){
            console.log(coord);
            $(this.convertCoordToID(coord.x,coord.y)).parent().addClass('available');
        }
    }
}