import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Editor extends Component {


  constructor(props) {
    super(props);

    this.state = {
      nbQuestion: 0,

      fieldValues: {
        id: "",
        name: "",
        type: "lecture",
        plane: 0,
        object: [],
      }
    }
  }

  createQA() {
    this.setState({
      nbQuestion: this.state.nbQuestion + 1,
    });

    return (
      <div>
        <label>Question {this.state.nbQuestion}</label><br/>
        <textarea
          type="text"
          ref={"question" + this.state.nbQuestion} /><br/>

        <label>Answer {this.state.nbQuestion}</label><br/>
        <textarea
          type="text"
          ref={"answer" + this.state.nbQuestion} /><br/>
      </div>
    );
  }

  renderObject() {
    switch (this.state.fieldValues["type"]) {
      case "lecture":
        return (
          <div>
            <input
              type="text"
              ref ="lectureURL"
              placeholder="Enter the URL"/><br/>
          </div>
        );

      case "video":
        return (
          <div>
            <input
              type="text"
              ref ="videoPath"
              placeholder="Enter the path"/><br/>
          </div>
        );

      case "quizz":
        return createQA();

      default:
        return("");
    }

  }

  handleFormChanges(event) {
    event.preventDefault();

    let newType = ReactDOM.findDOMNode(this.refs.type).value;
    let newObject = null;

    if(newType == this.state.fieldValues["type"]) {
      switch(newType) {
        case "lecture":
          newObject = ReactDOM.findDOMNode(this.refs.lectureURL).value.trim();
          break;

        case "video":
          newObject = ReactDOM.findDOMNode(this.refs.videoPath).value.trim();
          break;

        case "quizz":
          newObject = []

          for(i = 0; i < this.state.nbQuestion; ++i) {
            newObject.append(ReactDOM.findDOMNode(this.refs.question + (i+1)));
            newObject.append(ReactDOM.findDOMNode(this.refs.answer + (i+1)))
          }
          break;

        default:
          newObject = this.state.fieldValues[object];
          break;
      }
    }


    var newValues = {
      id: ReactDOM.findDOMNode(this.refs.id).value.trim(),
      name: ReactDOM.findDOMNode(this.refs.name).value.trim(),
      type:  newType,
      plane:  ReactDOM.findDOMNode(this.refs.plane).value,
      object: newObject,
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
          <select ref="type" defaultValue="lecture">
            <option value="lecture">Lecture</option>
            <option value="quizz">Quizz</option>
            <option value="video">Video</option>
          </select><br/><br/>

          <label>Plane</label><br/>
          <select ref="plane" defaultValue="1">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select><br/><br/>

          { this.renderObject() }

        </form>


        <button
          type="submit"
          onClick={this.handleSubmit.bind(this)}>Submit</button>
      </div>

    )
  }

}
