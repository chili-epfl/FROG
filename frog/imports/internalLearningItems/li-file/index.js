// @flow
import * as React from 'react';
import { withState } from 'recompose';
import getFA from 'font-awesome-filetypes';
import styled from 'styled-components';
import download from 'downloadjs';

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
const Create = withState('webcamOn', 'setWebcam', false)(props => {
  return (
    <React.Fragment>
      <UploadBar {...props} />
      {props.webcamOn && <WebcamInterface {...props} />}
    </React.Fragment>
  );
});
Create.displayName = 'Create';

const viewThumb = ({ data }: { data: any }) => {
  return (
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
};

export default {
  name: 'file',
  id: 'li-file',
  editable: false,
  zoomable: true,
  view: ({ data }: { data: any }) => {
    download(data.url, data.filename);
    return <h2>Downloading file {data.filename} </h2>;
  },
  viewThumb,
  create: Create
};
