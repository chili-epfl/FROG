// @flow

import React from 'react';
import Button from '@material-ui/core/Button';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
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
          variant="fab"
          color="secondary"
          onClick={() => props.setWebcam(true)}
        >
          <PhotoCameraIcon />
        </Button>
      </div>
    </div>
  </>
);

UploadBar.displayName = 'UploadBar';
export default UploadBar;
