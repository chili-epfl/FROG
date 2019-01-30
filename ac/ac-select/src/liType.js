// @flow
import * as React from 'react';
import { type LearningItemT } from 'frog-utils';

const ThumbViewer = ({ data }) => (
  <div
    style={{
      textAlign: 'left',
      fontSize: '2em',
      backgroundColor: data.color === '#FFFF00' ? '#FFFFFF' : data.color,
      color: '#000000',
      margin: '3px'
    }}
  >
    {data.word}
  </div>
);

export default ({
  name: 'Selected Word',
  id: 'li-wordSelect',
  dataStructure: { word: '', color: '' },
  ThumbViewer
}: LearningItemT<{ word: string, color: string }>);
