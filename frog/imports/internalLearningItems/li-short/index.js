import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  type LearningItemT,
  ReactiveText,
  HighlightSearchText
} from 'frog-utils';

const styles = () => ({
  button: {
    float: 'right'
  },
  editorContainer: {
    display: 'flex',
    flexDirection: 'column'
  }
});

const ThumbViewer = ({ data, search }) => (
  <div style={{ fontSize: '2em', minWidth: '200px' }}>
    <b>
      <HighlightSearchText haystack={data.topic} needle={search} />
    </b>
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
  liDataStructure: { topic: '' },
  ThumbViewer,
  Editor,
  search: (data, search) => data.topic.toLowerCase().includes(search)
}: LearningItemT<{ topic: string, content: string }>);
