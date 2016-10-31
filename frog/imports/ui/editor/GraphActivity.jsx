import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Activities } from '../../api/activities.js';

/*
Class used to display an activity (inside a graph)
*/
export default class GraphActivity extends Component {

  constructor(props) {
    super(props);
    this.state = {
      nameFilterText:"",
    }
  }


  aa() {
    return "a";
  }

  getNode() {
    return this.refs.activitiesChoice.value;
  }

  getEdge() {
    if(this.props.followingRef != null)
      return ({
        from:this.refs.activitiesChoice.value,
        toRef:this.props.followingRef, //is unknown at this step
        operator:this.refs.operator,
      });
    else return null;
  }

  renderAllActivitiesChoice() {
    return(
      <select ref="activitiesChoice">
        {this.props.activities
            .filter((activity) => activity.name.toLowerCase()
                      .indexOf(this.state.nameFilterText.toLowerCase()) != -1)
            .map((activity, i) => 
              <option 
                key={i} 
                value={activity._id}>{"Name: " + activity.name + " (ID: " + activity._id + ")" } 
              </option>
            )
        }
      </select>
    );
  }

  handleFilterName(event) {
    event.preventDefault();
    this.setState({nameFilterText:event.target.value.trim()});
  }

  render() {
    return (
      <div >
          <label>Activity {this.props.id + 1}:</label><br/>
          <input
              type="text"
              ref ="nameFilter"
              placeholder="Filter by name" 
              onChange = {this.handleFilterName.bind(this)}
              onSubmit = {this.handleFilterName.bind(this)}/>
          {this.renderAllActivitiesChoice()}
        <button
          type="delete"
          onClick={this.props.callBack.bind(this, this.props.refID)}>&times;</button><br/>
        {(this.props.followingRef != null) ? 
          <input
              type="text"
              ref ="operator"
              placeholder={"Operator to Activity " + (this.props.id + 2)}/> 
              : ""}<br/><br/>
      </div>
      );
  }
}

GraphActivity.propTypes = {
  activities: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    activities: Activities.find({}).fetch(),
  };
}, GraphActivity);
