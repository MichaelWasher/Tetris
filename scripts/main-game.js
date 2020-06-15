function Point(x,y){
    this.x = x;
    this.y = y;
}

// Abstract Class
class TetrisPiece{

    constructor(scoreLabel) {
        this.currentPosition = new Point(0,0);
        this.colour = "blue";
        // this.rotations = this.getRotations();
        this.currentRotation = 0;
    }
    
    rotate(){

    }
    backRotate(){

    }
    update(){
        if(this.falling == true){
            this.currentPosition.y++;
        }
    }
    draw(grid){
        // square.style.backgroundColor = this.colour;
        // square.classList.add("taken");
    }
    invalidate(grid){
        //Undraw 
        square = grid[this.currentPosition.x][this.currentPosition.y]
        square.style.backgroundColor = this.colour;
        square.classList.remove("taken");
    }
}
class TetrisLPiece extends TetrisPiece{
    constructor(){
        super();
        this._kernel = [
            new Point(0,0),
            new Point(0,1),
            new Point(0,2),
            new Point(1,2)
        ]
    }
    draw(grid){
        this._kernel.forEach(kernelPoint => {
            let xPoint = kernelPoint.x + this.currentPosition.x
            let yPoint = kernelPoint.y + this.currentPosition.y
            let square = grid[yPoint][xPoint];
            square.style.backgroundColor = this.colour;
            square.classList.add("taken");
        });
    }
}


class GameLoop{
    constructor(scoreLabel){
        this._scoreLabel = scoreLabel;
        this._tetrisPieces = [];

    }
    updateScore(newScore){
        console.log(`Score updated to ${newScore}`);
        this._scoreLabel.textContent = newScore;
    }
    movePieces(){
        this._tetrisPieces.forEach(x => x.update());
    }
    update(){
        this.movePieces();
    }
    draw(){
        // Draw all Tetris Pieces
        this._tetrisPieces.forEach(x => x.invalidate());
        this._tetrisPieces.forEach(x => x.draw());
    }
    startGame(){

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
    let game = new GameLoop(scoreLabel);

    // game.startGame();

    // Test Game UI
    let testPiece = new TetrisLPiece();
    testPiece.draw(grid);
    // Test Update Score
    game.updateScore(20);

})