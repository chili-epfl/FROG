// @flow
import * as React from 'react';
import { withState, compose } from 'recompose';
import getFA from 'font-awesome-filetypes';
import styled from 'styled-components';
import { type LearningItemT } from 'frog-utils';
import { CircularProgress } from 'material-ui/Progress';

import WebcamInterface from './WebcamInterface';
import UploadBar from './UploadBar';

const ImgButton = styled.button`
  position: relative;
  border: none;
  background: none;
  max-width: 250px;
  height: 250px;
  width: 100%;
  margin: 5px;
  padding: 0px;
  flex: 0 1 auto;
`;

export const Creator = compose(
  withState('spinner', 'setSpinner', false),
  withState('webcamOn', 'setWebcam', false)
)(
  props =>
    props.spinner ? (
      <CircularProgress />
    ) : (
      <React.Fragment>
        <UploadBar {...props} />
        {props.webcamOn && <WebcamInterface {...props} />}
      </React.Fragment>
    )
);

Creator.displayName = 'Creator';

const ThumbViewer = ({ data }: { data: any }) => (
  <ImgButton>
    <span>
      <p className="bootstrap">
        <i
          style={{ fontSize: '120px' }}
          className={'fa ' + getFA(data.ext || '')}
          aria-hidden="true"
        />
      </p>
      {data.filename}
    </span>
  </ImgButton>
);

export default ({
  name: 'file',
  id: 'li-file',
  Viewer: ({ data }: { data: any }) => (
    <a href={data.url} download={data.filename}>
      <h2>Click here to download file {data.filename}</h2>
    </a>
  ),
  ThumbViewer,
  Creator
}: LearningItemT<any>);
