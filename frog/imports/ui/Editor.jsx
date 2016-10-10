import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Editor extends Component {

  constructor(props) {
    super(props);

    this.state = {
      fieldValues: {
        id: "",
        name: "",
        type: null,
        plane: 0,
      }
    }
  }

  handleFormChanges(event) {
    event.preventDefault();

    var newValues = {
      id: ReactDOM.findDOMNode(this.refs.id).value.trim(),
      name: ReactDOM.findDOMNode(this.refs.name).value.trim(),
      type:  ReactDOM.findDOMNode(this.refs.type).value,
      plane:  ReactDOM.findDOMNode(this.refs.plane).value,
    }

    this.setState({
      fieldValues: newValues,
    });

  }

  //used for testing
  handleSubmit(event) {
    event.preventDefault();
    var fv = this.state.fieldValues;

    alert("ID " + fv["id"]+"\nname "+ fv["name"] +
      "\ntype " + fv["type"] + "\n plane " + fv["plane"]);
  }

  render() {
    return (
      <div>
        <form className="editor-form"
          onInput={ this.handleFormChanges.bind(this) }>
          <label>ID</label><br/>
          <textarea
            type="text"
            ref="id" />
          <br/><br/>

          <label>Name</label><br/>
          <textarea
            type="text"
            ref="name" />
            <br/><br/>

          <label>Type</label><br/>
          <select ref="type">
            <option value="lecture">Lecture</option>
            <option value="quizz">Quizz</option>
            <option value="video">Video</option>
          </select><br/><br/>

          <label>Plane</label><br/>
          <select ref="plane">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select><br/><br/>
        </form>

        <button
          type="submit"
          onClick={this.handleSubmit.bind(this)}>Submit</button>
      </div>

    )
  }

}
