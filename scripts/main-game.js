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

function randomTetrisPiece(startingPoint){
    let pieceOptions = [TetrisIPiece, TetrisLPiece, 
        TetrisJPiece, TetrisTPiece, TetrisOPiece, TetrisSPiece, TetrisZPiece]
    return new pieceOptions[Math.floor(Math.random() * pieceOptions.length)](startingPoint);
}

class GameLoop{
    constructor(scoreLabel, mainGrid, previewGrid, storageGrid){
        this._scoreLabel = scoreLabel;
        this._usedPointsAndColour = [];
        this._endGame = false;
        this._grid = mainGrid;
        this._previewGrid = previewGrid;
        this._gridHeight = this._grid.length;
        this._gridWidth =  (this._grid.length > 0 ? this._grid[0].length : 0);
        // NOTE: Index vs length (off by one)
        this._pieceStartPoint = new Point(Math.floor(this._gridWidth / 2)-1, 0)
        this._fallingPiece = randomTetrisPiece(this._pieceStartPoint);
        this._nextPiece = randomTetrisPiece(this._pieceStartPoint);
        this._storedPiece = null;
        this._storageGrid = storageGrid;
        this._paused = false;
        this._currentScore = 0;
        this._scoreIncrement = 10;
        // Event Listener
        document.addEventListener('keyup', event => {
            this.keyEventListener(event);
        });
    }
    
    updateScore(newScore){
        console.log(`Score updated to ${newScore}`);
        this._scoreLabel.textContent = newScore;
    }

    // ----------- Square Validity Checking ----------- 
    checkPieceCollisions(newPoints){
        // Compare current piece squares to all used
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
        var collision = this.checkPieceCollisions(piece.getTakenPoints(position));

        // Check if not a valid position or collision
        if(invalidPoints || collision){
            return false;
        }
        return true;
    }

