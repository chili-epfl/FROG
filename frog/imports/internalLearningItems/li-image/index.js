// @flow

import * as React from 'react';
import { ImageReload, type LearningItemT } from 'frog-utils';

import ToolBar from './ToolBar';
import { Creator } from '../li-file';

const ImageEditor = props => (
  <div>
    <ToolBar data={props.data} dataFn={props.dataFn} />
    <ImageReload
      style={{
        maxWidth: '95%',
        maxHeight: '95%',
        margin: '10px',
        transform: 'rotate(' + (props.data.rotation || 0) + 'deg)'
      }}
      src={props.data.url}
    />
  </div>
);

export default ({
  name: 'image',
  id: 'li-image',
  Viewer: ({ data, search }: { data: any, search?: string }) =>
    search ? null : (
      <ImageReload
        style={{
          maxWidth: '95%',
          maxHeight: '95%',
          margin: '10px',
          transform: 'rotate(' + (data.rotation || 0) + 'deg)'
        }}
        src={data.url}
      />
    ),
  ThumbViewer: ({ data, search }: { data: any, search?: string }) =>
    search ? null : (
      <ImageReload
        style={{
          margin: '10px',
          transform: 'rotate(' + (data.rotation || 0) + 'deg)'
        }}
        src={data.thumburl}
      />
    ),
  Creator: (props: any) => (
    <Creator {...props} fileTypes="image/jpeg, image/png" />
  ),
  Editor: ImageEditor
}: LearningItemT<any>);
