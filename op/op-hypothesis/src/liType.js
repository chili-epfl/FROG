import * as React from 'react';
import { type LearningItemT } from 'frog-utils';
import Viewer from './hypothesis';

const ThumbViewer = ({ data }) => <Viewer data={data} shouldShorten />;

export default ({
  name: 'Hypothesis',
  id: 'li-hypothesis',
  dataStructure: { title: '', content: '' },
  Viewer,
  ThumbViewer
}: LearningItemT<{ title: string, content: string }>);
