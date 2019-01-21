// @flow

import * as React from 'react';
import {
  type LearningItemT,
  ReactiveText,
  HighlightSearchText
} from 'frog-utils';

const ThumbViewer = ({ LearningItem, data, search }) => {
  if (
    search &&
    !data.title.toLowerCase().includes(search) &&
    !data.content.toLowerCase().includes(search)
  ) {
    return null;
  }
  return (
    <div>
      <HighlightSearchText haystack={data.title} needle={search} />
      <br />
      {data.content.split('\n').map((line, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={i}>
          <HighlightSearchText haystack={line} needle={search} />
          <br />
        </React.Fragment>
      ))}
      {data.attachments.map(x => (
        <LearningItem key={x} id={x} type="thumbView" />
      ))}
    </div>
  );
};

const Viewer = ({ LearningItem, data, search }) => (
  <div>
    <b>
      <HighlightSearchText haystack={data.title} needle={search} />
    </b>
    <br />
    {data.content.split('\n').map((line, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <React.Fragment key={i}>
        <HighlightSearchText haystack={line} needle={search} />
        <br />
      </React.Fragment>
    ))}
    {data.attachments.length === 1 ? (
      <LearningItem id={data.attachments[0]} type="view" />
    ) : (
      data.attachments.map(x => (
        <LearningItem clickZoomable key={x} id={x} type="thumbView" />
      ))
    )}
  </div>
);

class Editor extends React.Component<*, *> {
  onDrop(e) {
    console.log(e);
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
          <ReactiveText path="content" type="textarea" dataFn={dataFn} />
        </div>
        {data.attachments.map((x, i) => (
          <span key={x} onClick={() => dataFn.listDel(x, ['attachments', i])}>
            <dataFn.LearningItem id={x} type="thumbView" />
          </span>
        ))}
        <div>
          <LearningItem
            type="create"
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
  ThumbViewer,
  Viewer,
  Editor,
  dataStructure: { title: '', content: '', attachments: [] },
  search: (data, search) =>
    data.title.toLowerCase().includes(search) ||
    data.content.toLowerCase().includes(search),
  canDropLI: true
}: LearningItemT<{ title: string, content: string, attachments: any[] }>);
