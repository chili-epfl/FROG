import React, { Component, PropTypes } from 'react';
import { Activities } from '../api/activities.js'; 
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
 
export default class Repository extends Component { 
  
  constructor(props) {
    super(props);
    this.state = {
      nameFilterText:"",
    }
  }

  handleFilterName(event) {
    event.preventDefault();
    const text = ReactDOM.findDOMNode(this.refs.nameFilter).value.trim();
    this.setState({nameFilterText:text});
  }

  renderListActivities() {

    return (
      this.props.activities ?
        this.props.activities
          .filter((activity) => activity.name.indexOf(this.state.nameFilterText) != -1)
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
          <form className="input-filter-name" onInput={this.handleFilterName.bind(this)}>
            <input 
              type="text" 
              ref ="nameFilter"
              placeholder="Filter by name"
            />
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