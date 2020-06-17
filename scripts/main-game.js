// TODO convert into module and inlcude other js files

'use strict'; 

class Point{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    add(x,y){
        this.x += x;
        this.y += y;
    }
    equals(point){
        if(point.x == this.x && point.y == this.y){
            return true;
        }
        return false;
    }
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

        // Event Listener
        document.addEventListener('keyup', event => {
            this.keyEventListener(event);
        });
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
    checkPieceCollisions(nextPoint, piece){
        let newPoints = piece.getTakenPoints(nextPoint);

        // Ignore current squares
        let collisionPoints = this._tetrisPieces.map(piece => { 
            if (!piece.getFalling()) 
                return piece.getTakenPoints()
            }).flat().filter(x => { 
                return (x != null && x != undefined) 
            });
        
        //TODO Filter Unique Points
        // collisionPoints = new Set(collisionPoints);

        let collision = collisionPoints.some(usedPoint =>{
            return newPoints.some(newPoint => {
                if(newPoint.equals(usedPoint)){
                    return true;
                }
            })
        });

        return collision;

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
        if(this.checkPieceCollisions(position, piece)){
            return false;
        }
        return true;
    }   
    movePieceDown(piece){
        let newPoint = piece.getPosition();
        newPoint.y++;
        if(!this.checkValidPosition(newPoint, piece)){
            piece.setFalling(false);
            return false;
        }
        piece.updatePosition(newPoint, this._grid);
        return true;
    }
    movePieceRight(piece){
        let newPoint = piece.getPosition();
        newPoint.x++;
        if(this.checkValidPosition(newPoint, piece)){
            piece.updatePosition(newPoint, this._grid);
        }
    }
    movePieceLeft(piece){
        let newPoint = piece.getPosition();
        newPoint.x--;
        if(this.checkValidPosition(newPoint, piece)){
            piece.updatePosition(newPoint, this._grid);
        }
    }
    update(){
        // IF no active piece or piece fails to move down create new piece
        if(this._fallingPiece == null || !this.movePieceDown(this._fallingPiece)){
            this._fallingPiece = randomTetrisPiece();
            // If new piece has collision then end game
            if(!this.checkValidPosition(this._fallingPiece.getPosition(), this._fallingPiece)){
                this._endGame = true;
                return;
            }
            this._tetrisPieces.push(this._fallingPiece);
        }
    }
    draw(){
        // Draw all Tetris Pieces
        this._tetrisPieces.forEach(x => x.draw(this._grid));
    }
    loop(){
        console.log("Tetris iteration triggered");
        this.invalidate();
        this.update();
        this.draw();
        if(!this._endGame){
            setTimeout(() => {
                    this.loop.call(this);
                }, 70); // TODO DEUB should be 1000. Setting for testing
        }else{
            this.endGame();
        }
    }
    startGame(){
        this.loop();
    }
    endGame(){
        this.invalidate();
        alert("Game Over");
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
            default:
                console.log("Other key pressed");
                break;
        }
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

    console.log(`Found Grid ${squares.length} squares in the grid.`);
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