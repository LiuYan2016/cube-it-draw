// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Hand from '../assets/hand.png';
import Pen from '../assets/pen.png';
import { Button } from 'aq-miniapp-components-ui';

import './Draw.css';

const DEFAULT_LINE_WIDTH = 4;
const DEFAULT_LINE_COLOR = 'black';
const WIDTH = window.innerWidth * 0.9;
const HEIGHT = window.innerHeight * 0.8;
const STARTX = WIDTH / 2;
const STARTY = HEIGHT / 2;
const TIMEOUT = 60000;

export type Coordinates = {
  x: number,
  y: number
}

export type Props = {
  lineColor: string,
  lineWidth: number,
  onDrawFinished: () => void
};

export default class Draw extends Component {
  /*
  TODO: Implement drawing in Canvas using HTML5 DeviceMotion events

  This component should only process the acceleration data in the x and y axis only
  to produce suitable drawing coordinates. Computed drawing coordinates should only be within the
  current bounds of the canvas (i.e. current size)

  Canvas instance can be accessed via this.canvas

  */
  constructor(props) {
    super(props);
    this.state = {drawingPath: [], pen: "Pen", timer: null, recorded: false, axy: {x: 0, y: 0}};
  
    this.setDrawingPath = this.setDrawingPath.bind(this);
    this.updateCanvas = this.updateCanvas.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.startGetPathPoints = this.startGetPathPoints.bind(this);
    this.stopGetPathAndHandle = this.stopGetPathAndHandle.bind(this);
    this.getButton = this.getButton.bind(this);
  }
    
  static propTypes = {
    lineColor: PropTypes.string,
    lineWidth: PropTypes.number,
    onDrawFinished: PropTypes.func
  }

  static defaultProps = {
    lineColor: DEFAULT_LINE_COLOR,
    lineWidth: DEFAULT_LINE_WIDTH
  };

  componentWillMount() {
//    this.setDrawingPath();//This is test code to animate drawing

    if (this.hasDeviceMotion) {
      window.addEventListener('devicemotion', this.deviceMotion, false);
    }
  }

  componentWillUnmount() {
    if (this.hasDeviceMotion) {
      window.removeEventListener('devicemotion', this.deviceMotion, false);
    }
  }

  deviceMotion = (e: Event) => {
    // TODO:
    // 1. Implement logic to handle device motion event.
    // 2. Convert x,y acceleration data to suitable drawing coordinates.
    // 3. If drawing is enabled (i.e. this.state.drawingEnabled == true),
    //    draw on the canvas given the computed coordinates, using the current
    //    line width and color.
    // 4. Call this.props.onDraw to inform of current coordinates.

  }

  enable() {
    this.setState({drawingEnabled: true});
  }

  disable() {
    this.setState({drawingEnabled: false});
  }

  componentDidMount() {

//    this.updateCanvas();
  }

  setDrawingPath(){
    let path = [
      {x: 3, y: 3}, 
      {x: 100, y: 3}, 
      {x: 100, y: 100}, 
      {x: 3, y: 100}, 
      {x: 3, y: 200}, 
      {x: 300, y: 300}, 
      {x: 200, y: 800}, 
    ];
    console.log(path);

    this.setState({drawingPath: path});

    console.log(this.state.drawingPath);
  }

