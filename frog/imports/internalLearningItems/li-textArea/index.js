import * as React from 'react';
import { type LearningItemT, ReactiveText, shorten } from 'frog-utils';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  button: {
    float: 'right'
  },
  editorContainer: {
    display: 'flex',
    flexDirection: 'column'
  }
});

export const FlexViewer = withStyles(styles)(
  ({ classes, data, shouldShorten }) => (
    <div className={classes.editorContainer}>
      {(shouldShorten ? shorten(data.text, 150) : data.text)
        .split('\n')
        .map((line, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={i}>
            {line}
            <br />
          </React.Fragment>
        ))}
    </div>
  )
);

export const Editor = withStyles(styles)(({ dataFn, classes, large }) => (
  <div className={classes.editorContainer}>
    <ReactiveText
      style={{ height: '600px' }}
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
  dataStructure: { text: '' },
  ThumbViewer: props => <FlexViewer {...props} shouldShorten />,
  Viewer: FlexViewer,
  Editor
}: LearningItemT<{ title: string, content: string }>);
