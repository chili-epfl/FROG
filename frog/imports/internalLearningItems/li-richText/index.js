import * as React from 'react';
import { get, isString } from 'lodash';
import {
  type LearningItemT,
  ReactiveRichText,
  highlightTargetRichText
} from 'frog-utils';

const path = 'text';

export const FlexViewer = ({ isPlayback, data, dataFn, search, type }) => {
  const shouldShorten = type === 'thumbView';

  if (search) {
    const editorContent = isPlayback
      ? get(data, path)
      : get(dataFn.doc.data, dataFn.getMergedPath(path));
    const textContent = editorContent.ops.map(op => {
      if (isString(op.insert)) {
        return op.insert;
      }
      return '';
    });
    if (
      !textContent
        .join('')
        .toLowerCase()
        .includes(search)
    ) {
      return null;
    } else {
      const highlightedContent = highlightTargetRichText(editorContent, search);
      return (
        <div>
          <ReactiveRichText
            data={{ [path]: highlightedContent }}
            shorten={shouldShorten && 150}
            path={path}
            readOnly
            dataFn={dataFn}
          />
        </div>
      );
    }
  }
  return (
    <div>
      <ReactiveRichText
        data={isPlayback ? data : undefined}
        shorten={shouldShorten && 150}
        path={path}
        readOnly
        dataFn={dataFn}
      />
    </div>
  );
};

FlexViewer.displayName = 'FlexViewer';

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
