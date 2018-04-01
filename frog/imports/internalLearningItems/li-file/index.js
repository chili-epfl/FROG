// @flow
import * as React from 'react';
import { withState } from 'recompose';
import WebcamInterface from './WebcamInterface';
import UploadBar from './UploadBar';

const Create = withState('webcamOn', 'setWebcam', false)(props => {
  return (
    <React.Fragment>
      <UploadBar {...props} />
      {props.webcamOn && <WebcamInterface {...props} />}
    </React.Fragment>
  );
});
Create.displayName = 'Create';

export default {
  name: 'file',
  id: 'li-file',
  editable: false,
  zoomable: true,
  view: ({ data }: { data: any }) => <img src={data.url} />,
  viewThumb: ({ data }: { data: any }) => <img src={data.thumburl} />,
  create: Create
};
