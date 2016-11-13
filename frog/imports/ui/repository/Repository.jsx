import React, { Component, PropTypes } from 'react';
import { Activities } from '../../api/activities.js';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import  Activity  from './../Activities.jsx';
import DisplayActivities from './DisplayActivities.jsx';
import DisplayGraphs from './DisplayGraphs.jsx';

export default class Repository extends Component {

  constructor(props) {
    super(props);

    this.state = {
      content: "activity",
    }
  }

  handleRadio(event) {
    event.preventDefault();
    this.setState({content: event.target.value});
  }

  render() {
    return (
      <div>
        <h1>Select what to display </h1>
        <form>
          <input
            type="radio"
            name="contentSelector"
            value="activity"
            checked
            onChange={this.handleRadio.bind(this)}/>Activities

          <input
            type="radio"
            name="contentSelector"
            value="graph"
            onChange={this.handleRadio.bind(this)}/>Graphs

        </form>

        {this.state.content == 'activity' ?
          <DisplayActivities key='activity'/> : <DisplayGraphs key='graph'/>}
      </div>
    );
  }

}
/*
  constructor(props) {
    super(props);
    this.state = {
      nameFilterText:"",

      plane: {
        1: true,
        2: true,
        3: true,
      },
      type: {
        lecture: true,
        quiz: true,
        video: true,
      },
    }
  }



  toggleFilter(filter, value) {

    if (filter == "type") {
      var updatedType = this.state.type;
      updatedType[value] = !updatedType[value];

      this.setState({
        type: updatedType,
      });

    } else {
      var updatedPlane = this.state.plane;
      updatedPlane[value] = !updatedPlane[value];

      this.setState({
        plane: updatedPlane,
      });
    }
  }

  createFilterBoxPlane(value) {
    //Creates the checkboxes for the plane filter, the box is checked if the
    //user wants to show the activities of the given plane
    return (
      <span>
        <input
          type="checkbox"
          readOnly
          checked={this.state.plane[value]}
          onClick={this.toggleFilter.bind(this, "plane", value)}
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
          checked={this.state.type[value.toLowerCase()]}
          onClick={this.toggleFilter.bind(this, "type", value.toLowerCase())}
        /> {value}
      </span>
    );
  }


  handleFilterNameSubmit(event) {
    event.preventDefault();
  }

  handleFilterNameChange(event) {
    event.preventDefault();
    this.setState({nameFilterText:event.target.value.trim()});
  }

  renderListActivities() {


    return (
      this.props.activities ?
        this.props.activities
          //Filters activities with a name containing the text from the nameFilter input.
          .filter((activity) => activity.name.toLowerCase()
            .indexOf(this.state.nameFilterText.toLowerCase()) != -1)
          //Filters activities with respect to the list of filters
          .filter((activity) => this.state.type[activity.type])
          .filter((activity) => this.state.plane[activity.plane])
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

    return (
        <div>
          <h2>Activities:</h2>

          <form className="input-filter-name"
            onSubmit={this.handleFilterNameSubmit.bind(this)}>

            <input
              type="text"
              ref ="nameFilter"
              placeholder="Filter by name"
              onChange={this.handleFilterNameChange.bind(this)}
            /><br/><br/>

            <div className="filters">
            Show only plane(s):
              {this.createFilterBoxPlane(1)}
              {this.createFilterBoxPlane(2)}
              {this.createFilterBoxPlane(3)}
              <br/>
            Show only the following type(s) of activities:
              {this.createFilterBoxType("Lecture")}
              {this.createFilterBoxType("Quiz")}
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


Repository.propTypes = {
  activities: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    activities: Activities.find({}).fetch(),
  };
}, Repository);
*/
