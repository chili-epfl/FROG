import * as React from 'react';
import { type LearningItemT } from 'frog-utils';
import Viewer from './hypothesis';

export default ({
  name: 'Hypothesis',
  id: 'li-hypothesis',
  dataStructure: { title: '', content: '' },
  Viewer,
  ThumbViewer: Viewer
}: LearningItemT<{ title: string, content: string }>);
