import * as React from 'react';
import {
  type LearningItemT,
  ReactiveText,
  HighlightSearchText
} from 'frog-utils';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  button: {
    float: 'right'
  }
});

const FlexViewer = withStyles(styles)(({ data, search, type }) => {
  const shouldShorten = type === 'thumbView';
  return (
    <HighlightSearchText
      haystack={data.text}
      needle={search}
      shorten={shouldShorten}
    />
  );
});

const Editor = withStyles(styles)(({ dataFn, classes, large }) => (
  <div className={classes.editorContainer}>
    <ReactiveText
      style={large ? { height: '600px' } : {}}
      path="text"
      dataFn={dataFn}
      type="textarea"
      rows={large && 20}
    />
  </div>
));

export default ({
  name: 'Text area',
  id: 'li-textArea',
  liDataStructure: { text: '' },
  ThumbViewer: FlexViewer,
  Viewer: FlexViewer,
  Editor,
  search: (data, search) => data.text.toLowerCase().includes(search)
}: LearningItemT<{ title: string, content: string }>);
