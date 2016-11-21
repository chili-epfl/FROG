import React, { Component } from "react";
import { render } from "react-dom";


import Form from "react-jsonschema-form";


export default class QuizSchema extends Component {


  constructor(props) {
    super(props);

  }

  onSubmit() {
    console.log("yay I'm valid !");
  }

    
    schema() { return {
  "title": "MCQ",
  "type": "array",
  "items": {
    "type": "object",
    "title": "New Question",
    "required": [
        "title"
    ],
    "properties": {
      "title": {
        "type": "string",
        "title": "Question"
      },
      "answers": {
        "type": "array",
        "title": "Possible answers",
        "items": {
          "type": "object",
          "required": [
            "title"
          ],
          "properties": {
            "title": {
              "type": "string",
              "title": "Answer"
            },
            "answer": {
              "type": "boolean",
              "title": "This is an answer",
              "default": false
            }
          }
        }
      },
      "details": {
        "type": "string",
        "title": "Enter an explanation",
      }
    }
  }
}};


  log(type) {  return console.log.bind(console, type);}

  render() {
    return(
    <div>
    <Form schema={this.schema()}
          onChange={this.log("changed")}
          onSubmit={this.onSubmit.bind(this)}
          onError={this.log("errors")} />
    </div>
    );

  }

}