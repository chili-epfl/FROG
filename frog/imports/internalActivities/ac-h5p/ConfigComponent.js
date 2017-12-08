import { Meteor } from 'meteor/meteor';
import React from 'react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';
import { uploadFile } from '/imports/api/openUploads';
import { uuid, A } from 'frog-utils';

const onDrop = (file, setConfigData) => {
  const fr = new FileReader();
  fr.onloadend = loaded => {
    const imageBuffer = Buffer.from(loaded.currentTarget.result);
    const id = uuid();
    uploadFile(imageBuffer, id).then(() => {
      setConfigData({ fileId: id });
      Meteor.call('h5p.unzip', id);
    });
  };
  fr.readAsArrayBuffer(file[0]);
};

const ConfigComponent = ({ configData = {}, setConfigData }) => (
  <div style={{ marginTop: '20px' }}>
    {configData.fileId ? (
      <div>
        <h1>H5P package uploaded successfully</h1>
        <A onClick={() => setConfigData({})}>Remove file</A>
        <hr />
      </div>
    ) : (
      <Dropzone
        onDropAccepted={file => onDrop(file, setConfigData)}
        style={{
          width: '50%',
          border: '2px dashed rgb(102, 102, 102)',
          borderRadius: '5px',
          padding: '10px',
          minWidth: 'fit-content'
        }}
      >
        <TextStyled>Drop H5P package here / Click to upload</TextStyled>
      </Dropzone>
    )}
  </div>
);

const TextStyled = styled.h3`
  position: relative;
  top: 55%;
  margin: 0 auto;
  transform: translateY(-50%);
`;

export default ConfigComponent;
