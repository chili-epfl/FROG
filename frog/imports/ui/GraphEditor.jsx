import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor';
import Draggable from 'react-draggable';

import { Activities, Operators, removeGraphActivity, addGraphActivity, addGraphOperator, copyActivityIntoGraphActivity, copyOperatorIntoGraphOperator, dragGraphActivity, removeGraph, importGraphOperator, importGraphActivity } from '../api/activities';
import { Graphs, addGraph, renameGraph } from '../api/graphs';

import jsPlumb from 'jsplumb';
import { $ } from 'meteor/jquery';

const planeNames = ['class','group','individual'];

const setCurrentGraph = (graphId) => {
  Meteor.users.update({_id:Meteor.userId()},{$set: {'profile.editingGraph': graphId}})
}

function download(strData, strFileName, strMimeType) {
    var D = document,
        A = arguments,
        a = D.createElement("a"),
        d = A[0],
        n = A[1],
        t = A[2] || "text/plain";

    //build download link:
    a.href = "data:" + strMimeType + "charset=utf-8," + escape(strData);


    if (window.MSBlobBuilder) { // IE10
        var bb = new MSBlobBuilder();
        bb.append(strData);
        return navigator.msSaveBlob(bb, strFileName);
    } /* end if(window.MSBlobBuilder) */



    if ('download' in a) { //FF20, CH19
        a.setAttribute("download", n);
        a.innerHTML = "downloading...";
        D.body.appendChild(a);
        setTimeout(function() {
            var e = D.createEvent("MouseEvents");
            e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
            D.body.removeChild(a);
        }, 66);
        return true;
    }; /* end if('download' in a) */



    //do iframe dataURL download: (older W3)
    var f = D.createElement("iframe");
    D.body.appendChild(f);
    f.src = "data:" + (A[2] ? A[2] : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape)(strData);
    setTimeout(function() {
        D.body.removeChild(f);
    }, 333);
    return true;
}

var jsPlumbInstance = null

jsPlumbRemoveAll = () => {
  if(jsPlumbInstance){
    jsPlumbInstance.detachEveryConnection();
    jsPlumbInstance.deleteEveryEndpoint();
    jsPlumbInstance.unmakeEveryTarget();
    jsPlumbInstance.unmakeEverySource();
  }
}

jsPlumbDrawAll = (activities,operators) => {
  if(jsPlumbInstance){
    activities.forEach(activity => {
      const connector = $('#'+activity._id)
      jsPlumbInstance.makeSource(connector, { anchor: 'Continuous' })
      jsPlumbInstance.makeTarget(connector, { anchor:'Continuous' })
    })
    operators.forEach(operator => {
      jsPlumbInstance.connect({
        source:$('#'+operator.from),
        target:$('#'+operator.to),
        anchors:['Continuous','Continuous']
      })
      jsPlumbRepaintWithId(operator.from)
      jsPlumbRepaintWithId(operator.to)
    })
  }
}

getPosition = (id) => {
  const connectorP = $('#'+id).position()
  const itemP = $('#item'+id).position()
  return( (connectorP && itemP) ? {
      left: itemP.left,
      top: itemP.top + connectorP.top
  } : { left: 0, top: 0 } )
} 

jsPlumbRepaintWithId = (activityId) => {
  try {
    const connector = $('#'+activityId)
    jsPlumbInstance.repaint(connector,getPosition(activityId))
  } catch(err) { 
    // Nothing to repaint
  }
}

jsPlumbRemoveAllAndDrawAgain = (activities,operators) => {
  jsPlumbRemoveAll()
  jsPlumbDrawAll(activities,operators)
}

const ChoiceComponent = ({ choices, ownId, submitChoiceFn, displayFn }) => {
  var selectedChoice = choices[0] ? choices[0]._id :null
  
  const changeChoice = (event) => { selectedChoice = event.target.value }

  const submitChoice = (event) => { 
    event.preventDefault()
    submitChoiceFn(ownId, selectedChoice) 
  }

  return (
    <form className='selector' onSubmit={submitChoice} >
      <select onChange={changeChoice}>
        {choices.map(choice => <option key={choice._id} value={choice._id}>{displayFn(choice)}</option>)}
      </select>
      <input type="submit" value="Submit" />
    </form>
  )
}

