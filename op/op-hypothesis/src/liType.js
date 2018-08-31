import * as React from 'react';
import { type LearningItemT } from 'frog-utils';

const ThumbViewer = ({ data }) => (
  <div>
    <img alt="hypothesis logo" src="https://i.imgur.com/dNR3ZMs.png" />
    <b>{data.title}</b>
    <br />
    {data.content.split('\n').map((line, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ))}
  </div>
);

export default ({
  name: 'Hypothesis',
  id: 'li-hypothesis',
  dataStructure: { title: '', content: '' },
  ThumbViewer
}: LearningItemT<{ title: string, content: string }>);
