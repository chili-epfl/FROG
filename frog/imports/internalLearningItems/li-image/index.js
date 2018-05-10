// @flow
import * as React from 'react';
import { ImageReload, type learningItemTypeT } from 'frog-utils';

import fileLI from '../li-file';

export default ({
  name: 'image',
  id: 'li-image',
  Viewer: ({ data }: { data: any }) => <ImageReload src={data.url} />,
  ThumbViewer: ({ data }: { data: any }) => <ImageReload src={data.thumburl} />,
  Creator: (props: any) => (
    <fileLI.Creator {...props} fileTypes="image/jpeg, image/png" />
  )
}: learningItemTypeT);
