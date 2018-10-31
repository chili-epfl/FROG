import * as React from 'react';
import { get } from 'lodash';
import { type LearningItemT, ReactiveRichText } from 'frog-utils';

const path = 'text';

export const FlexViewer = ({ data, dataFn, search }) => {
  if (search) {
    const editorContent = get(dataFn.doc.data, dataFn.getMergedPath(path));
    const textContent = editorContent.ops.map(op => {
      if (typeof op.insert === 'string') {
        return op.insert;
      }
    });
    if (!textContent.join('').toLowerCase().includes(search)) {
      return null;
    }
  }
  return (
    <div>
      <ReactiveRichText data={data} path={path} readOnly dataFn={dataFn} />
    </div>
  )
};

export const Editor = ({ dataFn }) => (
  <div>
    <ReactiveRichText path={path} dataFn={dataFn} />
  </div>
);

export default ({
  name: 'Rich text',
  id: 'li-richText',
  dataStructure: { [path]: '' },
  ThumbViewer: FlexViewer,
  Viewer: FlexViewer,
  Editor
}: LearningItemT<{ title: string, content: string }>);
