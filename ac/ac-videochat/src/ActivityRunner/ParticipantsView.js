// @flow

import * as React from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@material-ui/core';
import PanToolIcon from '@material-ui/icons/PanTool';
import Videocam from '@material-ui/icons/Videocam';
import { uniqBy } from 'lodash';

const styles = {
  buttonBoxS: {
    border: 'none',
    color: 'white',
    padding: '20px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '50%'
  }
};

type ParticipantsViewPropsT = {
  participants: Array<any>,
  giveMic?: Function,
  isTeacher: Function,
  raiseHand?: Function,
  myId: string
};

class ParticipantsView extends React.Component<
  ParticipantsViewPropsT,
  { raiseHand: boolean }
> {
  state = { raiseHand: false };

  giveMic = (participantId: string) => {
    if (this.props.giveMic) {
      this.props.giveMic(participantId);
    }
  };

  sortParticipants = (a: any, b: any) => {
    const t = this.props.isTeacher(b.name) - this.props.isTeacher(a.name);
    if (t < 0) return -1;
    if (t > 0) return 1;
    const stream = b.streaming - a.streaming;
    if (stream < 0) return -1;
    if (stream > 0) return 1;
    return b.raisedHand - a.raisedHand;
  };

  raiseHand = () => {
    if (this.props.raiseHand) {
      this.props.raiseHand(!this.state.raiseHand);
      this.setState({ raiseHand: !this.state.raiseHand });
    }
  };

  componentWillReceiveProps(nextProps: any) {
    const p = nextProps.participants.find(x => x.id === this.props.myId);
    if (p && p.streaming) {
      this.setState({ raiseHand: false });
    }
  }

  render() {
    const { giveMic, raiseHand } = this.props;
    const participants = uniqBy(this.props.participants, 'id').sort(
      this.sortParticipants
    );
    return (
      <div style={{ height: 'auto', overflow: 'hidden' }}>
        <Typography variant="title">Participants online</Typography>
        {raiseHand && (
          <button style={styles.buttonBoxS} onClick={this.raiseHand}>
            <PanToolIcon
              color={this.state.raiseHand ? 'secondary' : 'primary'}
            />
          </button>
        )}

        <List
          dense
          style={{
            display: 'inline-block',
            maxHeight: '100%',
            overflow: 'auto'
          }}
        >
          {participants.map(p => (
            <ListItem
              key={p.id}
              style={{ cursor: p.raisedHand ? 'pointer' : 'auto' }}
              onClick={() => {
                if (giveMic) {
                  this.giveMic(p.id);
                }
              }}
            >
              <ListItemText primary={p.name} />
              {((p.raisedHand && p.id !== this.props.myId) ||
                (p.id === this.props.myId && this.state.raiseHand)) && (
                <ListItemAvatar>
                  <Avatar>
                    <PanToolIcon color="primary" />
                  </Avatar>
                </ListItemAvatar>
              )}
              {p.streaming && (
                <ListItemAvatar>
                  <Avatar>
                    <Videocam
                      color={
                        this.props.isTeacher(p.name) ? 'primary' : 'secondary'
                      }
                    />
                  </Avatar>
                </ListItemAvatar>
              )}
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}

export default ParticipantsView;
