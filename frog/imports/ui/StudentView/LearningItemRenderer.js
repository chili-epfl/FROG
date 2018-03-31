// @flow
import * as React from 'react';
import { omit } from 'lodash';
import { ReactiveText } from 'frog-utils';

import ReactiveHOC from './ReactiveHOC';

const viewIdea = ({ data }) => (
  <p>
    <b>{data.title}</b>
    <br />
    {data.content}
  </p>
);

const editIdea = ({ dataFn }) => (
  <div>
    <ReactiveText
      path="title"
      dataFn={dataFn}
      placeholder="Title"
      style={{ width: '100%', height: '100%', fontSize: '20px' }}
    />
    <ReactiveText
      path="content"
      dataFn={dataFn}
      placeholder="Content"
      style={{ width: '100%', height: '100%', fontSize: '20px' }}
    />
  </div>
);

const ideaLI = {
  view: viewIdea,
  edit: editIdea,
  name: 'Idea'
};

const learningItemTypesObj = { 'li-idea': ideaLI };

const RenderLearningItem = ({ data, dataFn, render, type = 'view' }) => {
  const Component = learningItemTypesObj[data.liType][type];
  if (!Component) {
    return <b>Unsupported learning item type {JSON.stringify(data.liType)}</b>;
  } else if (render) {
    return render({
      meta: { id: dataFn.doc.id, ...omit(data, 'payload') },
      dataFn,
      children: (
        <Component data={data.payload} dataFn={dataFn.specialize('payload')} />
      )
    });
  } else {
    return <Component data={data.payload} />;
  }
};

const LearningItem = ({
  id,
  render,
  type
}: {
  id: string,
  render?: Function,
  type?: string
}) => {
  const ToRun = ReactiveHOC(id, undefined, undefined, undefined, 'li')(
    RenderLearningItem
  );
  return <ToRun render={render} type={type} />;
};

export default LearningItem;
