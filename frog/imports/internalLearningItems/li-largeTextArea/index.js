// @flow

import * as React from 'react';
import { type LearningItemT } from 'frog-utils';
import { FlexViewer, Editor } from '../li-textArea';

export default ({
  name: 'Large text area',
  id: 'li-largeTextArea',
  dataStructure: { text: '' },
  ThumbViewer: FlexViewer,
  Viewer: FlexViewer,
  Editor: props => <Editor {...props} large />
}: LearningItemT<{ text: string }>);
