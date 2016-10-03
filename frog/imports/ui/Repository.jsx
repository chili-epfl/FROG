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

	constructor(props) {
		super(props);

		this.state = {
			isClicked: false,
		}
	}

	activityHandler(event) {
		this.setState({
			isClicked: !this.state.isClicked,
		});
	}

	renderObjectProperties(object) {
				var properties = []

				for(var prop in object) {
					if(object.hasOwnProperty(prop)) {
						properties.push(React.DOM.div(null, prop + ": "+ object[prop]));
					}
				}

		return properties;
	}


	render() {
		return (
			<div className="activity-summary">
			<li onClick={this.activityHandler.bind(this)}>{this.props.name}, type:{this.props.type}, plane:{this.props.plane}</li>
			{
				this.state.isClicked ? 
					<div className="activity-complete"><br/>{this.props.id}: {this.props.name}, type:{this.props.type}, plane:{this.props.plane} {this.renderObjectProperties(this.props.object)}<br/></div> 
					: ""
			}
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