// TODO convert into module and inlcude other js files

'use strict'; 

function Point(x,y){
    this.x = x;
    this.y = y;
}

function randomTetrisPiece(){
    let pieceOptions = [TetrisIPiece, TetrisLPiece, 
        TetrisJPiece, TetrisTPiece, TetrisOPiece, TetrisSPiece, TetrisZPiece]
    return new pieceOptions[Math.floor(Math.random() * pieceOptions.length)];
}

class GameLoop{
    constructor(scoreLabel, grid){
        this._scoreLabel = scoreLabel;
        this._tetrisPieces = [];
        this._endGame = false;
        this._grid = grid;
        this._fallingPiece = null;
        this._gridHeight = this._grid.length;
        this._gridWidth =  (this._grid.length > 0 ? this._grid[0].length : 0);
    }
    updateScore(newScore){
        console.log(`Score updated to ${newScore}`);
        this._scoreLabel.textContent = newScore;
    }
    invalidate(){
        this._grid.forEach(row => {
            row.forEach(square => {
            square.style.backgroundColor = "";
            square.classList.remove("taken");
        });
    });
    }
    update(){
        // let fallingPieces = this._tetrisPieces.filter(x => x.isFalling());
        if(this._fallingPiece && this._fallingPiece.isFalling()){
            this.movePieceDown(this._fallingPiece);
        }else{
            this._fallingPiece = randomTetrisPiece();
            this._tetrisPieces.push(this._fallingPiece)
        }
    }
    checkPieceCollisions(piece){
        let squares = piece.getNextSquares(this._grid);
        return squares.some(x => x.classList.contains('taken'));
    }

    checkValidPosition(position, piece){
        let width = piece.getWidth();
        let height = piece.getHeight();
        // Check edges
        if(position.x < 0 || position.x + width > this._gridWidth){
            return false;
        }
        if(position.y < 0 || position.y + height > this._gridHeight){
            return false;
        }
        // Check other pieces
        piece.invalidate(this._grid);
        if(this.checkPieceCollisions(piece)){
            return false;
        }
        piece.draw(this._grid);
        return true;
    }
    
    
    draw(){
        // Draw all Tetris Pieces
        this._tetrisPieces.forEach(x => x.draw(this._grid));
    }
    loop(){
        // console.log("Tetris iteration triggered");
        this.update();
        this.invalidate()
        this.draw();
        var _this = this;
        if(!this._endGame){
            setTimeout(() => {
                    this.loop.call(this)
                }, 100); // TODO DEBUG, should be 1000
        }
    }
    movePieceDown(piece){
        let newPoint = piece.getCurrentPosition();
        newPoint.y++;
        if(!this.checkValidPosition(newPoint, piece)){
            piece.setFalling(false);
            return false;
        }
        if(piece.isFalling()){
            piece.updatePosition(newPoint, this._grid);
        }
    }
    movePieceRight(piece){
        let newPoint = piece.getCurrentPosition();
        newPoint.x++;
        if(this.checkValidPosition(newPoint, piece)){
            piece.updatePosition(newPoint, this._grid);
        }
    }
    movePieceLeft(piece){
        let newPoint = piece.getCurrentPosition();
        newPoint.x--;
        if(this.checkValidPosition(newPoint, piece)){
            piece.updatePosition(newPoint, this._grid);
        }
    }
    startGame(){
        this.loop();
    }
    keyEventListener(event){
        let LEFT_KEY = 37, RIGHT_KEY = 39, UP_KEY = 38, DOWN_KEY = 40;
        switch(event.keyCode)
        {
            case LEFT_KEY:
                this.movePieceLeft(this._fallingPiece);
                console.log("Right key pressed");
                break;
            case RIGHT_KEY:
                this.movePieceRight(this._fallingPiece);
                console.log("Left key pressed");
                break;
            case UP_KEY:
                this._fallingPiece.rotate();
                console.log("Up key pressed");    
                break;
            case DOWN_KEY:
                console.log("Down key pressed");
                break;
            default:
                console.log("Other key pressed");
                break;
        }
    }

    
    rightKeyPress(){
        
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const width = 10;
    const height = 20;
    // Find Squares and Grid
    const gameGrid = document.querySelector(".main-grid");
    let scoreLabel = document.querySelector("#current-score");
    let squares = Array.from(document.querySelectorAll(".main-grid div"));
    let grid = [];
    //Split squares into a grid
    // NOTE: This is loaded into [y][x] order instead of x,y
    while(squares.length >= width){
        grid.push(squares.splice(0,width));
    }

    console.log(`Found Grid ${squares.length} squares in the grid.`)
    console.log(`Grid populated with ${grid.length} rows`);


    // Configure and Start the Game Loop
    // scoreLabel.textContent = 20;
    var game = new GameLoop(scoreLabel, grid);

    game.startGame();
    document.addEventListener('keyup', event => {
        game.keyEventListener(event);
    });
    // // Test Game UI
    // let testPieces = [
    //     new TetrisTPiece(new Point(0,0)),
    //     new TetrisSPiece(new Point(3,0)),
    //     new TetrisZPiece(new Point(6,0)), 
    //     new TetrisIPiece(new Point(0,5)), 
    //     new TetrisOPiece(new Point(3,5)),
    //     new TetrisJPiece(new Point(6,5)),
    //     new TetrisLPiece(new Point(0,10))
    // ]
    // testPieces.forEach(piece => piece.draw(grid));
    // Test Update Score
    game.updateScore(20);

})