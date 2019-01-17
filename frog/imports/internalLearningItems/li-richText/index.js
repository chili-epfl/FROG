import * as React from 'react';
import { get, isString } from 'lodash';
import {
  type LearningItemT,
  ReactiveRichText,
  highlightTargetRichText
} from 'frog-utils';

const path = 'text';

export class FlexViewer extends React.Component<*, *> {
  render() {
    const { isPlayback, data, dataFn, search, type } = this.props;
    const shouldShorten = type === 'thumbView';

    return (
      <div>
        <ReactiveRichText
          data={isPlayback ? data : undefined}
          shorten={shouldShorten && 150}
          path={path}
          ref={this.ref}
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
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  onDrop(e) {
    if (this?.ref?.current?.onDrop) {
      this.ref.current.onDrop(e);
    }
  }

  render() {
    const { dataFn } = this.props;
    return (
      <div style={{ height: '100%' }}>
        <ReactiveRichText
          userId={this.props.userId}
          ref={this.ref}
          path={path}
          dataFn={dataFn}
        />
      </div>
    );
  }
}

export default ({
  name: 'Rich text',
  id: 'li-richText',
  dataStructure: { [path]: '' },
  ThumbViewer: FlexViewer,
  Viewer: FlexViewer,
  Editor,
  canDropLI: true,
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
  }
}: LearningItemT<{ title: string, content: string }>);
