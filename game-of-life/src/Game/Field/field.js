/**
 * Thisl File hanldes the Drawing of the Field for the Game of Life
 */
import Cell from "./Cell/cell";

export default class Field{
    constructor(rows,cols,width){
        this.field = this.createField(rows,cols,width);
        this.rows=rows;
        this.cols=cols;
        this.width=width;
    }
   
    //Creates the initial Field
    createField(rows,cols,width){
        let field = new Array(rows);
        for(let i=0;i<field.length;i++){
            field[i]= new Array(cols);
            for(let j=0;j<field[i].length;j++){
                field[i][j]=new Cell(i*width,j*width,width,false);
            }
        }
        return field;
    }

    //Sets the fiven Cell to Alive and Redraws the Cell
    reviveCell(i,j){
        this.field[i][j].revive();
        this.field[i][j].draw();
    } 

    //Generates a Random Population
    setRandomPopulation(){
        for(let i=0;i<this.field.length;i++){
            for(let j=0;j<this.field[0].length;j++){
                this.field[i][j].setState(Math.random()>0.5);
            }
        }
        this.draw();
    }

    //Computes the Next Generation and displays it
    nextGeneration(){
        let newField = this.createField(this.rows,this.cols,this.width);
        for(let i=0;i<this.field.length;i++){
            for(let j=0;j<this.field[0].length;j++){
                if(this.survive(i, j)){
                    newField[i][j].setState(true);
                    continue;
                } 
                newField[i][j].setState(false);
            }
        }
        this.field=newField;
        this.draw();
    }

    
    //Draws the hole field
    draw(){
        for(let i=0;i<this.field.length;i++){
            for(let j=0;j<this.field[0].length;j++){
                this.field[i][j].draw();
            }
        }
    }

    //COmputes if a fiven Cell is gonna Survive in the next Generation
    survive(row,col){
        let counterAlive=0;
        let new_i=0;
        let new_j=0;
        for(let i=row-1;i<=row+1;i++){
            new_i=i;
            for(let j=col-1;j<=col+1;j++){
                new_j=j;
                if(new_i===row && new_j===col) continue;
                if(i<0 || i>this.field.length-1){
                    new_i = this.mod(i,this.field.length);
                }
                if(j<0 || j>this.field[0].length-1){
                    new_j = this.mod(j,this.field[0].length);
                }
                if(this.field[new_i][new_j].isAlive) counterAlive++;
            }
        }
        if(this.field[row][col].isAlive && (counterAlive===2 || counterAlive===3)){
            return true;
        } 
    
        if(!this.field[row][col].isAlive && counterAlive===3){
            return true;
        }
        return false;
    }

    //Moludo
    mod(n, m) {
        return ((n % m) + m) % m;
    }
}