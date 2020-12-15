/**
 * Thisl File hanldes the Drawing of the Field for the Game of Life
 */
import Cell from "./Cell/cell";

const RULE_ORIGINAL={id:0, survive:[2,3], revive:[3]};
const RULE_1357_1357={id:1, survive:[1,3,5,7], revive:[1,3,5,7]};
const RULE_3_3={id:2, survive:[3], revive:[3]};
const RULE_13_3={id:3, survive:[1,3], revive:[3]};
const RULE_34_3={id:4, survive:[3,4], revive:[3]};
const RULE_35_3={id:5, survive:[3,5], revive:[3]};
const RULE_2_3={id:6, survive:[2], revive:[3]};
const RULE_24_3={id:7, survive:[2,4], revive:[3]};
const RULE_245_3={id:8, survive:[2,4,5], revive:[3]};
const RULE_125_36={id:9, survive:[1,2,5], revive:[3,6]};


export default class Field{
    constructor(rows,cols,width,rule=0){
        this.field = this.createField(rows,cols,width);
        this.rows=rows;
        this.cols=cols;
        this.width=width;
        this.setRule(rule);
    }

    setRule(rule){
        console.log(rule);
        switch (rule) {
            case RULE_ORIGINAL.id:
                this.rule=RULE_ORIGINAL;
                break;
            case RULE_1357_1357.id:
                this.rule=RULE_1357_1357;
                break;
            case RULE_3_3.id:
                this.rule=RULE_3_3;
                break;
            case RULE_13_3.id:
                this.rule=RULE_13_3;
                break;
            case RULE_34_3.id:
                this.rule=RULE_34_3;
                break;
            case RULE_35_3.id:
                this.rule=RULE_35_3;
                break;
            case RULE_2_3.id:
                this.rule=RULE_2_3;
                break;
            case RULE_24_3.id:
                this.rule=RULE_24_3;
                break;
            case RULE_245_3.id:
                this.rule=RULE_245_3;
                break;
            case RULE_125_36.id:
                this.rule=RULE_125_36;
                break;
            default:
                this.rule=RULE_ORIGINAL;
                break;
        }
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

    //Computes if a fiven Cell is gonna Survive in the next Generation
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
        return this.ruleSurvive(this.field[row][col].isAlive, counterAlive);
    }

    //Checks if the Cell is gone live in the next generation based on the World rule
    ruleSurvive(isAlive, counterAliveNeigbours){
        if(counterAliveNeigbours===0) return false;
        if(isAlive){
            return this.rule.survive.includes(counterAliveNeigbours);
        } else {
            return this.rule.revive.includes(counterAliveNeigbours);
        }
    }

    //Moludo
    mod(n, m) {
        return ((n % m) + m) % m;
    }
}