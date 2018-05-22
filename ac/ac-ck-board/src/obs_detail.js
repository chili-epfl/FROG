import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

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
