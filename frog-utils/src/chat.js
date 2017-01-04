import React, { Component } from 'react'
import TextInput from './text_input'

const Chatmsg = ({ msg }) => 
  <li>{msg.user}: {msg.msg}</li>

export default (props) => 
  <div>
    <h4>Chat</h4>
    <ul>
      {props.reactiveData.list.map(chatmsg => <Chatmsg msg={chatmsg.value} key={chatmsg._id} />)}
    </ul>
    <TextInput 
      callbackFn = {(e) => {
        props.reactiveFn.listAdd({msg: e, user: props.user.name})
        props.logger({chat: e})
      }} 
    />
  </div>