const ActivityChoiceComponent = createContainer(
  (props) => { return ({
    ...props,
    choices: Activities.find({ graphId: null, sessionId: null }).fetch(),
    submitChoiceFn: copyActivityIntoGraphActivity,
    displayFn: (activity => activity.data.name)
  })},
  ChoiceComponent
)

const OperatorChoiceComponent = createContainer(
  (props) => { return({ 
    ...props,
    choices: Operators.find({ graphId: null, sessionId: null }).fetch(),
    submitChoiceFn: copyOperatorIntoGraphOperator,
    displayFn: (operator => operator.operator_type)
  })}, 
  ChoiceComponent
)

class ActivityInEditor extends Component { 

  onStop = (event, data) => {
    dragGraphActivity(this.props.activity._id, data.x)
    this.forceUpdate()
  }

  onDrag = (event, data) => {
    jsPlumbRepaintWithId(this.props.activity._id)
  }

  submitRemoveActivity = () => {
    jsPlumbRemoveAll()
    removeGraphActivity(this.props.activity._id)
  }

  render() { return (
    <Draggable
      axis='x'
      handle='.title'
      position={{x:0,y:0}}
      onDrag={this.onDrag}
      onStop={this.onStop} >
      <div className={'item'} style={{left:this.props.activity.xPosition, top:this.props.activity.yPosition}} id={'item'+this.props.activity._id}>
        { this.props.activity.data ? 
          <div className={'title'} > {this.props.activity.data.name} </div>
          : <ActivityChoiceComponent ownId={this.props.activity._id} />
        }
        <a 
          href='#' 
          onClick={this.submitRemoveActivity}
          style={{ position: 'absolute', top: 0, right: 0 }}>
          <i className="fa fa-times" />
        </a>
        <button 
          className='btn btn-primary btn-sm connector' 
          style={{ bottom: 0, width:'100%', position:'absolute' }}
          id={this.props.activity._id} > 
          Connect 
        </button>
      </div>
    </Draggable>
  )}
}

class GraphEditorClass extends Component {

  componentDidMount() {

    jsPlumbInstance = jsPlumb.getInstance();
    jsPlumbInstance.setContainer($('#container'));

    // creating an operator in the graph
    jsPlumbInstance.bind('connection', (info,originalEvent) => {
      if (originalEvent) { // testing if the event comes from a human
        addGraphOperator({ graphId: this.props.graphId , from: info.sourceId, to: info.targetId })
      }
    });

    // creating an activity in the graph
    planeNames.forEach(plane => {
      $('#'+plane).dblclick(event => {
        event.preventDefault()
        if(this.props.graph) {
          addGraphActivity({ 
            plane: plane, 
            xPosition: event.offsetX, 
            yPosition: plane=='class' ? 0 : (plane=='group' ? 100 : 200),
            graphId: this.props.graphId
          })
        } else {
          alert('you need to select a graph to edit or create a new one')
        }
      })
    })

    jsPlumbDrawAll(this.props.activities,this.props.operators)
  }

  componentDidUpdate() {
    jsPlumbRemoveAllAndDrawAgain(this.props.activities,this.props.operators)
  }

  exportToJSON = (event) => {
    var obj = {
      'graph': Graphs.findOne({_id:this.props.graphId}),
      'activities': Activities.find({ graphId: this.props.graphId }).fetch(),
      'operators': Operators.find({ graphId: this.props.graphId }).fetch()
    }
    const str = 'graph' + String(this.props.graphId) + '.json'
    download(JSON.stringify(obj), str, 'text/plain');
  }

