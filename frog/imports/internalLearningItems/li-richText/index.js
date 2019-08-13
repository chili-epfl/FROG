import * as React from 'react';
import { get, isString } from 'lodash';
import { type LearningItemT } from '/imports/frog-utils';
import ReactiveRichText from '/imports/frog-utils/ReactiveRichTextProxy';
import { getUsername } from '/imports/api/users';

const path = 'text';

export class FlexViewer extends React.Component<*, *> {
  render() {
    const { isPlayback, data, dataFn, search, type } = this.props;
    const shouldShorten = type === 'thumbView';

    return (
      <div style={{ height: '100%' }}>
        <ReactiveRichText
          data={isPlayback ? data : undefined}
          shorten={shouldShorten && 150}
          path={path}
          readOnly
          dataFn={dataFn}
          search={search}
        />
      </div>
    );
  }
}

FlexViewer.displayName = 'FlexViewer';

export class Editor extends React.Component<*, *> {
  render() {
    const { dataFn } = this.props;
    return (
      <div style={{ height: '100%' }}>
        <ReactiveRichText
          userId={this.props.userId}
          path={path}
          dataFn={dataFn}
          autoFocus
          username={getUsername(undefined, true)}
        />
      </div>
    );
  }
}

export default ({
  name: 'Rich text',
  id: 'li-richText',
  liDataStructure: {
    [path]: {
      ops: [
        {
          insert: '\n'
        }
      ]
    }
  },
  ThumbViewer: FlexViewer,
  Viewer: FlexViewer,
  Editor,
  isEmpty: data =>
    !data?.text?.ops ||
    data.text.ops.some(
      x => typeof x.insert !== 'string' || x.insert.trim() !== ''
    ),
  search: (data, search, dataFn, isPlayback) => {
    const editorContent = isPlayback
      ? get(data, path)
      : get(dataFn.doc.data, dataFn.getMergedPath(path));
    const textContent = editorContent.ops.map(op => {
      if (isString(op.insert)) {
        return op.insert;
      }
      return '';
    });
    return textContent
      .join('')
      .toLowerCase()
      .includes(search);
  },
  disableDragging: true
}: LearningItemT<{ title: string, content: string }>);
