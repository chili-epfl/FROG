import * as React from 'react';
import { ReactiveText } from 'frog-utils';

const viewIdea = ({ LearningItem, data }) => (
  <React.Fragment>
    <b>{data.title}</b>
    <br />
    {data.content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ))}
    {data.attachments.map(x => (
      <LearningItem key={x} id={x} type="viewThumb" />
    ))}
  </React.Fragment>
);

const editIdea = ({ LearningItem, data, dataFn }) => (
  <React.Fragment>
    <div className="bootstrap">
      <b>Title:</b>
      <br />
      <ReactiveText
        path="title"
        dataFn={dataFn}
        style={{ width: '80%', height: '100%', fontSize: '20px' }}
      />
      <br />
      <br />
      <b>Content:</b>
      <br />
      <ReactiveText
        path="content"
        type="textarea"
        dataFn={dataFn}
        style={{ width: '80%', height: '100%', fontSize: '20px' }}
      />
    </div>
    {data.attachments.map((x, i) => (
      <span key={x} onClick={() => dataFn.listDel(x, ['attachments', i])}>
        <LearningItem id={x} type="viewThumb" />
      </span>
    ))}
    <LearningItem
      type="create"
      onCreate={e => dataFn.listAppend(e, 'attachments')}
    />
  </React.Fragment>
);

export default {
  viewThumb: viewIdea,
  editable: true,
  zoomable: false,
  edit: editIdea,
  name: 'Idea with attachments',
  id: 'li-ideaCompound',
  dataStructure: { title: '', content: '', attachments: [] }
};
