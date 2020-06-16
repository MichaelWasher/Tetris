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
    }
    updateScore(newScore){
        console.log(`Score updated to ${newScore}`);
        this._scoreLabel.textContent = newScore;
    }
    movePieces(tetrisPieces){   
        tetrisPieces.forEach(x => x.update());
    }
    invalidate(){
        this._tetrisPieces.forEach(x => x.invalidate(this._grid));
    }
    update(){
        
        let fallingPieces = this._tetrisPieces.filter(x => x.isFalling());

        if(fallingPieces.length > 0){
            fallingPieces.forEach(piece => {
                // IF A NEXT SQUARE IS TAKEN STOP
                if(piece.getNextSquares(this._grid).some(x => x.classList.contains('taken'))){
                    piece.stopFalling();
                }
            });
            this.movePieces(fallingPieces);
        }else{
            this._tetrisPieces.push(randomTetrisPiece())
        }
    }
    draw(){
        // Draw all Tetris Pieces
        this._tetrisPieces.forEach(x => x.draw(this._grid));
    }
    loop(){
        console.log("Tetris iteration triggered");
        this.invalidate()
        this.update();
        this.draw();
        var _this = this;
        if(!this._endGame){
            setTimeout(() => {
                    this.loop.call(this)
                }, 100); // TODO DEBUG, should be 1000
        }
    }
    startGame(){
        this.loop();
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