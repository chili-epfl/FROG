import React, { Component } from 'react';
import { Graphs } from '../../api/graphs.js';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';

export default class DisplayGraphs extends Component {
  render() {
    return(
      <p>This is totally a legit graph</p>
    );
  }
}
