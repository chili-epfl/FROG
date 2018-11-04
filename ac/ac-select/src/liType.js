// @flow
import * as React from 'react';
import { type LearningItemT } from 'frog-utils';

const ThumbViewer = ({ data }) => (
  <div style={{ fontSize: '1em', backgroundColor: data.color }}>
    {data.word}
  </div>
);

export default ({
  name: 'Selected Word',
  id: 'li-wordSelect',
  dataStructure: { word: '', color: '' },
  ThumbViewer
}: LearningItemT<{ word: string, color: string }>);
