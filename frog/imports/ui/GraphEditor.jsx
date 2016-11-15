import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor';

import { Activities, Operators } from '../api/activities';
import { Graphs } from '../api/graphs';

import jsPlump from 'jsplumb';
import { $ } from 'meteor/jquery';

class GraphEditor extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      graph: null
    }
  }

  componentDidMount() {
    jsPlumb.ready(function() {
      jsPlumb.setContainer($('#container'));
      var i = 0;
      
      $('#container').dblclick(function(e) {

        var newState = $('<div>').attr('id', 'state' + i).addClass('item');
        var title = $('<div>').addClass('title').text('State ' + i);
        var connect = $('<div>').addClass('connect');
            
        newState.css({
          'top': e.pageY,
          'left': e.pageX
        });
        
        newState.append(title);
        newState.append(connect);
        
        $('#container').append(newState);
        
        jsPlumb.makeTarget(newState, {
          anchor: 'Continuous'
        });
        
        jsPlumb.makeSource(connect, {
          parent: newState,
          anchor: 'Continuous'
        });     
        
        jsPlumb.draggable(newState, {
          containment: 'parent'
        });

        newState.dblclick(function(e) {
          jsPlumb.detachAllConnections($(this));
          $(this).remove();
          e.stopPropagation();
        });
        i++;
      });
    });
  }

  render() { return(
    <div>
      <h3>Graph editor</h3>
      <p>Double click for creating</p>
      <div id="container"></div>
    </div>
  )}
}

export default createContainer(() => {
  return {
    activities: Activities.find({}).fetch(),
    operators: Operators.find({}).fetch(),
  }
}, GraphEditor)
