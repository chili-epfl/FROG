import React, { Component } from 'react';

/*
Class used to display the form to create a new graph
*/
export default class Graph extends Component {


  constructor(props) {
    super(props);

    this.state = {
      id: "",
      name: "",
    }
  }

  handleIDChange(event) {
    event.preventDefault();
    this.setState({id:event.target.value.trim()});
  }

  handleNameChange(event) {
    event.preventDefault();
    this.setState({name:event.target.value.trim()});
  }
}