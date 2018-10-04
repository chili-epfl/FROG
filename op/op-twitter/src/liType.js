import * as React from 'react';
import { type LearningItemT } from 'frog-utils';
import ReactTweet from '@houshuang/react-tweet';

const ThumbViewer = ({ data, search }) => {
  if (
    search &&
    (!data.full_text || !data.full_text.toLowerCase().includes(search))
  ) {
    return null;
  }
  return <ReactTweet data={data} />;
};

export default ({
  name: 'Tweet',
  id: 'li-twitter',
  dataStructure: { title: '', content: '' },
  ThumbViewer
}: LearningItemT<{ title: string, content: string }>);
