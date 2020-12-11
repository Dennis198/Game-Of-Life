/*
This class handles the behavior of a Cell for the field
*/

export default class Cell{
    constructor(x,y,width,isAlive=false, wasAlive=false){
        this.pos={x:x,y:y};
        this.width=width;
        this.x = x;
        this.isAlive=isAlive; //True=red, False=blue
    }

    //Sets the State of the Cell to a given state
    setState(isAlive){
        this.isAlive=isAlive;
    }

    //Sets the Cell to Alicw
    revive(){
        this.isAlive=true;
    }

    //Draws the Rectangle on the Canvas
    draw(){
        var canvas = document.getElementById("2d-plane");
        var context = canvas.getContext("2d");
        if(this.isAlive){
            context.fillStyle="crimson";
        } else {
            context.fillStyle="lightblue";    
        }
        
        context.fillRect(this.pos.x,this.pos.y,this.width,this.width); 
    }
}