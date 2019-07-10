// @flow

import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { Modal } from './components/Modal';

type ModalPasswordPropsT = {
  actualPassword: string,
  callback: boolean => void,
  hideModal: () => void
};

async function sha256(message) {
  const msgBuffer = new TextEncoder('utf-8').encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map(b => ('00' + b.toString(16)).slice(-2))
    .join('');
  return hashHex;
}

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
  const validatePassword = async () => {
    const hash = await sha256(password);
    if (hash === actualPassword) {
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
      <FormControl error={error}>
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