  updateCanvas() {
    // TODO:
    // 1. Implement animation to draw.

    let {lineColor, lineWidth, ...rest} = this.props;

    console.log(this.state.drawingPath);
    let path = this.state.drawingPath;

    let zoom = calcZoom(path);
    console.log(zoom);
    var points = calcWaypoints(path, zoom);

    function calcZoom(path) {
      let maxX = 0, maxY = 0;
      let zoomX = 1, zoomY = 1;
      for (var i = 0; i < path.length; i++) {
        maxX = (Math.abs(path[i].x) > maxX) ? Math.abs(path[i].x) : maxX;
        maxY = (Math.abs(path[i].y) > maxY) ? Math.abs(path[i].y) : maxY;
      }
      if (maxX > (WIDTH / 2 - 4))
        zoomX = (WIDTH / 2 - 4) / maxX;
      if (maxY > (HEIGHT / 2 - 4))
        zoomY = (HEIGHT / 2 - 4) / maxY;
      return (zoomX < zoomY) ? zoomX : zoomY;
    }

    function calcWaypoints(path, zoom) {
      var waypoints = [];
      if (path.length > 0)
        waypoints.push({x: STARTX, y: STARTY});
      for (var i = 1; i < path.length; i++) {
        var pt0 = {x: path[i - 1].x * zoom, y: path[i - 1].y * zoom};
        var pt1 = {x: path[i].x * zoom, y: path[i].y * zoom};
        var dx = pt1.x - pt0.x;
        var dy = pt1.y - pt0.y;
        var max = (Math.abs(dx) > Math.abs(dy)) ? Math.abs(dx) : Math.abs(dy);
        for (var j = 0; j < max; j++) {
          var x = STARTX + pt0.x + dx * j / max;
          var y = STARTY + pt0.y + dy * j / max;
          waypoints.push({
            x: x,
            y: y
          });
        }
      }
      return (waypoints);
    }


    var ctx = this.refs.canvas.getContext('2d');

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.lineCap = "round";

    var index = 1;

    var requestAnimationFrame = window.requestAnimationFrame ||
                                window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame ||
                                window.msRequestAnimationFrame;

    function animate() {

      let offsetx = -12, offsety = -21;

      var imageObj = new Image();
      imageObj.onload = function() {
        if (index > 1 ) {
          ctx.clearRect(0, 0, WIDTH, HEIGHT);
        }
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < index; i ++){
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();

        if (index < points.length - 1)
          ctx.drawImage(imageObj, points[index-1].x + offsetx, points[index-1].y + offsety, 130, 100);
      };
      imageObj.src = Hand;

      index++;
      if (index < points.length)
        requestAnimationFrame(animate);
    }
    if (points.length > 0)
      animate();

  }

  startGetPathPoints(){
    // TODO:
    // 1. Implement logic to handle device motion event.
    // 2. Convert x,y acceleration data to suitable drawing coordinates.

    let x = 0, y = 0;
    let vx = 0, vy = 0;
    let ax = 0, ay = 0;
    let path = [];
    let startTime = new Date().getTime();

    if (window.DeviceMotionEvent != undefined) {
      let self = this;
      window.addEventListener("devicemotion", function (event) {
        ax = event.accelerationIncludingGravity.x * 5;
        ay = event.accelerationIncludingGravity.y * 5;
        /*
        if (event.acceleration.x != null){
          ax = event.acceleration.x * 5;
          ay = event.acceleration.y * 5;
        } else {
          ax = event.accelerationIncludingGravity.x * 5;
          ay = event.accelerationIncludingGravity.y * 5;
        }
        */
      }, false);

      let timer = setInterval( function() {
        console.log(new Date().getTime() - startTime);
        console.log(TIMEOUT);
        if(new Date().getTime() - startTime > TIMEOUT){
          self.stopGetPathAndHandle();
          return;
        }
        var landscapeOrientation = window.innerWidth/window.innerHeight > 1;
        if ( landscapeOrientation) {
          vx = vx + ay;
          vy = vy + ax;
        } else {
          vy = vy - ay;
          vx = vx + ax;
        }
        vx = vx * 0.98;
        vy = vy * 0.98;
        y = parseInt(y - vy / 50);
        x = parseInt(x - vx / 50);

        path.push({x: x, y: y});
        self.setState({drawingPath: path});
      }, 25);
      this.setState({timer: timer});
    }
  }

  mouseDown(event){
    event.preventDefault();
    this.startGetPathPoints();
  }

  stopGetPathAndHandle(){
    clearInterval(this.state.timer);
    this.setState({recorded: true});
    this.updateCanvas();
  }

  mouseUp(event){
    event.preventDefault();
    this.stopGetPathAndHandle();
  }

  getButton(){
    if (this.state.recorded == false){
      return <button id="button_pen" onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} onTouchStart={this.mouseDown} onTouchEnd={this.mouseUp}></button>
    } else {
      return <Button title="Next" onClick={this.props.onDrawFinished}/>
    }
  }

  render() {

    return (
      <div className="viewContainer justifySpaceAround">
        <div className="whiteBoard">
          <canvas ref="canvas" id="canvasArea" width={WIDTH} height={HEIGHT}/>
        </div>
        {
          this.getButton()
        }
      </div>
    );
  }
}
