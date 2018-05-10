// @flow
import * as React from 'react';
import { withState } from 'recompose';
import getFA from 'font-awesome-filetypes';
import styled from 'styled-components';
import download from 'downloadjs';
import { type learningItemTypeT } from 'frog-utils';

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
const Creator = withState('webcamOn', 'setWebcam', false)(props => (
  <React.Fragment>
    <UploadBar {...props} />
    {props.webcamOn && <WebcamInterface {...props} />}
  </React.Fragment>
));

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
  Viewer: ({ data }: { data: any }) => {
    download(data.url, data.filename);
    return <h2>Downloading file {data.filename} </h2>;
  },
  ThumbViewer,
  Creator
}: learningItemTypeT);
