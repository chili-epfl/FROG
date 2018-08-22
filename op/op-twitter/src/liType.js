import * as React from 'react';
import { type LearningItemT } from 'frog-utils';
import ReactTweet from 'react-tweet';

const ThumbViewer = ({ data }) => <ReactTweet data={data} />;

export default ({
  name: 'Tweet',
  id: 'li-twitter',
  dataStructure: { title: '', content: '' },
  ThumbViewer
}: LearningItemT<{ title: string, content: string }>);
