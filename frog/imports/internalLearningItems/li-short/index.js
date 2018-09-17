import * as React from 'react';

import { withStyles } from '@material-ui/core/styles';

import { type LearningItemT, ReactiveText } from 'frog-utils';

const styles = () => ({
  button: {
    float: 'right'
  },
  editorContainer: {
    display: 'flex',
    flexDirection: 'column'
  }
});

const ThumbViewer = ({ data }) => (
  <div style={{ minWidth: '200px' }}>
    <b>{data.topic}</b>
  </div>
);

const Editor = withStyles(styles)(({ dataFn, classes }) => (
  <div className={classes.editorContainer}>
    <ReactiveText path="topic" dataFn={dataFn} />
  </div>
));

export default ({
  name: 'Single Word/Sentence',
  id: 'li-short',
  dataStructure: { topic: '' },
  ThumbViewer,
  Editor
}: LearningItemT<{ topic: string, content: string }>);
