import React, { Component } from 'react'
import TextInput from './text_input'

const Chatmsg = ({ msg }) => 
  <li>{msg.user}: {msg.msg}</li>

  export default (props) => 
  <div>
    <h1>Chat</h1>
    <ul>
      {props.reactiveData.list.map(chatmsg => <Chatmsg msg={chatmsg.value} key={chatmsg._id} />)}
    </ul>
    <TextInput 
      callbackFn = {(e) => props.reactiveFn.listAdd({msg: e, user: props.user.name}) } />
  </div>

