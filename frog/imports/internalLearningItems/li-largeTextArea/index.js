// @flow

import * as React from 'react';
import { type LearningItemT } from '/imports/frog-utils';
import TextArea from '../li-textArea';

export default ({
  name: 'Large text area',
  id: 'li-largeTextArea',
  liDataStructure: { text: '' },
  ThumbViewer: TextArea.ThumbViewer,
  Viewer: props => <TextArea.Viewer {...props} large />,
  Editor: props => <TextArea.Editor {...props} large />,
  search: TextArea.search
}: LearningItemT<{ text: string }>);
