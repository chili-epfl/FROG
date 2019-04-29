import * as React from 'react';
import { ReactiveRichText } from 'frog-utils';

export class FlexViewer extends React.Component<*, *> {
  render() {
    const { isPlayback, data, dataFn, search, type } = this.props;
    const shouldShorten = type === 'thumbView';

    return (
      <div>
        <h2>First text</h2>
        <ReactiveRichText
          data={isPlayback ? data : undefined}
          shorten={shouldShorten && 150}
          path="text"
          readOnly
          dataFn={dataFn}
          search={search}
        />
        <h2>Second text</h2>
        <ReactiveRichText
          data={isPlayback ? data : undefined}
          shorten={shouldShorten && 150}
          path="text2"
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
  liDataStructure: {
    text: {
      ops: [
        {
          insert: '\n'
        }
      ]
    },
    text2: {
      ops: [
        {
          insert: '\n'
        }
      ]
    }
  },
  ThumbViewer: FlexViewer,
  Viewer: FlexViewer,
  Editor
}: LearningItemT<{ title: string, content: string }>);
