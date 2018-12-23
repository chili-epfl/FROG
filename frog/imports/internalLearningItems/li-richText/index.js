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
        const highlightedContent = highlightTargetRichText(
          editorContent,
          search
        );
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
          ref={this.ref}
          readOnly
          dataFn={dataFn}
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
    this.ref.current.onDrop(e);
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
  canDropLI: true
}: LearningItemT<{ title: string, content: string }>);
