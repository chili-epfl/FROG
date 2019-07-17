// @flow

import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { Modal } from '/imports/frog-utils';

type ModalPasswordPropsT = {
  actualPassword: string,
  callback: boolean => void,
  hideModal: () => void
};

export default ({
  actualPassword,
  callback,
  hideModal
}: ModalPasswordPropsT) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const cancelAction = () => {
    callback(false);
    hideModal();
  };
  const validatePassword = () => {
    if (password === actualPassword) {
      callback(true);
      hideModal();
    } else {
      setError(true);
    }
  };
  return (
    <Modal
      title="Password required"
      actions={[
        { title: 'Cancel', callback: cancelAction },
        {
          title: 'OK',
          callback: () => {
            validatePassword();
          }
        }
      ]}
    >
      <FormControl
        error={error}
        onKeyDown={e => {
          if (e.keyCode === 13) validatePassword();
        }}
      >
        <TextField
          type="password"
          margin="normal"
          onChange={x => {
            setPassword(x.target.value);
            setError(false);
          }}
          error={error}
          label={error ? 'Incorrect Password' : ''}
        />
      </FormControl>
    </Modal>
  );
};
