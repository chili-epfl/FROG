import * as React from 'react';
import { type LearningItemT, HTML } from 'frog-utils';

const ThumbViewer = ({ data }) => (
  <React.Fragment>
    <img alt="rss logo" src="/file?name=op/op-rss/rss-logo.png" />
    <b>
      {data.title} <i>(from {data.blogtitle}</i>
    </b>
    <br />
    {data.date && `${data.date} - `}
    {data.author && `by ${data.author}`}
  </React.Fragment>
);

const Viewer = ({ data }) => (
  <React.Fragment>
    <img alt="rss logo" src="/file?name=op/op-rss/rss-logo.png" />
    <b>
      <a href={data.link}>{data.title}</a> <i>(from {data.blogtitle}</i>
    </b>
    <br />
    {data.date && `${data.date} - `}
    {data.author && `by ${data.author}`}
    <br />
    {data.categories && `Categories: ${data.categories}`}
    <br />
    <HTML html={data.content} />
  </React.Fragment>
);

export default ({
  name: 'Hypothesis',
  id: 'li-rss',
  dataStructure: { title: '', content: '' },
  ThumbViewer,
  Viewer
}: LearningItemT<{ title: string, content: string }>);
