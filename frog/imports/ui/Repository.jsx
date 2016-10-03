import React, { Component, PropTypes } from 'react';
import { Activities } from '../api/activities.js'; 
import { createContainer } from 'meteor/react-meteor-data';
 
export default class Repository extends Component { 
  

	renderListActivities() {
		return (
			this.props.activities ?
				this.props.activities.map ((activity) => (
						<Activity key={activity._id} id={activity._id} type={activity.type} name={activity.name} plane={activity.plane} object={activity.object} />
					)) : <li>No activity</li>
		);
	}

	render() {
		return (
				<div>
					<h2>Activities:</h2>
					<ul>
						{this.renderListActivities()}
					</ul>
				</div>
			);
	}


}

class Activity extends Component {


	render() {
		return (
			<div className="activity-summary">
			<li>{this.props.name}, type:{this.props.type}, plane:{this.props.plane}</li>
			</div>
		);
	}
}

export default Repository

Repository.propTypes = {
  activities: PropTypes.array.isRequired,
};
 
export default createContainer(() => {
  return {
    activities: Activities.find({}).fetch(),
  };
}, Repository);