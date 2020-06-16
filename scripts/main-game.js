// TODO convert into module and inlcude other js files

'use strict'; 

function Point(x,y){
    this.x = x;
    this.y = y;
}

function randomTetrisPiece(){
    return new TetrisIPiece();
}

class GameLoop{
    constructor(scoreLabel, grid){
        this._scoreLabel = scoreLabel;
        this._tetrisPieces = [];
        this._endGame = false;
        this._grid = grid;
        this._fallingPiece = null;
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
    movePieceDown(piece){
        let newPoint = piece.getPosition();
        newPoint.y++;
        piece.updatePosition(newPoint, this._grid);
    }
    update(){
        if(this._fallingPiece != null && this._fallingPiece.getFalling()){
            this.movePieceDown(this._fallingPiece);
        }else{
            this._fallingPiece = randomTetrisPiece();
            this._tetrisPieces.push(this._fallingPiece)
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
        if(!this._endGame){
            setTimeout(() => {
                    this.loop.call(this)
                }, 1000);
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
    
    //Build squares
    var div = document.createElement("div");
    for(let i = 0; i < width * height; i++){
        gameGrid.appendChild(document.createElement("div"));    
    }

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