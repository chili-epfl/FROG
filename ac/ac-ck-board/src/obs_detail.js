import React from 'react';
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';

export default ({ children, closeInfoFn }) => {
  const actions = [<Button label="X" secondary onClick={closeInfoFn} />];

  return (
    <Dialog actions={actions} open onClose={closeInfoFn}>
      {children}
    </Dialog>
  );
};
