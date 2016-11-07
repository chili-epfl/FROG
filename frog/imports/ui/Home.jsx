import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Messages } from '../api/messages.js';

class Home extends Component {

  renderActiveUserList(){ return (
      this.props.activeUsers
        .map((user) => user.userId)
        .filter(onlyUnique)
        .map((userId) => Meteor.users.findOne({_id:userId}))
        // removes undefined
        .filter((user) => user)
        .map((user) => <li key={user._id}>{user.username}</li>)
  );}

  handleMessage(event) {
    event.preventDefault();
  }

  handleMessageSubmit(event) {
    event.preventDefault();
    const text = ReactDOM.findDOMNode(this.refs.msg).value.trim();
    ReactDOM.findDOMNode(this.refs.msg).value = "";
    if (text!= ""){
      Meteor.call('messages.insert', text);
    }
  }

  renderMessages() { return (
    this.props.messages.map((msg) => (
      <li key={msg._id}><b>{msg.username} on {msg.createdAt.toUTCString()}:</b> {msg.text}</li>)
    )
  )}

  getPresentCount(){
    return (
      this.props.activeUsers ? 
      this.props.activeUsers
        .map((user)=> user.userId)
        .filter(onlyUnique)
        .length : 0
    );
  }

  render() {
    return (
      <div>
        <h1>Welcome to FROG project</h1>
        <h1>Active Users</h1>
        <p> There are {this.getPresentCount()} online users.</p>
        <p> {this.renderActiveUserList()} </p>
        <h1>Chat Box</h1>
        <form className="chatbox"
          onInput={this.handleMessage.bind(this)}
          onSubmit={this.handleMessageSubmit.bind(this)}>
          <input
            type="text"
            ref ="msg"
            placeholder="Enter your message"
          /><br/><br/>
        </form>
        <p> {this.renderMessages()} </p>
      </div>
    );
  }
}

function onlyUnique(value, index, self) { 
  return self.indexOf(value) === index;
}

Home.propTypes = {
  currentUser: PropTypes.string,
  messages: PropTypes.array.isRequired,
  activeUsers: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    currentUser: Meteor.userId(),
    messages: Messages.find({}, {sort:{createdAt: -1}, limit: 10}).fetch(),
    activeUsers: Presences.find({ userId: { $exists: true }}, { fields: { state: true, userId: true } }).fetch(),
  };
}, Home);
