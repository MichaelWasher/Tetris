

// Abstract Class
class TetrisPiece{

    constructor(scoreLabel) {
        this._currentPosition = new Point(0,1);
        this._colour = "blue";
        this._rotations = this.getRotations();
        this._currentRotation = 0;
        this._totalRotations = 0;
        this._falling = true;
        this._kernel = this._rotations[0];
    }
    
    rotate(){
        this._currentRotation++;
        this._currentRotation %= this._totalRotations; 
    }
    backRotate(){
        this._currentRotation--;
        this._currentRotation = Math.abs(this._currentRotation) % this._totalRotations;
    }
    update(){
        if(this.falling){
            this._currentPosition.y++;
        }
    }
    draw(grid){
        // square.style.backgroundColor = this.colour;
        // square.classList.add("taken");
        this._kernel.forEach(kernelPoint => {
            let xPoint = kernelPoint.x + this._currentPosition.x
            let yPoint = kernelPoint.y + this._currentPosition.y
            let square = grid[yPoint][xPoint];
            square.style.backgroundColor = this._colour;
            square.classList.add("taken");
        });
    }
    invalidate(grid){
        //Undraw 
        square = grid[this._currentPosition.x][this._currentPosition.y]
        square.style.backgroundColor = this._colour;
        square.classList.remove("taken");
    }
}
class TetrisLPiece extends TetrisPiece{
    constructor(){
        super();
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
    constructor(){
        super();
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
    constructor(){
        super();
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
//DONE
class TetrisSPiece extends TetrisPiece{
    constructor(){
        super();
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
    constructor(){
        super();
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
//DONE

class TetrisOPiece extends TetrisPiece{
    constructor(){
        super();
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
    constructor(){
        super();
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