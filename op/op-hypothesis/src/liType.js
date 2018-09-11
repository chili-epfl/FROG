import * as React from 'react';
import { type LearningItemT, shorten } from 'frog-utils';

const GenericViewer = ({ data, shouldShorten }) => (
  <div>
    <img alt="hypothesis logo" src="https://i.imgur.com/dNR3ZMs.png" />
    <b>{shouldShorten ? shorten(data.title, 30) : data.title}</b>
    <br />
    {(shouldShorten ? shorten(data.content, 150) : data.content)
      .split('\n')
      .map((line, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={i}>
          {line}
          <br />
        </React.Fragment>
      ))}
  </div>
);

const Viewer = ({ data }) => <GenericViewer data={data} />;

const ThumbViewer = ({ data }) => <GenericViewer data={data} shouldShorten />;

export default ({
  name: 'Hypothesis',
  id: 'li-hypothesis',
  dataStructure: { title: '', content: '' },
  Viewer,
  ThumbViewer
}: LearningItemT<{ title: string, content: string }>);
