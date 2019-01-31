import * as React from 'react';
import { get, isString } from 'lodash';
import {
  type LearningItemT,
  ReactiveRichText,
  highlightTargetRichText
} from 'frog-utils';

export class FlexViewer extends React.Component<*, *> {
  render() {
    const { isPlayback, path, data, dataFn, search, type } = this.props;
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
      <div>
        <h2>First text</h2>
        <ReactiveRichText
          userId={this.props.userId}
          ref={this.ref}
          path="text"
          dataFn={dataFn}
        />
        <h2>Second text</h2>
        <ReactiveRichText
          userId={this.props.userId}
          ref={this.ref}
          path="text2"
          dataFn={dataFn}
        />
      </div>
    );
  }
}

export default ({
  name: 'Double rich text',
  id: 'li-doubleRichText',
  liDataStructure: { text: '', text2: '' },
  ThumbViewer: FlexViewer,
  Viewer: FlexViewer,
  Editor
}: LearningItemT<{ title: string, content: string }>);
