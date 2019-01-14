// @flow

import * as React from 'react';
import { type LearningItemT } from 'frog-utils';
import TextArea from '../li-textArea';

export default ({
  name: 'Large text area',
  id: 'li-largeTextArea',
  dataStructure: { text: '' },
  ThumbViewer: TextArea.FlexViewer,
  Viewer: TextArea.FlexViewer,
  Editor: props => <TextArea.Editor {...props} large />,
  search: TextArea.search
}: LearningItemT<{ text: string }>);
