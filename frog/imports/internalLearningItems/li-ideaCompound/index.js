import * as React from 'react';
import { ReactiveText } from 'frog-utils';
import { isEqual } from 'lodash';

const viewIdea = ({ dataFn, data }) => (
  <React.Fragment>
    <b>{data.title}</b>
    <br />
    {data.content.split('\n').map((line, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ))}
    {data.attachments.map(x => (
      <dataFn.LearningItem key={x} id={x} type="viewThumb" />
    ))}
  </React.Fragment>
);

class EditIdea extends React.Component<any, any> {
  render = () => {
    const { data, dataFn } = this.props;
    return (
      <React.Fragment>
        <div className="bootstrap">
          <b>Title:</b>
          <br />
          <ReactiveText path="title" dataFn={dataFn} />
          <br />
          <br />
          <b>Content:</b>
          <br />
          <ReactiveText path="content" type="textarea" dataFn={dataFn} />
        </div>
        {data.attachments.map((x, i) => (
          <span key={x} onClick={() => dataFn.listDel(x, ['attachments', i])}>
            <dataFn.LearningItem id={x} type="viewThumb" />
          </span>
        ))}
        <dataFn.LearningItem
          type="create"
          onCreate={e => dataFn.listAppend(e, 'attachments')}
        />
      </React.Fragment>
    );
  };
}

export default {
  viewThumb: viewIdea,
  editable: true,
  zoomable: false,
  edit: EditIdea,
  name: 'Idea with attachments',
  id: 'li-ideaCompound',
  dataStructure: { title: '', content: '', attachments: [] }
};
