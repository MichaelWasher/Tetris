// TODO convert into module and inlcude other js files
// TODO Check for Fill Row

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
    constructor(scoreLabel, mainGrid, previewGrid){
        this._scoreLabel = scoreLabel;
        this._usedPointsAndColour = [];
        this._endGame = false;
        this._grid = mainGrid;
        this._previewGrid = previewGrid;
        this._fallingPiece = randomTetrisPiece();
        this._nextPiece = randomTetrisPiece();
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
        this._previewGrid.forEach(row => {
            row.forEach(square => {
                square.style.backgroundColor = "";
                square.classList.remove("taken");
            });
        });
    }
    checkPieceCollisions(nextPoint, piece){
        // Compare current piece squares to all used
        let newPoints = piece.getTakenPoints(nextPoint);
        let collisionPoints = this._usedPointsAndColour.map(pointAndColour => {
            return pointAndColour.position;
        });
        let collision = collisionPoints.some(usedPoint =>{
            return newPoints.some(newPoint => {
                if(newPoint.equals(usedPoint)){
                    return true;
                }
            })
        });

        return collision;

    }
    checkInvalidPoints(allPositions){
        var failedBoundaries = allPositions.some(position => {
            // NOTE: As piecewidths are not used, comparisons are between index 
            // and length (off by 1 issues)
            if(position.x < 0 || position.x > this._gridWidth-1){
                return true;
            }
            if(position.y < 0 || position.y > this._gridHeight-1){
                return true;
            }
            return false;
        });
        return failedBoundaries;
    }
    checkValidPosition(position, piece){      
        var invalidPoints = this.checkInvalidPoints(piece.getTakenPoints(position));
        // Check if not a valid position or collision
        if(invalidPoints || this.checkPieceCollisions(position, piece)){
            return false;
        }
        return true;
    }   
    redraw(){
        this.invalidate();
        this.draw();
    }
    movePieceDown(piece){
        let newPoint = piece.getPosition();
        newPoint.y++;
        if(!this.checkValidPosition(newPoint, piece)){
            piece.setFalling(false);
            return false;
        }
        piece.updatePosition(newPoint, this._grid);
        this.redraw()
        return true;
    }
    movePieceRight(piece){
        let newPoint = piece.getPosition();
        newPoint.x++;
        if(this.checkValidPosition(newPoint, piece)){
            piece.updatePosition(newPoint, this._grid);
            this.redraw()
        }
    }
    movePieceLeft(piece){
        let newPoint = piece.getPosition();
        newPoint.x--;
        if(this.checkValidPosition(newPoint, piece)){
            piece.updatePosition(newPoint, this._grid);
            this.redraw()
        }
    }
    movePieceDrop(piece){
        // Work out next drop piece
        let newPoint = piece.getPosition();
        while(this.checkValidPosition(newPoint, piece)){
            newPoint.y++;
        }
        newPoint.y--;
        piece.updatePosition(newPoint, this._grid);
        this.redraw()
    }
    lockPiece(piece){
        // Add used points to list
        piece.setFalling(false);
        this._usedPointsAndColour = this._usedPointsAndColour.concat(piece.getTakenPointsAndColour());
        this._fallingPiece = null;
    }
    movePieceRotate(piece){
        // Check new usef points are valid
        let rotatePoints = piece.getRotatePoints();
        if(!this.checkInvalidPoints(rotatePoints)){
            piece.rotate();
            this.redraw();
        }
    }
    update(){
        // IF no active piece or piece fails to move down create new piece
        //Move point down
        let newPoint = this._fallingPiece.getPosition();
        newPoint.y++;

        // If valid move
        if(this.checkValidPosition(newPoint, this._fallingPiece)){
            this._fallingPiece.updatePosition(newPoint, this._grid);
            
        }else{ // if invalid
            this.lockPiece(this._fallingPiece);
            this._fallingPiece = this._nextPiece;
            this._nextPiece = randomTetrisPiece();
            // If new piece has collision then end game
        
            if(!this.checkValidPosition(this._fallingPiece.getPosition(), this._fallingPiece)){
                this._endGame = true;
                return;
            }
        }
    }
    draw(){
        // draw all Tetris Pieces
        let drawPoints = this._usedPointsAndColour.concat(this._fallingPiece.getTakenPointsAndColour()).flat();
        drawPoints.forEach(usedPointAndColour => {
            let usedPoint = usedPointAndColour.position;
            let square = this._grid[usedPoint.y][usedPoint.x];
            square.style.backgroundColor = usedPointAndColour.colour;
            square.classList.add("taken");
        })

        // draw preview grid
        this._nextPiece.getTakenPointsAndColour().forEach(usedPointAndColour => {
            let usedPoint = usedPointAndColour.position;
            let square = this._previewGrid[usedPoint.y][usedPoint.x];
            square.style.backgroundColor = usedPointAndColour.colour;
            square.classList.add("taken");
        })
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
            this.invalidate();
            alert("Game Over");
        }
    }
    startGame(){
        this.loop();
    }
    endGame(){
        this._endGame = true;
    }
    keyEventListener(event){
        let LEFT_KEY = 37, RIGHT_KEY = 39, UP_KEY = 38, DOWN_KEY = 40;
        let SPACE_KEY = 32;
        switch(event.keyCode)
        {
            case LEFT_KEY:
                this.movePieceLeft(this._fallingPiece);
                console.log("Left key pressed");
                break;
            case RIGHT_KEY:
                this.movePieceRight(this._fallingPiece);
                console.log("Right key pressed");
                break;
            case UP_KEY:
                this.movePieceRotate(this._fallingPiece);
                console.log("Up key pressed");
                break;
            case SPACE_KEY:
                this.movePieceDrop(this._fallingPiece);
                console.log("Space key pressed");
                break;
            default:
                console.log(`Other key pressed ${event.keyCode}`);
                break;
        }
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const width = 10;
    const height = 20;
    const previewWidth = 4;
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

    // Load Preview Grid
    squares = Array.from(document.querySelectorAll(".preview-grid div"));
    let previewGrid = [];
    while(squares.length >= previewWidth ){
        previewGrid.push(squares.splice(0,previewWidth ));
    }

    // Configure and Start the Game Loop
    // scoreLabel.textContent = 20;
    var game = new GameLoop(scoreLabel, grid, previewGrid);
    // let startButton = document.querySelector("#start-button");
    // var game = null;
    // startButton.addEventListener('click', (event) => {
    //     if (game == null){
    //         game = new GameLoop(scoreLabel, grid);
    //         game.startGame();
    //     }
    // })
     
    // let stopButton = document.querySelector("#reset-button");
    // stopButton.addEventListener('click', (event) => {
    //     if (game != null){
    //         game.endGame();
    //         game = null;
    //     }
    // })
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
    // game.updateScore(20);

})