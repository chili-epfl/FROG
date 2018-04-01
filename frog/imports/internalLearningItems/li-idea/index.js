import * as React from 'react';
import { ReactiveText } from 'frog-utils';

const viewIdea = ({ data }) => (
  <React.Fragment>
    <b>{data.title}</b>
    <br />
    {data.content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ))}
  </React.Fragment>
);

const editIdea = ({ dataFn }) => (
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
);

export default {
  viewThumb: viewIdea,
  editable: true,
  zoomable: false,
  edit: editIdea,
  name: 'Idea',
  id: 'li-idea',
  dataStructure: { title: '', content: '' }
};
