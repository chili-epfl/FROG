// @flow

import * as React from 'react';
import { type LearningItemT, ReactiveText } from 'frog-utils';

const ThumbViewer = ({ LearningItem, data }) => (
  <React.Fragment>
    <b>{data.group}</b>
    <br />
    {data.attachments.map(x => (
      <LearningItem key={JSON.stringify(x)} id={x} type="thumbView" />
    ))}
  </React.Fragment>
);

const Viewer = ({ LearningItem, data }) => (
  <React.Fragment>
    <b>{data.group}</b>
    <br />
    {data.attachments.length === 1 ? (
      <LearningItem id={data.attachments[0]} type="view" />
    ) : (
      data.attachments.map(x => (
        <LearningItem
          clickZoomable
          key={JSON.stringify(x)}
          id={x}
          type="thumbView"
        />
      ))
    )}
  </React.Fragment>
);

const Editor = ({ data, dataFn, LearningItem }) => (
  <React.Fragment>
    <div className="bootstrap">
      <b>Group name:</b>
      <ReactiveText type="textinput" path="group" dataFn={dataFn} />
    </div>
    <p>Click on an attachment to delete it</p>
    {data.attachments.map((x, i) => (
      <span
        key={JSON.stringify(x)}
        onClick={() => dataFn.listDel(x, ['attachments', i])}
      >
        <dataFn.LearningItem id={x} type="thumbView" />
      </span>
    ))}
    <div style={{ position: 'absolute', right: '0px' }}>
      <LearningItem
        type="create"
        liType="li-image"
        onCreate={e => dataFn.listAppend(e, 'attachments')}
      />
    </div>
  </React.Fragment>
);

export default ({
  name: 'CS211 competition entry',
  id: 'li-cs211',
  ThumbViewer,
  Viewer,
  Editor,
  dataStructure: { group: '', attachments: [] }
}: LearningItemT<{ group: string, attachments: any[] }>);
