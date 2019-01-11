// @flow

import * as React from 'react';
import { type LearningItemT } from 'frog-utils';
import { search, FlexViewer, Editor } from '../li-textArea';

export default ({
  name: 'Large text area',
  id: 'li-largeTextArea',
  dataStructure: { text: '' },
  ThumbViewer: FlexViewer,
  Viewer: FlexViewer,
  Editor: props => <Editor {...props} large />,
  search
}: LearningItemT<{ text: string }>);
