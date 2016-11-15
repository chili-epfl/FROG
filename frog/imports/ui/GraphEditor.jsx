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
      
      ['#solo','#group','#class'].forEach(function(plane) {
        $(plane).dblclick(function(e) {

          var activity = $('<div>').attr('id', 'activity' + i).addClass('item');
          var name = $('<div>').addClass('title').text('Activity ' + i);
          var product = $('<div>').addClass('product').text('product');
          var object = $('<div>').addClass('object').text('object');
          
          activity.append(name);
          activity.append(product);
          activity.append(object);
          
          $(plane).append(activity);
          
          jsPlumb.makeTarget(object, { anchor: 'Continuous' });
          jsPlumb.makeSource(product, { anchor: 'Continuous' });     
          
          jsPlumb.draggable(activity, { axis:'x', containment: 'parent' });

          activity.dblclick(function(e) {
            jsPlumb.detachAllConnections($(this));
            $(this).remove();
            e.stopPropagation();
          });

          i++;

        });
      });
    });
  }

  render() { return(
    <div>
      <h3>Graph editor</h3>
      <p>Double click for creating</p>
      <div id='container'>
        <div className='plane' id='solo'><p style={{float:'right'}}>solo</p></div>
        <div className='plane' id='group'><p style={{float:'right'}}>group</p></div>
        <div className='plane' id='class'><p style={{float:'right'}}>class</p></div>
      </div>
    </div>
  )}
}

export default createContainer(() => {
  return {
    activities: Activities.find({}).fetch(),
    operators: Operators.find({}).fetch(),
  }
}, GraphEditor)
