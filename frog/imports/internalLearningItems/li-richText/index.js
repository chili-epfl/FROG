import * as React from 'react';
import {
  type LearningItemT,
  ReactiveText,
  ReactiveRichText,
  shorten,
  HighlightSearchText
} from 'frog-utils';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  button: {
    float: 'right'
  }
});

export const FlexViewer = withStyles(styles)(({ data, search, type }) => {
  const shouldShorten = type === 'thumbView';
  if (search && !data.text.toLowerCase().includes(search)) {
    return null;
  }
  return (
    <div>
      {(shouldShorten ? shorten(data.text, 150) : data.text)
        .split('\n')
        .map((line, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={i}>
            <HighlightSearchText haystack={line} needle={search} />
            <br />
          </React.Fragment>
        ))}
    </div>
  );
});

export const Editor = withStyles(styles)(({ dataFn, classes, large }) => (
  <div className={classes.editorContainer}>
    <ReactiveRichText
      style={large ? { height: '600px' } : {}}
      path="text"
      dataFn={dataFn}
    />
  </div>
));

export default ({
  name: 'Rich text',
  id: 'li-richText',
  dataStructure: { text: '' },
  ThumbViewer: FlexViewer,
  Viewer: FlexViewer,
  Editor
}: LearningItemT<{ title: string, content: string }>);
