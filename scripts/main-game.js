function Point(x,y){
    this.x = x;
    this.y = y;
}

class TetrisPiece{

    constructor() {
        this.currentPosition = new Point(0,0);
        this.colour = "blue";
        this.rotations = this.getRotations();
    }
    draw(){

    }
    getRotations(){

    }
}
class TetrisLPiece extends TetrisPiece{
    constructor(){
        super();
    }
}


class GameLoop{


}

document.addEventListener('DOMContentLoaded', () => {
    const width = 10;
    const height = 20;
    //Find Squares and Grid
    const gameGrid = document.querySelector(".main-grid");
    let squares = document.querySelectorAll(".main-grid div");
    console.log(`Found Grid ${squares.length} squares in the grid.`)

    //
    
})