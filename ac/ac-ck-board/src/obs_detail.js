import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

export default ({ observation, closeInfoFn }) => {
  const actions = [<FlatButton label="X" secondary onClick={closeInfoFn} />];

  return (
    <Dialog
      title={observation.title}
      modal={false}
      actions={actions}
      open
      onRequestClose={closeInfoFn}
    >
      <div>{observation.content}</div>
    </Dialog>
  );
};
