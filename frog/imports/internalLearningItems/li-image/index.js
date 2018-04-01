// @flow
import * as React from 'react';
import fileLI from '../li-file';

export default {
  name: 'image',
  id: 'li-image',
  editable: false,
  zoomable: true,
  view: ({ data }: { data: any }) => <img src={data.url} />,
  viewThumb: ({ data }: { data: any }) => <img src={data.thumburl} />,
  create: (props: any) => (
    <fileLI.create {...props} fileTypes="image/jpeg, image/png" />
  )
};
