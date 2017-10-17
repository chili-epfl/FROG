import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

export default ({ title, content, closeInfoFn }) => {
  const actions = [<FlatButton label="X" secondary onClick={closeInfoFn} />];

  return (
    <Dialog
      title={title}
      modal={false}
      actions={actions}
      open
      onRequestClose={closeInfoFn}
    >
      <div>{content}</div>
    </Dialog>
  );
};
