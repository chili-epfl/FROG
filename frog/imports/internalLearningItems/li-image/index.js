// @flow

import * as React from 'react';
import { ImageReload, type LearningItemT } from 'frog-utils';

import { Creator } from '../li-file';

export default ({
  name: 'image',
  id: 'li-image',
  Viewer: ({ data }: { data: any }) => <ImageReload src={data.url} />,
  ThumbViewer: ({ data }: { data: any }) => <ImageReload src={data.thumburl} />,
  Creator: (props: any) => (
    <Creator {...props} fileTypes="image/jpeg, image/png" />
  )
}: LearningItemT<any>);
