import * as React from 'react';
import {
  type LearningItemT,
  ReactiveRichText
} from 'frog-utils';

export const FlexViewer = ({ dataFn }) => (
  <div>
    <ReactiveRichText
      path="text"
      readOnly
      dataFn={dataFn}
    />
  </div>
);

export const Editor = ({ dataFn}) => (
  <div>
    <ReactiveRichText
      path="text"
      dataFn={dataFn}
      readOnly={false}
    />
  </div>
);

export default ({
  name: 'Rich text',
  id: 'li-richText',
  dataStructure: { text: '' },
  ThumbViewer: FlexViewer,
  Viewer: FlexViewer,
  Editor
}: LearningItemT<{ title: string, content: string }>);
