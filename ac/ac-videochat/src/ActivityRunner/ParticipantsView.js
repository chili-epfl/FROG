// @flow

import * as React from 'react';

type ParticipantsViewPropsT = {
  participants: Array<any>,
  giveMic: Function
};

class ParticipantsView extends React.Component<ParticipantsViewPropsT> {
  constructor(props: ParticipantsViewPropsT) {
    super(props);
  }

  giveMic = (participantId: string) => {
    this.props.giveMic(participantId);
  };

  render() {
    return (
      <React.Fragment>
        {this.props.participants.map((p, index) => (
          <div key={p.id}>
            <span>{index + 1}</span>
            <span>{p.name}</span>
            <button onClick={() => this.giveMic(p.id)}>{'Give Mic'}</button>
          </div>
        ))}
      </React.Fragment>
    );
  }
}

export default ParticipantsView;
