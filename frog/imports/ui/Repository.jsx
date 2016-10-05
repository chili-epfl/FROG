import React, { Component, PropTypes } from 'react';
import { Activities } from '../api/activities.js';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';

export default class Repository extends Component {

  constructor(props) {
    super(props);
    this.state = {
      nameFilterText:"",
      //The elements in the following lists are the attributes of the activities
      //we want to filter
      plane: [],
      type: [],
    }
  }

  toggleFilterPlane(planeNumber) {
    event.preventDefault();
    //If the plane planeNumber is already in the filter list, removes it from
    //the list, otherwise add it in the list
    let index = this.state.plane.indexOf(planeNumber);
    let newPlane = this.state.plane;

    if(index != -1) {
      newPlane = newPlane.filter(num => num != planeNumber);
    } else {
      newPlane.push(planeNumber);
    }

    this.setState({
      plane: newPlane,
    });
  }

  toggleFilterType(value) {
    event.preventDefault();
    //If the type value is already in the filter list, removes it from the list
    //otherwise add it in the list
    let index = this.state.type.indexOf(value);
    let newType = this.state.type;

    if(index != -1) {
      newType = newType.filter(val => val != value);
    } else {
      newType.push(value);
    }

    this.setState({
      type: newType,
    });
  }

  createFilterBoxPlane(value) {
    //Creates the checkboxes for the plane filter, the box is checked if the
    //user wants to show the activities of the given plane
    return (
      <span>
        <input
          type="checkbox"
          readOnly
          checked={this.state.plane.indexOf(value) == -1}
          onClick={this.toggleFilterPlane.bind(this, value)}
        /> {value}
      </span>
    );
  }

  createFilterBoxType(value) {
    //Creates the checkboxes for the type filter, the box is checked if the
    //user wants to show the activities of the given type
    return (
      <span>
        <input
          type="checkbox"
          readOnly
          checked={this.state.type.indexOf(value) == -1}
          onClick={this.toggleFilterType.bind(this, value)}
        /> {value}
      </span>
    );
  }



  handleFilterName(event) {
    event.preventDefault();
    const text = ReactDOM.findDOMNode(this.refs.nameFilter).value.trim();
    this.setState({nameFilterText:text});
  }

  handleFilterNameSubmit(event) {
    event.preventDefault();
  }

  renderListActivities() {

    var typesLowerCase = this.state.type.map(type => type.toLowerCase())

    return (
      this.props.activities ?
        this.props.activities
          //Filters activities with a name containing the text from the nameFilter input.
          .filter((activity) => activity.name.indexOf(this.state.nameFilterText) != -1)
          //Filters activities with respect to the list of filters
          .filter((activity) => this.state.plane.indexOf(activity.plane) == -1)
          .filter((activity) => typesLowerCase.indexOf(activity.type) == -1)
          .map ((activity) => (
            <Activity
              key={activity._id}
              id={activity._id}
              type={activity.type}
              name={activity.name}
              plane={activity.plane}
              object={activity.object} />
          )) : <li>No activity</li>
    );
  }

  render() {

    //To add a new filter for the planes or types, just add the corresponding
    //checkbox by using a createFilterBox and the rest is taken care of by
    //the code.
    return (
        <div>
          <h2>Activities:</h2>

          <form className="input-filter-name"
            onInput={this.handleFilterName.bind(this)}
            onSubmit={this.handleFilterNameSubmit.bind(this)}>

            <input
              type="text"
              ref ="nameFilter"
              placeholder="Filter by name"
            /><br/><br/>

            <div className="filters">
            Show only plane(s):
              {this.createFilterBoxPlane(1)}
              {this.createFilterBoxPlane(2)}
              {this.createFilterBoxPlane(3)}
              <br/>
            Show only the following type(s) of activities:
              {this.createFilterBoxType("Lecture")}
              {this.createFilterBoxType("Quizz")}
              {this.createFilterBoxType("Video")}
            </div>

          </form>
          <ul>
            {this.renderListActivities()}
          </ul>
        </div>
      );
  }


}

class Activity extends Component {

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

Repository.propTypes = {
  activities: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    activities: Activities.find({}).fetch(),
  };
}, Repository);
