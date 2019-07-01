import * as React from 'react';
import { type LearningItemT } from 'frog-utils';
import ReactTweet from '@houshuang/react-tweet';

const ThumbViewer = ({ data }) => <ReactTweet data={data} />;

export default ({
  name: 'Tweet',
  id: 'li-twitter',
  dataStructure: { title: '', content: '' },
  ThumbViewer,
  search: (data, search) =>
    data.full_text && data.full_text.toLowerCase().includes(search)
}: LearningItemT<{ title: string, content: string }>);
