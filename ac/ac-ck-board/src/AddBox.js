import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { withState } from 'recompose';

const AddBox = ({ submitFn, text, setText }) => {
  const actions = [<FlatButton label="X" secondary onClick={submitFn} />];

  return (
    <Dialog
      title="Add item(s), separated by ;"
      modal={false}
      actions={actions}
      open
      onRequestClose={submitFn}
    >
      <div>
        <TextField
          onChange={(_, newVal) => setText(newVal)}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              submitFn(text);
            }
          }}
        />
        <p />
        <RaisedButton
          label="Add items"
          primary
          onClick={() => submitFn(text)}
        />
      </div>
    </Dialog>
  );
};

export default withState('text', 'setText', '')(AddBox);
