// @flow

import * as React from 'react';
import { ImageReload, type LearningItemT } from 'frog-utils';
import Paper from '@material-ui/core/Paper';

import ToolBar from './ToolBar';
import { Creator } from '../li-file';

const ImageEditor = props => (
  <Paper
    elevation={24}
    style={{
      margin: '20px',
      overflow: 'scroll',
      display: 'flex',
      flexDirection: 'column'
    }}
  >
    <ToolBar data={props.data} dataFn={props.dataFn} />
    <ImageReload
      style={{
        margin: '10px',
        width: 'fit-content',
        height: 'fit-content',
        transform: 'rotate(' + (props.data.rotation || 0) + 'deg)'
      }}
      src={props.data.url}
    />
  </Paper>
);

export default ({
  name: 'image',
  id: 'li-image',
  Viewer: ({ data }: { data: any }) => (
    <Paper elevation={24} style={{ margin: '20px' }}>
      <ImageReload
        style={{
          margin: '10px',
          transform: 'rotate(' + (data.rotation || 0) + 'deg)'
        }}
        src={data.url}
      />
    </Paper>
  ),
  ThumbViewer: ({ data }: { data: any }) => (
    <Paper elevation={24} style={{ height: 'inherit', width: 'inherit' }}>
      <ImageReload
        style={{
          margin: '10px',
          transform: 'rotate(' + (data.rotation || 0) + 'deg)'
        }}
        src={data.thumburl}
      />
    </Paper>
  ),
  Creator: (props: any) => (
    <Creator {...props} fileTypes="image/jpeg, image/png" />
  ),
  Editor: ImageEditor
}: LearningItemT<any>);
