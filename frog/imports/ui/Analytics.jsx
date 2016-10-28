import React, { Component } from 'react';
import Operators from '../operators'
import Form from "react-jsonschema-form";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: false
    }
  }

  render() {
    return(
      <div>
        { this.state.form ? <Form schema={this.state.form.config} /> : null }
        {Operators.map((x) => 
          <a href='#' onClick={() => this.setState({form: x})}><li>{x.config.title}</li></a>)}
      </div>
    )
  }
}
