// @flow

import React from 'react';

import UploadDragDrop from './UploadDragDrop';
import UploadCamera from './UploadCamera';

export default ({ data, dataFn, uploadFn, userInfo }: Object) =>
  <div style={{ width: '100%', height: '81px' }}>
    <div style={{ width: '100%', height: '1px', backgroundColor: 'black' }} />
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingTop: '10px',
      }}
    >
      <UploadDragDrop
        data={data}
        dataFn={dataFn}
        userInfo={userInfo}
        uploadFn={uploadFn}
      />
      <UploadCamera />
    </div>
  </div>;
