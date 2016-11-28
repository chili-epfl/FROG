import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import DraggableAc from './../DraggableAc.jsx';

//to be put in graph.jxs
const AxisDisplay = ( {reference} ) => { return(
  <div ref={reference} style={{overflowX: scroll}}>
    <svg width="1000px" height="200px" xmlns="http://www.w3.org/2000/svg" style={{overflow: "scroll"}}>
      <text x="0%" y="20%">Plane 1</text>
      <line x1="10%" y1="20%" x2="100%" y2="20%" style={{stroke: 'black', strokeWidth:"1"}} />

      <text x="0%" y="60%">Plane 2</text>
      <line x1="10%" y1="60%" x2="100%" y2="60%" style={{stroke: 'black', strokeWidth:"1"}}/>

      <text x="0%" y="100%">Plane 3</text>
      <line x1="10%" y1="100%" x2="100%" y2="100%" style={{stroke: 'black', strokeWidth:"1"}}/>
    </svg>
  </div>
)}

const divStyle = {
  position: "relative",
  height: 300,
  width: "60%",
  overflowX: "scroll",
  border: 2,
  borderStyle: "solid",
  borderColor: "yellow"
}

const divListStyle = {
  position: "absolute",
  left: "65%",
  height: 300,
  width: "40%",
  border: 1,
  borderStyle: "solid",
  borderColor: "black"
}

const divStyleNeg = {
  background: "white",
  border: 2,
  width: 60,
  height: 40,
  margin: 10,
  padding: 10,
  float: "left",
  position: "absolute",
  borderStyle: "solid",
  borderColor: "red"

}

const divStyleAc = {
  background: "white",
  border: 2,
  width: 60,
  height: 40,
  margin: 10,
  padding: 10,
  float: "left",
  position: "relative",
  borderStyle: "solid",
  borderColor: "red"

}

const BoxAc = ( {hoverStart, hoverStop, plane} ) => {
  return(
    <div
      style={divStyleAc}
      onMouseOver={hoverStart}
      onMouseOut={hoverStop}>
      Plane {plane}
    </div>
  )
};

const RenderDraggable = ( {handleHoverStart, handleHoverStop, activities}) => {return(
      /*
      <div style={divListStyle}>

        <DraggableAc
          editorMode={editable}
          inGraph={false}
          plane={2}
          key={2}
          startTime={1}
          duration={45}/>
        <DraggableAc
          editorMode={editable}
          inGraph={false}
          plane={1}
          key={1}
          startTime={60}
          duration={90}/>

        <DraggableAc
          editorMode={editable}
          inGraph={false}
          plane={3}
          key={3}
          startTime={165}
          duration={45}/>
    </div>
    {currentDraggable}
    */
    <div>
      <div style={divListStyle}>

        {activities.map((activity, i) => {
          return <BoxAc
          hoverStart={(event) => handleHoverStart(event, i+1, activity)}
          hoverStop={handleHoverStop}
          key={i}
          plane={i+1} />
        })}
      </div>
    </div>

  )
}


const RenderGraph = ( {activities, editable, dragStop, currentDraggable, handleDragStop} ) => {
  return(

      <div style={divStyle}>
        {activities.map( (activity) =>
          <DraggableAc
            editorMode={true}
            inGraph={true}
            plane={1}
            onStop={dragStop}
            key={activity.key}
            startTime={activity.data.startTime}
            duration={activity.data.duration}
            defaultPosition={{x: 0, y:0}} />
        )}
        <div style={{top: 50}}>
          <AxisDisplay />
        </div>

      {currentDraggable ? 
      <DraggableAc
        editorMode={true}
        inGraph={false}
        plane={1}
        key={1}
        startTime={60}
        duration={90}
        onStop={handleDragStop}
        defaultPosition={{x: 0, y: 0}}
        />
        : "" }
      </div>

    );
}


export default class Graph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addedActivities: [],
      currentDraggable: null
    };
  }


  handleHoverStart = (event, plane, activity) => {
    event.preventDefault();
    this.setState({currentDraggable: activity});
    /*
    var pos = event.target.getBoundingClientRect();

    var newDrag = <DraggableAc
      editorMode={true}
      inGraph={false}
      plane={plane}
      key={1}
      startTime={60}
      duration={90}
      onStop={this.handleDragStop}
      defaultPosition={{x: pos.left-100, y: 0}}/>;

    this.setState({currentDraggable: newDrag
    */  }

  leftPos() {
    return 0;
  }

  rightPos() {
    return 100;
  }

  topPos() {
    return 0;
  }

  bottomPos() {
    return 100;
  }


  handleHoverStop = (event) => {
    event.preventDefault();
    if(event.buttons == 0) {
      this.setState({currentDraggable: null});
    }
  }

  handleDragStop = (event, position) => {
    event.preventDefault();
    alert(position)
    var pos = event.target.getBoundingClientRect();

    alert(pos.top + " " + pos.right + " " + pos.down + " " + pos.left)

    if(pos.top < this.topPos() &&
      pos.top > this.bottomPos() &&
      pos.left > this.leftPos() &&
      pos.right < this.rightPos()) 
    {
      var activitiesMore = this.state.addedActivities.concat(event.target)
      this.setState({addedActivities: activitiesMore});
    }
    else {
      var index = this.state.addedActivities.indexOf(event.target)
      if(index != -1) {
        var activitiesLess = 
          this.state.addedActivities.slice(0, index).concat(this.state.addedActivities.slice(index+1, this.state.addedActivities.length))
        this.setState({addedActivities: activitiesLess});
      }
    }

    this.setState({currentDraggable: null});
  }

  render() {
    return (
      <div className="graph-summary">
          <div>

            <RenderDraggable
              handleHoverStart={this.handleHoverStart}
              handleHoverStop={this.handleHoverStop}
              activities = {this.props.activities}
              />
            <RenderGraph activities={this.state.addedActivities} editable={true} dragStop={this.handleDragStop} 
            currentDraggable={this.state.currentDraggable}
            handleDragStop={this.handleDragStop}
            />
          </div>
      </div>
    );
  }
}


Graph.propTypes = {
  activities: PropTypes.array.isRequired,
};