  importFromJSON = (event) => {
    console.log(document.getElementById("json-file").files[0])
    var thisGraphId = this.props.graphId
    var files = document.getElementById('json-file').files;
    if (files.length <= 0) {
      return false;
    }
    var fr = new FileReader();
    fr.onload = function(e) { 
      var obj = JSON.parse(e.target.result);
      console.log(obj)
      var objstr = JSON.stringify(obj, null, 2);
      if (obj.hasOwnProperty('graph') && obj.hasOwnProperty('activities') && obj.hasOwnProperty('operators')){
        activities = Activities.find({ graphId: thisGraphId }).fetch()
        for (var i = 0; i < activities.length; i++){
          removeGraphActivity(activities[i]._id)
        }
        renameGraph(thisGraphId, obj.graph.name)
        for (var i = 0; i < obj.activities.length; i++){
          importGraphActivity(obj.activities[i], thisGraphId)
        }
        for (var i = 0; i < obj.operators.length; i++){
          importGraphOperator(obj.operators[i], thisGraphId)
        }
        console.log('Graph uploaded')
      } else {
        console.log('Graph unrecognised')
      }
    }
    fr.readAsText(files.item(0));
  }

  render() { return(
    <div>
      <h3>Graph editor</h3>
      <div>
        <p>Double click for creating</p>
        <div id='container'>
          { planeNames.map((plane) => 
            <div className='plane' id={plane} key={plane}>
              <div className='lineInPlane' ></div>
              <p style={{ position: 'absolute', top: '33%' }}>{plane}</p>
            </div>
          )}
          { this.props.activities.map(activity =>
            <ActivityInEditor key={activity._id} activity={activity} />
          )}
        </div>
        <input
          onChange={(event) => renameGraph(this.props.graphId, event.target.value)}
          value={this.props.graph? this.props.graph.name: 'untitled'}
        />
      </div>
      { this.props.operators.map(operator => {
        return(
          !operator.data && <OperatorChoiceComponent key={operator._id} ownId={operator._id} />
        )
      })}
      <button className='export button' onClick={this.exportToJSON}>Download the Graph</button>
      <form encType="multipart/form-data" action="upload" method="post">
        <input id="json-file" type="file" />
      </form>
      <button className='import button' onClick={this.importFromJSON}>Upload a Graph</button>
    </div>
  )}
}

const GraphEditor = createContainer(
  (props) => { return({
    ...props,
    graph: Graphs.findOne({ _id: props.graphId }),
    activities: props.graphId ? Activities.find({ graphId: props.graphId }).fetch() : [],
    operators: props.graphId ? Operators.find({ graphId: props.graphId }).fetch() : [],
  })}, 
  GraphEditorClass
)

const GraphList = createContainer(
  (props) => {
    return({
      ...props,
      graphs: Graphs.find().fetch()
    })
  },
  ( { graphs, editSavedGraph, graphId } ) => {

    const editGraph = (graphId) => {
      jsPlumbRemoveAll() 
      setCurrentGraph(graphId)
    }

    const submitRemoveGraph = (graphId) => {
      jsPlumbRemoveAll()
      removeGraph(graphId)
    }

    return(
      <div>
        <h3>Graph list</h3>
        <button className='btn btn-primary btn-sm' onClick={() => editGraph(addGraph())}>New</button>
        <ul> { graphs.map((graph) => 
          <li style={{listStyle: 'none'}} key={graph._id}>
            <a href='#' onClick={ () => submitRemoveGraph(graph._id) }><i className="fa fa-times" /></a>
            <a href='#' onClick={ () => editGraph(graph._id) } ><i className="fa fa-pencil" /></a>
            {graph.name} {graph._id==graphId? '(current)':null}
          </li>
        )} </ul>
      </div>
    )
  }
)

export default createContainer(
  () => {
    const user = Meteor.users.findOne({_id:Meteor.userId()})
    const graphId = user.profile ? user.profile.editingGraph : null
    return({ 
      user: user,
      graphId: graphId 
    })
  },
  ({ graphId, user }) =>
    <div>
      <GraphEditor graphId={graphId} />
      <GraphList graphId={graphId} />
    </div>
)
