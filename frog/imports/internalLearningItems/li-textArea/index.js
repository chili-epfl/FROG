// @flow

import * as React from 'react';
import {
  type LearningItemT,
  ReactiveText,
  HighlightSearchText
} from '/imports/frog-utils';

const FlexViewer = ({ data, search, type }) => {
  const shouldShorten = type === 'thumbView';
  return (
    <HighlightSearchText
      haystack={data.text}
      needle={search}
      shorten={shouldShorten}
    />
  );
};

const Editor = ({ dataFn }) => {
  return (
    <ReactiveText
      style={{ height: '400px' }}
      path="text"
      dataFn={dataFn}
      type="textarea"
      rows={20}
    />
  );
};

export default ({
  name: 'Text area',
  id: 'li-textArea',
  dataStructure: { text: '' },
  ThumbViewer: props => <FlexViewer {...props} type="thumbView" />,
  Viewer: props => <FlexViewer {...props} type="normalView" />,
  Editor,
  search: (data, search) => data.text.toLowerCase().includes(search)
}: LearningItemT<{ text: string }>);
