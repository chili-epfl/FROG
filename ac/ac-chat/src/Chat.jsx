// @flow

import * as React from 'react';

import { type ActivityRunnerT, uuid } from 'frog-utils';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import TextInput from './TextInput';
import styles from './styles';

const RenderMsg = ({ from, content }) => (
  <React.Fragment>
    <Typography variant="body2" gutterBottom color="secondary">
      {from}
    </Typography>
    {content}
  </React.Fragment>
);

const Chatmsg = ({ LearningItem, msg, classes }) => (
  <div className={classes.msg}>
    {typeof msg === 'string' ? (
      <LearningItem
        key={msg}
        id={msg}
        clickZoomable
        type="viewThumb"
        render={({ meta, children }) => (
          <RenderMsg from={meta.user} content={children} />
        )}
      />
    ) : (
      <RenderMsg
        from={msg.user}
        content={<Typography gutterBottom>{msg.msg}</Typography>}
      />
    )}
  </div>
);

class ChatController extends React.Component<ActivityRunnerT> {
  node: any;

  scrollToBottom = () => {
    const scrollHeight = this.node.scrollHeight;
    const height = this.node.clientHeight;
    const maxScrollTop = scrollHeight - height;
    const domNode = this.node;
    if (domNode instanceof Element) {
      domNode.scrollTop = Math.max(maxScrollTop, 0);
    }
  };
  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    const {
      activityData,
      data,
      dataFn,
      userInfo,
      logger,
      classes,
      LearningItem
    } = this.props;

    return (
      <div className={classes.root}>
        <h4 className={classes.header}>{activityData.config.title}</h4>
        <div className={classes.content} ref={node => (this.node = node)}>
          {data.map(chatmsg => (
            <Chatmsg
              LearningItem={LearningItem}
              msg={chatmsg}
              key={chatmsg.id || chatmsg}
              classes={classes}
            />
          ))}
        </div>

        <div className={classes.inputContainer}>
          <TextInput
            callbackFn={e => {
              const id = uuid();
              dataFn.listAppend({ msg: e, user: userInfo.name, id });
              logger({ type: 'chat', value: e, itemId: id });
              this.scrollToBottom();
            }}
          />
          <LearningItem
            type="create"
            dataFn={dataFn}
            meta={{ user: userInfo.name }}
            onCreate={e => dataFn.listAppend(e)}
          />
        </div>
      </div>
    );
  }
}

const Chat = withStyles(styles)(ChatController);

export default Chat;
