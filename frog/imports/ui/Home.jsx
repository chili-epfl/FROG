import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Messages } from '../api/messages.js';

class Home extends Component {

  renderUsers(){
    return (
      this.props.presentUsers ? 
      this.props.presentUsers
        .map((user)=> user.userId)
        .filter(onlyUnique)
        .map((userId) =>
          <li key={userId}>{Meteor.users.findOne({_id: userId}).username}</li>
      ) : <li>empty</li>
    );
  }

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

  renderMessages(){
    return (
      this.props.messages ?
      this.props.messages.map((msg) => (
        <li key={msg._id}><b>{msg.username} on {msg.createdAt.toUTCString()}:</b> {msg.text}</li>))
      : <li>No Messages yet</li>
    );
  }

  getPresentCount(){
    return (
      this.props.presentUsers ? 
      this.props.presentUsers
        .map((user)=> user.userId)
        .filter(onlyUnique)
        .length : 0
    );
  }

  render() {
    return (
      <div>
        <p>Welcome to FROG project</p>
        <h3>Active Users:</h3>
        <p> There are {this.getPresentCount()} online users.</p>
        <p> {this.renderUsers()} </p>
        <h3>Chat Box:</h3>
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
  presentUsers: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    currentUser: Meteor.userId(),
    messages: Messages.find({}, {sort:{createdAt: -1}, limit: 10}).fetch(),
    presentUsers: Presences.find({ userId: { $exists: true }}, { fields: { state: true, userId: true }}).fetch(),
  };
}, Home);
