import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

export default class Home extends Component {

  renderUsers(){
    return (
      this.props.onlineUsers ? 
      this.props.onlineUsers.map((user)=>(
        <li key={user._id}>{user._id}:{user.username}</li>
      )) : <li>empty</li>
    );
  }

  render() {
    return (
      <div>
          <p>Welcome to FROG project</p>
          <h2>Active Users:</h2>
          <p> There are {this.props.onlineCount} online users.</p>
          <p> {this.renderUsers()} </p>
        </div>
      );
  }

}

Home.propTypes = {
  onlineUsers: PropTypes.array.isRequired,
  onlineCount: PropTypes.number,
};

export default createContainer(() => {
  return {
    onlineUsers: Meteor.users.find({ "status.online": true }),
    onlineCount: Meteor.users.find({ "status.online": true }).count(),
  };
}, Home);