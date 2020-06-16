

// Abstract Class
class TetrisPiece{

    constructor(
        currentPosition = new Point(0,0) 
    ) {
        console.log(`Created a new Tetris Piece at ${currentPosition}`);
        this._currentPosition = currentPosition;
        this._colour = this.getColour();
        this._rotations = this.getRotations();
        this._currentRotation = 0;
        this._totalRotations = 0;
        this._falling = true;
        this._kernel = this._rotations[0];
    }
    getColour(){
        return "blue";
    }
    rotate(grid){
        this.invalidate(grid);
        this._currentRotation++;
        this._currentRotation %= this._totalRotations; 
        this.draw(grid);
    }
    backRotate(grid){
        this.invalidate(grid);
        this._currentRotation--;
        this._currentRotation = Math.abs(this._currentRotation) % this._totalRotations;
        this.draw(grid);
    }

    getWidth(){
        let max_x = this._kernel.reduce((total, num) => { return Math.max(total, num.x)}, 0) +1;
        let min_x =this._kernel.reduce((total, num) => {return Math.min(total, num.x)}, max_x);
        return max_x - min_x;
    }

    getHeight(){
        let max_y = this._kernel.reduce((total, num) => { return Math.max(total, num.y)}, 0) +1;
        let min_y = this._kernel.reduce((total, num) => { return Math.min(total, num.y)}, max_y);
        return max_y - min_y;
    }
    getCurrentPosition(){
        return Object.assign({}, this._currentPosition);
    }
    getNextSquares(grid){
        let nextPosition = new Point(this._currentPosition.x, this._currentPosition.y+1);
        return this.getSquares(nextPosition, grid);
    }
    getSquares(position, grid){
        return this._kernel.map(kernelPoint => {
            let yPoint = kernelPoint.y + position.y
            let xPoint = kernelPoint.x + position.x
            return grid[yPoint][xPoint];
        })
    }
    isFalling(){
        return this._falling;
    }
    setFalling(newValue){
        this._falling = newValue;
    }
    updatePosition(newPoint, grid){
        this.invalidate(grid);
        this._currentPosition = newPoint;
        this.draw(grid);
    }
    draw(grid){
        this.getSquares(this._currentPosition, grid).forEach(square => {
            square.style.backgroundColor = this._colour;
            square.classList.add("taken");
        });
    }
    invalidate(grid){
        //Undraw 
        if(this._falling){
            this.getSquares(this._currentPosition, grid).forEach(square => {
                square.style.backgroundColor = "";
                square.classList.remove("taken");
            });
        }
    }
}
class TetrisLPiece extends TetrisPiece{
    getColour(){
        return "red";
    }
    getRotations()
    {
        return [
        [   new Point(0,0),
            new Point(0,1),
            new Point(0,2),
            new Point(1,2)
        ],[
            new Point(0,2),
            new Point(1,2),
            new Point(2,2),
            new Point(2,1)
        ],[
            new Point(1,0),
            new Point(2,0),
            new Point(2,1),
            new Point(2,2)
        ],[
            new Point(0,0),
            new Point(0,1),
            new Point(1,0),
            new Point(2,0)
        ]];
    }
}
class TetrisJPiece extends TetrisPiece{
    getColour(){
        return "blue";
    }
    getRotations()
    {
        return [
        [   new Point(0,2),
            new Point(1,0),
            new Point(1,1),
            new Point(1,2)
        ],[
            new Point(0,1),
            new Point(0,2),
            new Point(1,2),
            new Point(1,2)
        ],[
            new Point(0,0),
            new Point(0,1),
            new Point(0,2),
            new Point(1,0)
        ],[
            new Point(0,0),
            new Point(1,0),
            new Point(2,0),
            new Point(2,1)
        ]];
    }
}

class TetrisTPiece extends TetrisPiece{
    getColour(){
        return "orange";
    }
    getRotations()
    {
        return [
        [   new Point(0,0),
            new Point(0,1),
            new Point(0,2),
            new Point(1,1)
        ],[
            new Point(0,2),
            new Point(1,2),
            new Point(2,2),
            new Point(1,1)
        ],[
            new Point(3,0),
            new Point(3,1),
            new Point(3,2),
            new Point(2,1)
        ],[
            new Point(0,0),
            new Point(1,0),
            new Point(2,0),
            new Point(1,1)
        ]];
    }
}

class TetrisSPiece extends TetrisPiece{
    getColour(){
        return "black";
    }
    getRotations()
    {
        return [
        [   new Point(0,0),
            new Point(0,1),
            new Point(1,1),
            new Point(1,2)
        ],[
            new Point(0,1),
            new Point(1,1),
            new Point(1,0),
            new Point(2,0)
        ]];
    }
}
class TetrisZPiece extends TetrisPiece{
    getColour(){
        return "yellow";
    }
    getRotations()
    {
        return [
        [   new Point(0,1),
            new Point(0,2),
            new Point(1,0),
            new Point(1,1)
        ],[
            new Point(0,0),
            new Point(1,0),
            new Point(1,1),
            new Point(2,1)
        ]];
    }
}
class TetrisOPiece extends TetrisPiece{
    getColour(){
        return "blue";
    }
    getRotations()
    {
        return [
        [   new Point(0,0),
            new Point(0,1),
            new Point(1,0),
            new Point(1,1)
        ]];
    }
}
class TetrisIPiece extends TetrisPiece{
    getColour(){
        return "red";
    }
    getRotations()
    {
        return [
        [   new Point(0,0),
            new Point(0,1),
            new Point(0,2),
            new Point(0,3)
        ],[
            new Point(0,3),
            new Point(1,3),
            new Point(2,3),
            new Point(3,3)
        ],[
            new Point(3,0),
            new Point(3,1),
            new Point(3,2),
            new Point(3,3)
        ],[
            new Point(0,0),
            new Point(1,0),
            new Point(2,0),
            new Point(3,0)
        ]];
    }
}