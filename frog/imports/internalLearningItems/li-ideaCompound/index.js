// @flow

import * as React from 'react';
import {
  type LearningItemT,
  ReactiveText,
  HighlightSearchText
} from '/imports/frog-utils';
import ReactiveRichText from '/imports/frog-utils/ReactiveRichTextProxy';
import { get, isString } from 'lodash';

const FlexViewer = ({ LearningItem, data, search, dataFn, type }: Object) => {
  const shouldShorten = type === 'thumbView';

  return (
    <div>
      <HighlightSearchText haystack={data.title} needle={search} />
      <br />
      <ReactiveRichText
        readOnly
        path="contents"
        data={data}
        dataFn={dataFn}
        search={search}
        shorten={shouldShorten ? 150 : undefined}
      />
      {data.attachments.map(x => (
        <LearningItem key={x} id={x} type="thumbView" />
      ))}
    </div>
  );
};

class Editor extends React.Component<*, *> {
  onDrop(e) {
    this.props.dataFn.listAppend(e, 'attachments');
  }

  render() {
    const { data, dataFn, LearningItem } = this.props;
    return (
      <div>
        <div>
          <b>Title:</b>
          <br />
          <ReactiveText type="textinput" path="title" dataFn={dataFn} />
          <br />
          <br />
          <b>Content:</b>
          <br />
          <ReactiveRichText path="contents" dataFn={dataFn} />
        </div>
        {data.attachments.map((x, i) => (
          <span key={x} onClick={() => dataFn.listDel(x, ['attachments', i])}>
            <dataFn.LearningItem id={x} type="thumbView" />
          </span>
        ))}
        <div>
          <LearningItem
            type="create"
            liType="li-image"
            onCreate={e => dataFn.listAppend(e, 'attachments')}
          />
        </div>
      </div>
    );
  }
}

export default ({
  name: 'Idea with attachments',
  id: 'li-ideaCompound',
  ThumbViewer: FlexViewer,
  Viewer: FlexViewer,
  Editor,
  liDataStructure: {
    title: '',
    attachments: [],
    contents: {
      ops: [
        {
          insert: '\n'
        }
      ]
    }
  },
  canDropLI: true,
  search: (data, search, dataFn, isPlayback) => {
    const editorContent = isPlayback
      ? get(data, 'content')
      : get(dataFn.doc.data, dataFn.getMergedPath('content'));
    const textContent = editorContent.ops.map(op => {
      if (isString(op.insert)) {
        return op.insert;
      }
      return '';
    });
    return (
      textContent
        .join('')
        .toLowerCase()
        .includes(search) || data.title.toLowerCase().includes(search)
    );
  }
}: LearningItemT<*>);
