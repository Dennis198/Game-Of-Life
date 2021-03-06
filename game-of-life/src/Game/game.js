import React from 'react';
import "./game.css";
import Field from "./Field/field";
import { Button, Slider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';

/**
  Code for the custom slider look
  * */ 
 function ValueLabelComponent(props) {
    const { children, open, value } = props;
  
    return (
      <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
        {children}
      </Tooltip>
    );
  }
  ValueLabelComponent.propTypes = {
    children: PropTypes.element.isRequired,
    open: PropTypes.bool.isRequired,
    value: PropTypes.number.isRequired,
  };

  const PrettoSlider = withStyles({
    root: {
      color: 'gray',
      height: 8,
    },
    thumb: {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      marginTop: -8,
      marginLeft: -12,
      '&:focus, &:hover, &$active': {
        boxShadow: 'inherit',
      },
    },
    active: {},
    valueLabel: {
      left: 'calc(-50% + 4px)',
      top: 4,
      '& *': {
        background: 'transparent',
        color: 'red',
      },
    },
    track: {
      height: 8,
      borderRadius: 4,
    },
    rail: {
      height: 8,
      borderRadius: 4,
    },
  })(Slider);
/**End Slide Code */


const CANVAS_WIDTH=900;
const CANVAS_HEIGHT=380;
const DEFAULT_RESOLUTION=10;
const DEFAULT_SPEED=100;

//Rules RULE_'Numbers of living neighbours required to survive'_'Number of living Neighbours to get retrived'
// E.g. RULE_23_3 Means: 
//Living Cells with 2 OR 3 Living Neighbours gonna Survive
//Dead Cells with 3 Living Neighbours gonna Live in the next generation
const RULE_ORIGINAL=0; //RULE_23_3
const RULE_1357_1357=1;
const RULE_3_3=2;
const RULE_13_3=3;
const RULE_34_3=4;
const RULE_35_3=5;
const RULE_2_3=6;
const RULE_24_3=7;
const RULE_245_3=8;
const RULE_125_36=9;

export default class Game extends React.Component{
    intervalID=0;
    constructor(props){
        super(props);
        this.state = {
            field: new Field(CANVAS_WIDTH/DEFAULT_RESOLUTION,CANVAS_HEIGHT/DEFAULT_RESOLUTION,DEFAULT_RESOLUTION, RULE_ORIGINAL),
            mouseDown: false,
            resolution: DEFAULT_RESOLUTION,
            isRunning:false,
            generationCount:0, 
            speed: DEFAULT_SPEED,
            rule: RULE_ORIGINAL,
        }
    }

    componentDidMount(){
        this.state.field.draw();
    }

    //Starts the Game of Life and computes and displays the generation every this.state.speed ms
    animation(){
        this.setState({isRunning:true});
        this.intervalID = setInterval(() => {
            this.nextStep();
        },this.state.speed);
    }

      //Stops the the Animation
      stop(){
        this.setState({isRunning:false});
        clearInterval(this.intervalID);
    } 

    //Calculates the next step for the Game
    nextStep(){
        this.state.field.nextGeneration();
        this.setState({generationCount:this.state.generationCount+1});
    }

    //Generates a random population
    randomPopulation(){
        this.state.field.setRandomPopulation();
    }

    //Resets the Game of Life to the initial state
    clear(){
        this.setState({generationCount:0,field: new Field(Math.ceil(CANVAS_WIDTH/this.state.resolution),Math.ceil(CANVAS_HEIGHT/this.state.resolution),this.state.resolution, this.state.rule)});
        setTimeout(() => {
            this.state.field.draw();
        },10);
    }

    //Handles the Mousemovment over the Canvas (Adds red Cells)
    mouseMove(e){
        if(!this.state.mouseDown){
            return;
        } 
        var canvas = document.getElementById("2d-plane");
        var pos = this.getMousePos(canvas, e);
        let i= Math.floor(pos.x/(this.state.resolution));
        let j= Math.floor(pos.y/(this.state.resolution));
        this.state.field.reviveCell(i,j);
    }

     //Handles the Resolution Change (Slider) and creates a new Field
     handleResolutionChange(e, val){
        this.setState({resolution: val, field: new Field(Math.ceil(CANVAS_WIDTH/val),Math.ceil(CANVAS_HEIGHT/val),val, this.state.rule)});
        setTimeout(() => {
            this.state.field.draw();
        },10);
    }

   //Handles the speed change for the iteration timer
    handleSpeedChange(e, val){
        this.setState({speed: val});
        if(this.state.isRunning){
            this.stop();
            this.animation();
        }
    }

    //Gets the Mouse position on the Canvas
    getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
        };
    }

    //Sets the Variable on Mouse Down to true/ Mouse UP to false
    allowDrawOnCanvas(){
        this.setState({mouseDown: !this.state.mouseDown})
    }

    //Handles the Switch of the Rules for the Gamej
    switchRule(e){
      this.setState({rule: parseInt(e.target.value)});
      this.state.field.setRule(parseInt(e.target.value));
    }

    render(){
        const {isRunning, generationCount}= this.state;
        return(
            <div className="game">
                <h1>Game Of Life</h1>
                <Button variant="outlined" disabled={isRunning} onClick={() => this.animation()}>Animation</Button>
                <Button variant="outlined" color="secondary" onClick={() => this.stop()}>Stop</Button>
                <Button variant="outlined" disabled={isRunning} onClick={() => this.nextStep()}>Next Step</Button>
                <Button variant="outlined" onClick={() => this.randomPopulation()}>Random Population</Button>
                <Button variant="outlined" onClick={() => this.clear()}>Clear</Button>
                <select className="select-css" onChange={(e) => this.switchRule(e)}>
                    <option value={RULE_ORIGINAL}>Original Rule (23/2)</option>
                    <option value={RULE_1357_1357}>Copy World 1357/1357</option>
                    <option value={RULE_3_3}>3/3</option>
                    <option value={RULE_13_3}>13/3</option>
                    <option value={RULE_34_3}>34/3</option>
                    <option value={RULE_35_3}>35/3</option>
                    <option value={RULE_2_3}>2/3</option>
                    <option value={RULE_24_3}>23/3</option>
                    <option value={RULE_245_3}>245/3</option>
                    <option value={RULE_125_36}>125/36</option>
                </select>
                <div className="game__resolution__slider">
                    <div className="game__resolution__slider__label">
                        <h4>Resolution</h4>
                        <PrettoSlider disabled={isRunning} valueLabelDisplay="off"
                        aria-label="pretto slider" defaultValue={10} min={5} max={40} step={5}
                        onChange={(e, val) => this.handleResolutionChange(e, val)}  
                        />
                    </div>
                    <div className="game__resolution__slider__label">
                    <h4>Computation Speed</h4>
                    <PrettoSlider valueLabelDisplay="off"
                        aria-label="pretto slider" defaultValue={DEFAULT_SPEED} min={30} max={1020} step={30}
                        onChange={(e, val) => this.handleSpeedChange(e, val)}  
                    />
                    </div>
                </div>
                <h4>Iterations: {generationCount}</h4>
                <canvas className="game_canvas__2dplane" id="2d-plane" width={CANVAS_WIDTH} height={CANVAS_HEIGHT}
                    onMouseDown={ ()=>this.allowDrawOnCanvas()}
                    onMouseUp={()=>this.allowDrawOnCanvas()}
                    onMouseMove={(e) => this.mouseMove(e)}
                ></canvas>
            </div>
        );
    }

}