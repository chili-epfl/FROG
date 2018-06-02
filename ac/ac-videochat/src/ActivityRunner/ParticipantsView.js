// @flow

import * as React from 'react';

type ParticipantsViewPropsT = {
  participants: Array<any>,
  giveMic?: Function
};

const styles = {
  div: {
    display: 'inline'
  }
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
      <React.Fragment>
        {participants.map((p, index) => (
          <div key={p.id}>
            <span>{index + 1}</span>
            <span>{'  ' + p.name + '   '}</span>
            {p.raisedHand && (
              <div style={styles.div}>
                <span>Raised Hand </span>
                {giveMic && (
                  <button onClick={() => this.giveMic(p.id)}>Give Mic</button>
                )}
              </div>
            )}
          </div>
        ))}
      </React.Fragment>
    );
  }
}

export default ParticipantsView;
