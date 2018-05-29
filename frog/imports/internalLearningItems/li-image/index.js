// @flow

import * as React from 'react';
import { ImageReload, type LearningItemT } from 'frog-utils';
import Paper from '@material-ui/core/Paper';

import { Creator } from '../li-file';

export default ({
  name: 'image',
  id: 'li-image',
  Viewer: ({ data }: { data: any }) => (
    <Paper elevation={24} style={{ margin: '20px' }}>
      <ImageReload style={{ margin: '10px' }} src={data.url} />
    </Paper>
  ),
  ThumbViewer: ({ data }: { data: any }) => (
    <Paper
      elevation={24}
      style={{ height: '145px', width: '145px', margin: '20px' }}
    >
      <ImageReload style={{ margin: '10px' }} src={data.thumburl} />
    </Paper>
  ),
  Creator: (props: any) => (
    <Creator {...props} fileTypes="image/jpeg, image/png" />
  )
}: LearningItemT<any>);
