// @flow
import * as React from 'react';
import { ImageReload, type learningItemT } from 'frog-utils';

import { Creator } from '../li-file';

export default ({
  name: 'image',
  id: 'li-image',
  Viewer: ({ data }: { data: any }) => <ImageReload src={data.url} />,
  ThumbViewer: ({ data }: { data: any }) => <ImageReload src={data.thumburl} />,
  Creator: (props: any) => {
    return <Creator {...props} fileTypes="image/jpeg, image/png" />;
  }
}: learningItemT);
