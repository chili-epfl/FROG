// @flow
import * as React from 'react';
import fileLI from '../li-file';
import { ImageReload } from 'frog-utils';

export default {
  name: 'image',
  id: 'li-image',
  editable: false,
  zoomable: true,
  view: ({ data }: { data: any }) => <ImageReload src={data.url} />,
  viewThumb: ({ data }: { data: any }) => <ImageReload src={data.thumburl} />,
  create: (props: any) => (
    <fileLI.create {...props} fileTypes="image/jpeg, image/png" />
  )
};