    // ----------- Piece Movement ----------- 
    movePieceDown(piece){
        //TODO Investigate if used

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
    movePieceRotate(piece){
        // Check new usef points are valid
        let rotatePoints = piece.getRotatePoints();
        var invalidPoints = this.checkInvalidPoints(rotatePoints);
        var collision = this.checkPieceCollisions(rotatePoints);
        if(!invalidPoints && !collision){
            piece.rotate();
            this.redraw();
        }
    }

    // ----------- Game Logic ----------- 
    lockPiece(piece){
        // Add used points to list
        piece.setFalling(false);
        this._usedPointsAndColour = this._usedPointsAndColour.concat(piece.getTakenPointsAndColour());
        this._fallingPiece = null;
    }
    togglePaused(){
        this._paused = !this._paused;
    }
    // Check for Full
    checkRowIsFull(rowNumber = this._gridHeight-1){
        // NOTE: INDEX vs Length (off by one issue)
        
        //foreach row for new points added, are they complete? (if count >= width)
        var numOFUsedSquares = this._usedPointsAndColour.filter(pointColour => {
            return pointColour.position.y == rowNumber;
        }).length;
        console.log(`Row Number ${rowNumber} has ${numOFUsedSquares} used squares.`);

        if(numOFUsedSquares == this._gridWidth){
            // Remove all items in row
            this._usedPointsAndColour = this._usedPointsAndColour.filter(pointColour => {
                return pointColour.position.y != rowNumber;
            });

            // everything above this row needs to be shifted down
            this._usedPointsAndColour.forEach(pointColour => {
                if (pointColour.position.y < rowNumber){
                    pointColour.position.y++;
                };
            });
            return true;
        }
        return false;
    }
    update(){
        if(this._paused){
            return;
        }
        // IF no active piece or piece fails to move down create new piece
        //Move point down
        let newPoint = this._fallingPiece.getPosition();
        newPoint.y++;

        // If valid move
        if(this.checkValidPosition(newPoint, this._fallingPiece)){
            this._fallingPiece.updatePosition(newPoint, this._grid);
            
        }else{ // if invalid

            // Gather all affected rows
            var hash = {};
            this._fallingPiece.getTakenPoints().forEach(point => { 
                    hash[point.y] = true;
                });

            // Lock Piece
            this.lockPiece(this._fallingPiece);
            
            // Check all new used pieces for full rows
            for (const [rowNumber, _] of Object.entries(hash)) {
                console.log(`Checking Row Number: ${rowNumber}`);
                if(this.checkRowIsFull(rowNumber)){
                    this._currentScore+= this._scoreIncrement;
                }
            }

            // Get new piece
            this._fallingPiece = this._nextPiece;
            this._nextPiece = randomTetrisPiece(this._pieceStartPoint);
            
            // If new piece has collision then end game
            if(!this.checkValidPosition(this._fallingPiece.getPosition(), this._fallingPiece)){
                this._endGame = true;
                return;
            }
        }
    }
    storePiece(piece = this._fallingPiece){
        // Check for a currently stored piece and replace / evict elst just place
        let tmp = this._storedPiece == null ? randomTetrisPiece(this._pieceStartPoint) : this._storedPiece;
        
        this._storedPiece = this._fallingPiece;
        this._storedPiece.updatePosition(this._pieceStartPoint);

        this._fallingPiece = tmp;
    }

    // ----------- Drawing ----------- 
    redraw(){
        this.invalidate();
        this.draw();
    }

    draw(){
        this.updateScore(this._currentScore)
        // draw all Tetris Pieces
        let drawPoints = this._usedPointsAndColour.concat(this._fallingPiece.getTakenPointsAndColour()).flat();
        drawPoints.forEach(usedPointAndColour => {
            let usedPoint = usedPointAndColour.position;
            let square = this._grid[usedPoint.y][usedPoint.x];
            square.style.backgroundColor = usedPointAndColour.colour;
            square.classList.add("taken");
        })

        // draw preview grid
        this._nextPiece.getTakenPointsAndColour(new Point(1,0)).forEach(usedPointAndColour => {
            let usedPoint = usedPointAndColour.position;
            let square = this._previewGrid[usedPoint.y][usedPoint.x];
            square.style.backgroundColor = usedPointAndColour.colour;
            square.classList.add("taken");
        })
        if(this._storedPiece != null){
            this._storedPiece.getTakenPointsAndColour(new Point(1,0)).forEach(usedPointAndColour => {
                let usedPoint = usedPointAndColour.position;
                let square = this._storageGrid[usedPoint.y][usedPoint.x];
                square.style.backgroundColor = usedPointAndColour.colour;
                square.classList.add("taken");
            })
        }
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
        this._storageGrid.forEach(row => {
            row.forEach(square => {
                square.style.backgroundColor = "";
                square.classList.remove("taken");
            });
        });
    }

    // ----------- Game Control ----------- 
    startGame(){
        this.loop();
    }
    endGame(){
        this._endGame = true;
    }

    // ----------- Event Drivers ----------- 
    keyEventListener(event){
        const LEFT_KEY = 37, RIGHT_KEY = 39, UP_KEY = 38, DOWN_KEY = 40;
        const SPACE_KEY = 32, SHIFT_KEY = 16;
        const P_KEY = 80;

        // Control Flow Keys
        switch(event.keyCode)
        {
            case P_KEY:
                this.togglePaused();
                console.log("P key pressed. Pausing...");
                break;
            default:
                console.log(`Other key pressed ${event.keyCode}`);
                break;
        }
        if(this._paused){
            return;
        }
        //Movement Keys
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
            case SHIFT_KEY:
                this.storePiece(this._fallingPiece);
                console.log("Shift key pressed");
                break;
            default:
                console.log(`Other key pressed ${event.keyCode}`);
                break;
        }
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


}


function buildGrid(width, height, parent){
    //Build squares
    for(let i = 0; i < width * height; i++){
        parent.appendChild(document.createElement("div"));    
    }

    let squares = Array.from(parent.querySelectorAll("div"));
    let grid = [];
    //Split squares into a grid
    // NOTE: This is loaded into [y][x] order instead of x,y
    while(squares.length >= width){
        grid.push(squares.splice(0,width));
    }
    return grid;
}

document.addEventListener('DOMContentLoaded', () => {
    const width = 10;
    const height = 20;
    const secondaryWidth = 4;
    const secondaryHeight = 4;
    // Find Squares and Grid
    const mainGridParent = document.querySelector(".main-grid");
    const storageGridParent = document.querySelector(".storage-grid");
    const previewGridParent = document.querySelector(".preview-grid");

    let scoreLabel = document.querySelector("#current-score");    

    //Build squares
    let mainGrid = buildGrid(width, height, mainGridParent);
    let storageGrid = buildGrid(secondaryWidth, secondaryHeight, storageGridParent);
    let previewGrid = buildGrid(secondaryWidth, secondaryHeight, previewGridParent);

    console.log(`Main Grid width: ${width}.`);
    console.log(`Main Grid height: ${height}`);

    // Configure and Start the Game Loop
    // scoreLabel.textContent = 20;
    // var game = new GameLoop(scoreLabel, mainGrid, previewGrid, storageGrid);
    let startButton = document.querySelector("#start-button");
    var game = null;
    startButton.addEventListener('click', (event) => {
        console.log("Start Game button clicked. Starting Game.");
        // Remove the modal
        document.querySelector(".modal").classList.add("display-none");
        // Display Stop/Reset Buttons
        document.querySelector(".button-container").classList.remove("display-none");

        if (game == null){
            game = new GameLoop(scoreLabel, mainGrid, previewGrid, storageGrid);
            game.startGame();
        }
    })
    // Scoreboard button
    let scoreboardButton = document.querySelector("#scoreboard-button");
    scoreboardButton.addEventListener('click', (event) => {
        console.log("Scoreboard button clicked. Gathering scoreboard.");
        alert("This function has not been implemented yet.");
    })
    
    let resetButton = document.querySelector("#reset-button");
    resetButton.addEventListener('click', (event) => {
        console.log("Reset button clicked. Resetting the game.");
        if (game != null){
            game.endGame();
            game = null;
        }
        game = new GameLoop(scoreLabel, mainGrid, previewGrid, storageGrid);
        game.startGame();
    });

    let pauseButton = document.querySelector("#pause-button");
    pauseButton.addEventListener('click', (event) => {
        console.log("Pause button clicked. Toggling the game.");
        if (game != null) {
            game.togglePaused();
        }
    });

    // game.startGame();

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


});

