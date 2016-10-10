import React, { Component, PropTypes } from 'react';
import { Activities } from '../../api/activities.js';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import  Activity  from './Activity.jsx';

export default class Repository extends Component {

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
      this.state.type[value] = !this.state.type[value];

      this.setState({
        type: this.state.type,
      });

    } else {
      this.state.plane[value] = ! this.state.plane[value];

      this.setState({
        plane: this.state.plane,
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

  handleFilterName(event) {
    event.preventDefault();
    const text = ReactDOM.findDOMNode(this.refs.nameFilter).value.trim();
    this.setState({nameFilterText:text});
  }

  handleFilterNameSubmit(event) {
    event.preventDefault();
  }

  renderListActivities() {

    //var typesLowerCase = this.state.type.map(type => type.toLowerCase())

    return (
      this.props.activities ?
        this.props.activities
          //Filters activities with a name containing the text from the nameFilter input.
          .filter((activity) => activity.name.toLowerCase()
            .indexOf(this.state.nameFilterText) != -1)
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
