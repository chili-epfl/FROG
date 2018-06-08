import * as React from 'react';
import { type LearningItemT, HTML } from 'frog-utils';

const ThumbViewer = ({ data }) => (
  <React.Fragment>
    <img
      alt="hypothesis logo"
      src="/file?name=op/op-hypothesis/hypothesis-logo.png"
    />
    <b>{data.title}</b>
    <br />
    <HTML html={data.content} />
    ))}
  </React.Fragment>
);

export default ({
  name: 'Hypothesis',
  id: 'li-hypothesis',
  dataStructure: { title: '', content: '' },
  ThumbViewer
}: LearningItemT<{ title: string, content: string }>);
