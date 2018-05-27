// @flow

import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import UploadDragDrop from './UploadDragDrop';

const UploadBar = (props: Object) => (
  <>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '50%',
        marginBottom: '20px'
      }}
    >
      <UploadDragDrop {...props} />
      <div>
        <Button
          color="primary"
          variant="raised"
          onClick={() => props.setWebcam(true)}
        >
          Open the webcam
        </Button>
      </div>
    </div>
  </>
);

UploadBar.displayName = 'UploadBar';
export default UploadBar;
