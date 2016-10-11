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

        class Property extends Component {
          render() {
            return(
              <div>
                <br/>
                <a>{this.props.data.prop + ": " + this.props.data.value}</a>
              </div>
            );
          }
        }

        return (Object.keys(object).map((prop) =>(
          <Property key={prop} data = {{prop:prop, value:object[prop]}} />
        )));

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
            <br/>
          </div>
          : ""
      }

      </div>
    );
  }
}
