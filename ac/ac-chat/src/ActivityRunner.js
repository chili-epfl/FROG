// @flow

import * as React from 'react';

import {
  type ActivityRunnerPropsT,
  type ActivityRunnerT,
  uuid,
  values
} from 'frog-utils';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextInput from './TextInput';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    background: 'white'
  },
  header: {
    flex: '0 0 auto',
    margin: '0',
    padding: '20px 0',
    display: 'flex',
    justifyContent: 'center'
  },
  inputContainer: {
    display: 'flex',
    flex: '0 0 auto',
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
  },
  robot: {
    fontStyle: 'italic'
  }
};

const Chatmsg = ({ msg, classes, LearningItem }) => (
  <div className={classes.msg}>
    <Typography variant="body2" gutterBottom color="secondary">
      {msg.user}
    </Typography>
    {msg.li ? (
      <LearningItem id={msg.li} clickZoomable type="thumbView" />
    ) : (
      <Typography
        gutterBottom
        className={msg.user === 'robot' ? classes.robot : undefined}
      >
        {msg.msg}
      </Typography>
    )}
  </div>
);

type StyledPropsT = ActivityRunnerPropsT & { classes: Object };
class ChatController extends React.Component<StyledPropsT> {
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
      classes
    } = this.props;

    return (
      <div className={classes.root}>
        <h4 className={classes.header}>{activityData.config.title}</h4>
        <div className={classes.content} ref={node => (this.node = node)}>
          {values(data)
            .sort((x, y) => x.order - y.order)
            .map(chatmsg => (
              <Chatmsg
                LearningItem={dataFn.LearningItem}
                msg={chatmsg}
                key={chatmsg.id}
                classes={classes}
              />
            ))}
        </div>

        <div className={classes.inputContainer}>
          <TextInput
            callbackFn={e => {
              const id = uuid();
              dataFn.objInsert(
                {
                  order: Object.keys(data).length + 1,
                  msg: e,
                  user: userInfo.name,
                  id
                },
                id
              );
              logger({ type: 'chat', value: e, itemId: id });
              this.scrollToBottom();
            }}
          />
          <dataFn.LearningItem
            type="create"
            dataFn={dataFn}
            meta={{
              user: userInfo.name,
              order: Object.keys(data).length + 1
            }}
            autoInsert
          />
        </div>
      </div>
    );
  }
}

const StyledChat = withStyles(styles)(ChatController);
const Chat: ActivityRunnerT = (props: ActivityRunnerPropsT) => (
  <StyledChat {...props} />
);

export default Chat;
