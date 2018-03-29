import React from 'react';
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';

export default ({ title, content, closeInfoFn }) => {
  const actions = [<Button label="X" secondary onClick={closeInfoFn} />];

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
