// @flow
import * as React from 'react';
import { omit } from 'lodash';

import ReactiveHOC from './ReactiveHOC';

const IdeaLI = ({ data }) => (
  <p>
    <b>{data.title}</b>
    <br />
    {data.content}
  </p>
);

const learningItemTypesObj = { 'li-idea': IdeaLI };

const RenderLearningItem = ({ data, dataFn, render }) => {
  const Component = learningItemTypesObj[data.liType];
  if (!Component) {
    return <b>Unsupported learning item type {JSON.stringify(data.liType)}</b>;
  } else if (render) {
    return render({
      meta: { id: dataFn.doc.id, ...omit(data, 'payload') },
      dataFn,
      children: <Component data={data.payload} />
    });
  } else {
    return <Component data={data.payload} />;
  }
};

const LearningItem = ({ id, render }: { id: string, render?: Function }) => {
  const ToRun = ReactiveHOC(id, undefined, undefined, undefined, 'li')(
    RenderLearningItem
  );
  return <ToRun render={render} />;
};

export default LearningItem;
