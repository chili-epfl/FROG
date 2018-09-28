import * as React from 'react';
import { type LearningItemT, ReactiveText, shorten } from 'frog-utils';
import { withStyles } from '@material-ui/core/styles';
import { FlexViewer, Editor } from '../li-textArea';

export default ({
  name: 'Large text area',
  id: 'li-largeTextArea',
  dataStructure: { text: '' },
  ThumbViewer: props => <FlexViewer {...props} shouldShorten />,
  Viewer: FlexViewer,
  Editor: props => <Editor {...props} large />
}: LearningItemT<{ title: string, content: string }>);
