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

type ParticipantsViewPropsT = {
  participants: Array<any>,
  giveMic?: Function
};

class ParticipantsView extends React.Component<ParticipantsViewPropsT> {
  giveMic = (participantId: string) => {
    if (this.props.giveMic) {
      this.props.giveMic(participantId);
    }
  };

  render() {
    const { giveMic } = this.props;
    const participants = this.props.participants.sort(
      (x, y) =>
        // sort participants so that those with raised hand are first
        y.raisedHand - x.raisedHand
    );
    return (
      <div style={{ height: 'auto', overflow: 'hidden' }}>
        <Typography variant="title">Participants online</Typography>
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
              onClick={() => {
                if (giveMic) {
                  this.giveMic(p.id);
                }
              }}
            >
              <ListItemText primary={p.name} />
              <ListItemAvatar>
                <Avatar>
                  {p.raisedHand && <PanToolIcon color="primary" />}
                </Avatar>
              </ListItemAvatar>
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}

export default ParticipantsView;
