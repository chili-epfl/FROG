// @flow

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { type ActivityRunnerT, uuid } from 'frog-utils';

import TextInput from './TextInput';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
  },
  header: {
    flex: '0 0 auto',
    margin: '0',
    boxShadow: '0 4px 6px 0 hsla(0,0%,0%,0.2)',
    padding: '20px 0',
    color: 'white',
    background: 'rgb(71, 118, 230)',
    display: 'flex',
    justifyContent: 'center'
  },
  inputContainer: {
    display: 'flex',
    flex: '0 0 auto',
    flexDirection: 'column',
    background: '#EAEAEA',
    justifyContent: 'center',
    padding: '20px'
  },
  content: {
    flex: '1 1 auto',
    overflowY: 'auto',
    listStyle: 'none',
    padding: '0 20px'
  },
  textInput: {
    fontSize: '12pt',
    padding: '20px',
    borderRadius: '5px',
    border: '1px solid lightgrey',
    resize: 'none'
  },
  msg: {
    margin: '20px 0',
    padding: '15px',
    border: '1px solid #e0e0e0',
    borderRadius: '200px 200px 200px 0px',
    width: 'fit-content'
  },
  user: {
    fontSize: '10pt',
    paddingBottom: '2px',
    color: '#0606066b'
  }
};

const Chatmsg = ({ msg }) => (
  <div style={styles.msg}>
    <div style={styles.user}>{msg.user}</div>
    {msg.msg}
  </div>
);

export default class Chat extends Component {
  ref: any;

  constructor(props: Object) {
    super(props);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  scrollToBottom = () => {
    const scrollHeight = this.ref.scrollHeight;
    const height = this.ref.clientHeight;
    const maxScrollTop = scrollHeight - height;
    ReactDOM.findDOMNode(this.ref).scrollTop =
      maxScrollTop > 0 ? maxScrollTop : 0;
  };

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    const { activityData, data, dataFn, userInfo, logger } = this.props;

    return (
      <div style={styles.root}>
        <h4 style={styles.header}>{activityData.config.title}</h4>
        <div style={styles.content} ref={ref => (this.ref = ref)}>
          {data.map(chatmsg => <Chatmsg msg={chatmsg} key={chatmsg.id} />)}
        </div>

        <div style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            callbackFn={e => {
              const id = uuid();
              dataFn.listAppend({ msg: e, user: userInfo.name, id });
              logger({ type: 'chat', value: e, itemId: id });
              this.scrollToBottom();
            }}
          />
        </div>
      </div>
    );
  }
}
