import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';


export default class Activity extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isClicked: false,
    }
  }

  activityHandler(event) {
    event.preventDefault();
    this.setState({
      isClicked: !this.state.isClicked,
    });
  }

  renderObjectProperties(object, key) {
        var properties = []
        var i = 0;
        for(var prop in object) {
          if(object.hasOwnProperty(prop)) {
            //Iterates over properties of the object (as we don't know what they are)
            //These special keys are created so that they are unique for each element of the array
            properties.push(React.DOM.br({key: key + "-br" + i}));
            properties.push(React.DOM.a({key: key + "-a" + i}, prop + ": "+ object[prop]));
            ++i;
          }
        }

    return properties;
  }


  render() {
    return (
      <div className="activity-summary">
      <li onClick={this.activityHandler.bind(this)}>
        {this.props.name}, type:{this.props.type}, plane:{this.props.plane}
      </li>

      {
        //If the user has clicked on the activity, put prevous properties in addition
        //to hidden properties (returned by the renderObjectProperties)
        this.state.isClicked ?
          <div className="activity-complete">
            <br/>
              {this.props.id}: {this.props.name}, type:{this.props.type}, plane:{this.props.plane}
              {this.renderObjectProperties(this.props.object, this.props.id)}
            <br/><br/>
          </div>
          : ""
      }

      </div>
    );
  }
}
